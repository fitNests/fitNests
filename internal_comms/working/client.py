import sys
import threading
import re
import socket
import random

from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode
from bluepy.btle import Scanner, DefaultDelegate, Peripheral, BTLEDisconnectError
# from bluepy_edit.btle import Scanner, DefaultDelegate, Peripheral, BTLEDisconnectError
from time import sleep, time
from collections import deque
from random import uniform,randint

BLE_SERVICE_UUID = "0000dfb0-0000-1000-8000-00805f9b34fb"
BLE_CHARACTERISTIC_UUID = "0000dfb1-0000-1000-8000-00805f9b34fb"
PACKET_SIZE = 19
PACKET_ZERO_OFFSET = 13500
BUFFER_SKIP = 'xxx111xxx111xxx111x'
HANDSHAKE_FLAG = 1
GOOD_DATA_FLAG = 2

###

#BEETLES' MAC ADDRESSES
#Format: <MAC_IN_LOWERCASE>:<DEVICE_NUM>
bt_addrs = {"34:15:13:22:a9:be":0,
            "2c:ab:33:cc:68:fa":1, 
            "34:15:13:22:96:6f":2, 
            "c8:df:84:fe:3f:f4":3}
            
#Sets all addresses to "not connected"
bt_addrs_isConnected = {}
for addr in bt_addrs:
    bt_addrs_isConnected[addr] = False

delayWindow = []
for i in range(4):
    delayWindow.append(i*0.621)

connections = {} #Stores peripherals of each beetle
connection_threads = {} #Stores threads linked to peripherals --useless atm
endFlag = False
scanner = Scanner(0)
totalDevicesConnected = 0
lock = threading.Lock()

#Debugging
printRawData = 0
printError = 0
printGoodData = 1
printSummary = 1

#Set to 1 send to socket!
clientFlag = 0

#Client
ip_addr = 'localhost'
port_num = 8080
secret_key = 'thisisunhackable'
client = None

###

# dummy data for test purposes. not even a good one at that
def construct_message(data=None):
    # test data temporary format is '#[deviceID]|[x]|[y]|[z]|[y]|[p]|[r]|[timestamp]
    msg = '#'
    if data is not None:
        for element in data:
            msg += str(element) + '|'
    else:
        test_data = [random.choice(DEVICE), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000),
                    random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000)]
        for element in test_data:
            msg = msg + str(element) + '|'
    return msg[:-1]

def convertAndSendData(dataString, deviceId):
    pass
    
    ls = []
    ls.append(int(deviceId))
    ls += list(map(int, dataString.split('.')))
    ls.append(random.randint(1, 10000))
    msgList = construct_message(ls)
    # print(ls)
    client.send_data(msgList)


'''
    Client Class for sending to FPGA
'''
class Client():
    def __init__(self, ip_address, port_num, secret_key):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        self.secret_key = str(secret_key).encode('utf8')
        print(f"ULTRA96 client is connected to Ultra96 through: {ip_address}:{port_num}")

    '''
    msg str format is : '#[deviceID]|[x]|[y]|[z]|[y]|[p]|[r]|[timestamp]'
    timestamp can be some int if not using
    also encryption/decryption padding might not be compatible or smth sometimes
    the last byte is decrypted as nonsense on server side
    '''
    def send_data(self, msg):
        # test_string = "#" + position + "|" + action + "|" + delay + "|"
        to_send = self.encrypt_message(msg)
        # print("to send:", to_send)
        
        self.sock.sendall(to_send)
        

    def stop(self):
        self.sock.close()

    def encrypt_message(self, msg):
        message_bytes = str(msg).encode('utf8')
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(pad(message_bytes, AES.block_size))
        encoded = b64encode(iv + encrypted)
        return encoded


"""
    Buffering and reassembling packets here
"""
class BufferHandler():
    def __init__(self, number):
        self.number = str(number)
        self.bufferQueue = []
        self.buffer = None
        self.isAcknowledged = False
        self.hmap = {10:'a', 11:'b', 12:'c', 13:'d', 14:'e', 15:'f'} #--deprecated
    
    """
    # Data is in string format, 20bytes, base30, offset13500
    # Format: data[0] = deviceId, 
    #         data[1:19] = xyz,yaw,pitch,roll (3bytes each), 
    #         data[19] = checksum -- ignore since we already validate beforehand
    # Returns output (str)
    """
    def convertToDecimal(self, data):
        def base30ToDecimal(data):
            decimal = 0
            for i in range(len(data)):
                decimal *= 30
                decimal += (ord(data[i]) - 48) if data[i].isnumeric() else (ord(data[i]) - 97 + 10)
            decimal -= PACKET_ZERO_OFFSET
            return decimal
        
        # If not proper format (6*3 sensor bytes + 1 checksum|id)
        if len(data) != PACKET_SIZE:
            return data
        output = ''
        data = data[:PACKET_SIZE-1].lower() #str
        for i in range(0, PACKET_SIZE-2, 3):
            output += str(base30ToDecimal(data[i:i+3])) + '.'
        output = output[:-1]
        return output
    
    # Function to return back checksum value (in decimal) [0, 15]
    def xor(self, st):
        #Compresses checksum value to within HEX [0,15]
        def compress(num):
            if num < 10:
                return num
            return num%10 ^ compress(num//10)
            
        output = 0
        for i in range(len(st)):
            output ^= ord(st[i])
        out = compress(output)
        return out
    
    # Function to return actual decimal value of checksum from its (checksum|id) ASCII-format
    def getChksum(self, c):
        return ord(c.lower()) - 97
    
    # Function to check current packet's validity via checksum/handshake/ascii
    def checkValidity(self, data):
        #Only accepts values between '0' and 'z'
        def is_ascii(s):
            return all((ord(c) < 128 and ord(c) > 47) for c in s)
        
        if not is_ascii(data): #Reject out non-ascii characters
            return False
        elif len(data) == 1 and data[0] == 'A': #Acknowledge handshake packet
            self.isAcknowledged = True
            return HANDSHAKE_FLAG
        elif len(data) == PACKET_SIZE and self.getChksum(data[PACKET_SIZE-1]) == self.xor(data[:PACKET_SIZE-1]): #Check valid checksum (int==int)
            return GOOD_DATA_FLAG
        return False
    
    # Function to validate if packet needs buffering or isComplete
    def isCompleteBuffer(self, data, msgCount):
        #Accepts either 1) 'A'(for handshaking) or 2) Valid packets(checksum)
        if self.checkValidity(data):
            self.bufferQueue = ''
            return GOOD_DATA_FLAG
        #If check fails, do buffering since data is either: 1) incomplete or 2) overflows
        if self.isAcknowledged:
            #Filter out nonsense bytes
            output = list(filter(None, re.split(r'[\x00-\x20]', data)))
           
            #Only execute when output is not empty
            if len(output) > 0:
                assembledString = ''
                debugFlag = ''
                if len(self.bufferQueue) == 0:
                    # CASE 0
                    # ONLY DONE AFTER HANDSHAKE
                    # SINCE HANDSHAKE MESSES UP SUBSEQUENT PACKETS...
                    if msgCount == 2:
                        if self.checkValidity(output[0][1:PACKET_SIZE+1]):
                            assembledString = output[0][1:PACKET_SIZE+1]
                        else: #Only last byte of handshake count matters for next packet
                            self.bufferQueue = output[0][-1]
                            return False
                
                    debugFlag = '!'
                    # CASE A.1 (just right)
                    # If empty, expected that len(data) > PACKET_SIZE (data:20)
                    if len(output[0]) == PACKET_SIZE+1: #valid(19) + overflow(1)
                        self.bufferQueue += output[0][PACKET_SIZE]
                        assembledString = output[0][:PACKET_SIZE]
                    # CASE A.2 (shortage)
                    # If empty, expected that len(data) < PACKET_SIZE (data:<19)
                    else:
                        self.bufferQueue = output[0]
                        assembledString = BUFFER_SKIP
                    debugFlag += output[0]
                    debugFlag += '!'
                else:
                    # CASE B (perfect fit)
                    # expected that len(data) = PACKET_SIZE-1 (data:18)
                    # Match the single char from bufferQueue with new data
                    if len(output[0]) + len(self.bufferQueue) == PACKET_SIZE:
                        debugFlag = '@'
                        assembledString = self.bufferQueue + output[0]
                        self.bufferQueue = ''
                        debugFlag += output[0]
                        debugFlag += '@'
                    # CASE C (leftover)
                    # if handleNotification() called while processing this isCompleteBuffer()
                    # Clear previous buffer, perform rest same as CASE A
                    # Expected len(data) is 20
                    elif len(output[0]) + len(self.bufferQueue) > PACKET_SIZE:
                        if len(output[0]) + len(self.bufferQueue) > 2*PACKET_SIZE:
                            print('What.', 'EXCEEDED 40 BYTES!!!')
                        debugFlag = '#'
                        
                        if self.checkValidity(output[0][:PACKET_SIZE]): #Special case right after handshake
                            self.bufferQueue = output[0][PACKET_SIZE]
                            assembledString = output[0][:PACKET_SIZE]
                        else: #Normal cases
                            bytesLeft = PACKET_SIZE - len(self.bufferQueue)
                            assembledString = self.bufferQueue + output[0][:bytesLeft]
                            self.bufferQueue = output[0][bytesLeft:]
                        debugFlag += output[0]
                        debugFlag += '#'
                    # CASE D (shortage)
                    # len(output[0]) + len(self.bufferQueue) < PACKET_SIZE
                    else: 
                        debugFlag = '$'
                        self.bufferQueue += output[0]
                        assembledString = BUFFER_SKIP
                        debugFlag += output[0]
                        debugFlag += '$'
                
                #For debugging purposes [error packets]
                if printError:
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"    F,{debugFlag}: <{assembledString}> Q=[{self.bufferQueue}] ({msgCount})", file=text_file)
                
                #Returns true if current assembledString is valid
                if self.checkValidity(assembledString):
                    self.buffer = assembledString
                    return GOOD_DATA_FLAG
        return False

"""
    Handle packets received from beetle(s)
"""
class NotificationDelegate(DefaultDelegate):
    def __init__(self, number):
        DefaultDelegate.__init__(self)
        self.number = str(number)
        self.baseTime = self.pastTime = time()
        self.msgCount = self.goodPacketCount = self.goodPacketsArm = self.goodPacketsBody = 0
        self.bH = BufferHandler(number)

    def handleNotification(self, cHandle, data):
        self.msgCount += 1
        try:
            data = data.decode("utf-8")
            #For debugging purposes [raw data]
            if printRawData:
                with open(f"laptopdata{self.number}.txt", "a") as text_file:
                    print(f"        D:{data} ({self.msgCount})", file=text_file)
            flag = self.bH.checkValidity(data)
            if flag == HANDSHAKE_FLAG:
                if printGoodData:
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"D:{data}, HANDSHAKE! ({self.msgCount})", file=text_file)
                return
            if self.bH.isCompleteBuffer(data, self.msgCount):
                self.goodPacketCount += 1
                deviceId = None
                if self.bH.buffer:
                    data = self.bH.buffer
                    self.bH.buffer = None
                    flag = 'AS'
                if flag and (self.msgCount > 1 or time() - self.baseTime > 5):
                    if data[PACKET_SIZE-1].islower():
                        deviceId = 0
                        self.goodPacketsArm += 1
                    else:
                        deviceId = 1
                        self.goodPacketsBody += 1
                '''
                    # Prints individual report
                    # Device:number,flag,deviceID:data |total|goodPacketCount|goodPacketsArm|goodPacketsBody
                '''
                
                # Convert from base30 to decimal, accepts only PACKET_SIZE data (will ignore last checksum byte)
                data = self.bH.convertToDecimal(data)
                if clientFlag:
                    convertAndSendData(data, deviceId)
                #For debugging purposes [good packets]
                if printGoodData:
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"{self.number},{flag} [{deviceId}: {data}] ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})", file=text_file)
            
            #For debugging purposes (Prints every 5s) [Throughput]
            ### Send preprocessed data every 5s
            if time() - self.pastTime >= 5:
                tt = time() - self.baseTime
                print(f"---{self.number}: {tt}s have passed ---")
                print(f"{self.number} ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})")
                if printSummary:
                    #Prints overall report
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"{self.number} ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})", file=text_file)
                        print(f"\n*** {tt}s have passed ***\n", file=text_file)
                self.pastTime = time()
                self.msgCount = self.goodPacketCount = self.goodPacketsArm = self.goodPacketsBody = 0
                
                #Send csv file
                #if client
                
        except:
            #Error decoding using UTF-8
            print('Decode error')

"""
    Manage each connection with a beetle
"""
class ConnectionHandlerThread (threading.Thread):
    def __init__(self, connection_index):
        threading.Thread.__init__(self)
        self.connection_index = connection_index
        self.delay = uniform(0.1, 0.5) #Random delay
        self.isConnected = True
        self.addr = ''

    def reconnect(self, addr):
        global totalDevicesConnected
        global lock
        print('Total devices', totalDevicesConnected)
        #Loop here until reconnected (Thread is doing nothing anyways...)
        while True:
            lock.acquire()
            try:
                if totalDevicesConnected == 0:
                    devices = scanner.scan(2)
                    for d in devices:
                        if d.addr in bt_addrs:
                            if bt_addrs_isConnected[d.addr]:
                                print(d.addr)
                                continue
                            print(f"A: {self.connection_index}, trying...")
                            p = Peripheral(addr)
                            print(f"{self.connection_index}, got it...")
                            #Reset configurations of connection/peripheral (overhead code)
                            self.connection = p
                            self.connection.withDelegate(NotificationDelegate(self.connection_index))
                            self.s = self.connection.getServiceByUUID(BLE_SERVICE_UUID)
                            self.c = self.s.getCharacteristics()[0]
                            connections[self.connection_index] = self.connection
                            bt_addrs_isConnected[addr] = True
                            print("Reconnected to ", addr, '!')
                            self.c.write(("H").encode()) #Need to handshake with beetle again to start sending data
                            self.isConnected = True
                            totalDevicesConnected += 1
                            lock.release()
                            return True
                else:
                    print(f"B: {self.connection_index}, trying...")
                    p = Peripheral(addr)
                    print(f"{self.connection_index}, got it...")
                    #Reset configurations of connection/peripheral (overhead code)
                    self.connection = p
                    self.connection.withDelegate(NotificationDelegate(self.connection_index))
                    self.s = self.connection.getServiceByUUID(BLE_SERVICE_UUID)
                    self.c = self.s.getCharacteristics()[0]
                    connections[self.connection_index] = self.connection
                    bt_addrs_isConnected[addr] = True
                    print("Reconnected to ", addr, '!')
                    self.c.write(("H").encode()) #Need to handshake with beetle again to start sending data
                    self.isConnected = True
                    totalDevicesConnected += 1
                    lock.release()
                    return True
            except:
                print(self.connection_index, "Error when reconnecting..")
                #sleep(delayWindow[randint(0, 3)]) #Delay to avoid hoarding all the processing power
            lock.release()
            sleep(delayWindow[randint(0, 3)]) #Delay to avoid hoarding all the processing power

            
    def run(self):
        global totalDevicesConnected
        #Setup respective delegates, service, characteristic...
        self.connection = connections[self.connection_index]
        self.addr = self.connection.addr
        self.connection.withDelegate(NotificationDelegate(self.connection_index))
        self.s = self.connection.getServiceByUUID(BLE_SERVICE_UUID)
        self.c = self.s.getCharacteristics()[0]
        
        #Delay before Handshake (to avoid any malformed packets somehow)
        print('Start', self.connection_index, self.c.uuid)
        # sleep(self.delay)
        # sleep(delayWindow[randint(0, 3)])
        # print('Done sleep')
        self.c.write(("H").encode())
        
        #Run thread loop forever
        while True:
            #Supposed to write continuously after notification (if connected)...
            if self.isConnected:
                try:
                    if self.connection.waitForNotifications(1): #Executed after every handleNotification(), within the given time
                        pass #But at the moment, just passively receives packets from beetle only
                    else:
                        print(f"{self.connection_index} sending H again")
                        self.c.write(("H").encode())
                except BTLEDisconnectError: #Handles sudden disconnection
                    if endFlag:
                        continue
                    print("Device ", self.connection_index, " disconnected!")
                    self.isConnected = False
                    bt_addrs_isConnected[self.addr] = False
                    self.connection.disconnect()
                    totalDevicesConnected -= 1
                    
            #Whenever state of BLE device is disconnected, run this...
            if not self.isConnected:
                print('Trying to reconnect', self.connection_index)
                if self.reconnect(self.addr):
                    print('Successfully reconnected!')
                else:
                    print('Failed reconnection')
                sleep(self.delay)

"""
    Initial function to establish connection with beetle
"""
def run():
    global totalDevicesConnected
    devices = scanner.scan(3)
    for d in devices:
        if d.addr in bt_addrs:
            if bt_addrs_isConnected[d.addr]:
                continue
            addr = d.addr
            idx = bt_addrs[addr]
            bt_addrs_isConnected[addr] = True
            print(addr, 'found!')
            try:
                p = Peripheral(addr)
                connections[idx] = p
                t = ConnectionHandlerThread(idx)
                t.daemon = True #Set to true so can CTRL-C the program easily
                t.start()
                connection_threads[idx] = t
                totalDevicesConnected += 1
            except: #Raised when unable to create connection
                print('Error in connecting device')
                

"""
    Main function to manage daemon-threads and keep main thread(program) alive
"""
if __name__ == "__main__":
    try:
        if clientFlag:
            client = Client(ip_addr, port_num, secret_key)
        run()
        print('End of initial scan')
        
        while True: #IMPT WHILE LOOP FOR KEEPING THREADS ALIVE!!!
            pass
    except KeyboardInterrupt:
        print('END OF PROGRAM. Disconnecting all devices..')
        endFlag = True
        
