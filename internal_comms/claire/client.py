'''
CHANGE YOUR DANCER_ID HERE!
'''
#Dancers a,b,c = '0','1','2'
DANCER_ID = '0'

#Set to 1 send to socket!
clientFlag = 0
preprocessFlag = 1

#Nic
# bt_addrs = {
# "34:15:13:22:96:6f":1, #Nic Wrist
# "f8:30:02:08:e2:b5":2, #Nic Ankle
            # }

##Rusdi
# bt_addrs = {
# "c8:df:84:fe:52:2b":3,#Rusdi wrist            
# "f8:30:02:08:e5:e3":4, #Rusdi leg
            # }

##Claire
bt_addrs = {
"34:15:13:22:a9:be":5, #Claire Wrist
"f8:30:02:09:17:a4":6, #Claire Ankle
            }

##Jiannan
# bt_addrs = {
# "f8:30:02:09:14:a9":7, #Jiannan wrist
# "c8:df:84:fe:3f:f4":8, #Jiannan leg
            # }

#Umar
# bt_addrs = {
# "2c:ab:33:cc:6a:f6":9, #Umar Wrist
# "2c:ab:33:cc:6a:f6":10, #Umar Ankle 
            # }

#Lincoln
# bt_addrs = {
# "2c:ab:33:cc:68:fa":11, #Lincoln Wrist
# "50:65:83:6f:57:50":12, #Lincoln Ankle
            # }

#############################################

import sys
import threading
import re
import socket
import random
import ntplib
import datetime

#Preprocessing script
import pandas as pd
import numpy as np
import scipy as sp
import scipy.fftpack
from scipy.fftpack import fft
from scipy.signal import welch

from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode
from bluepy.btle import Scanner, DefaultDelegate, Peripheral, BTLEDisconnectError
# from bluepy_edit.btle import Scanner, DefaultDelegate, Peripheral, BTLEDisconnectError
from time import sleep, time
from collections import deque
from random import uniform,randint

#ML stuff
# from sklearn.preprocessing import StandardScaler
# from sklearn.neural_network import MLPClassifier
# from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# import joblib



#Packet Type to send to FPGA_Server
ML_PACKET_TYPE = '0' #Packet: ML dance move
POSITION_PACKET_TYPE = '1' #Packet: Position

#Packet: Position step identifier
MOVE_TYPE_SMALL = '1'
MOVE_TYPE_BIG = '2'

#Debugging
printRawData = 0
printError = 0
printGoodData = 0
printSummary = 0

#Set conversion from base30 to decimal
decimalConvert = 1

#Client
ip_addr = 'localhost'
port_num = 8081
secret_key = 'thisisunhackable'
client = None

BLE_SERVICE_UUID = "0000dfb0-0000-1000-8000-00805f9b34fb"
BLE_CHARACTERISTIC_UUID = "0000dfb1-0000-1000-8000-00805f9b34fb"
PACKET_SIZE = 19
PACKET_ZERO_OFFSET = 13500
BUFFER_SKIP = 'xxx111xxx111xxx111x'
HANDSHAKE_FLAG = 1
GOOD_DATA_FLAG = 2
WINDOW_SIZE = 100
IDLE_STEP = "0,0,0,0,0,0"
SPECIAL_SMALL_STEP = "1111,1111,1111,1111,1111,1111"
SPECIAL_BIG_STEP = "2222,2222,2222,2222,2222,2222"

###

#BEETLES' MAC ADDRESSES
#Format: <MAC_IN_LOWERCASE>:<DEVICE_NUM>
            
#Sets all addresses to "not connected"
bt_addrs_isConnected = {}
for addr in bt_addrs:
    bt_addrs_isConnected[addr] = False

delayWindow = []
for i in range(4):
    delayWindow.append(i*0.621)

#Bluepy code
connections = {} #Stores peripherals of each beetle
connection_threads = {} #Stores threads linked to peripherals --useless atm
endFlag = False
scanner = Scanner(0)
totalDevicesConnected = 0
lock = threading.Lock()

#Preprocessor
outputBuffer = []

#ML stuff
ACTIONS = ['','hair','rocket','zigzag']

#Timestamp
ntpclient = ntplib.NTPClient()
bufferTimestamp = None

#Start of round
isStartOfRound = False

###

# dummy data for test purposes. not even a good one at that
def construct_message(data=None):
    # test data temporary format is '#[deviceId]|[x]|[y]|[z]|[y]|[p]|[r]|[timestamp]
    msg = ''
    if data is not None:
        for element in data:
            msg += str(element) + '|'
    else:
        test_data = [random.choice(DEVICE), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000),
                    random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000)]
        for element in test_data:
            msg = msg + str(element) + '|'
    return msg[:-1]

#Adding to outputBuffer
def appendToOutputBuffer(data):
    def checkNotAllZero(data):
        ls = data.split(',')
        for i in ls:
            if float(i) != 0:
                return True
        return False
    global outputBuffer
    if checkNotAllZero(data):
        data = '[' + data + ']'
        outputBuffer.append(data)

#Sending data 1-by-1
def convertAndSendData(dataString, deviceId):
    ls = []
    ls.append(int(deviceId))
    ls += list(map(int, dataString.split(',')))
    ls.append(random.randint(1, 10000))
    msgList = construct_message(ls)
    # print(ls)
    client.send_data(msgList)

def getSeconds(dateInstance):
    dt_obj = datetime.datetime.strptime(str(dateInstance),'%Y-%m-%d %H:%M:%S.%f')
    millisec = int(dt_obj.timestamp() * 1000)
    print('Timestamp:', millisec)
    return millisec

'''
    Class to generate preprocessing data
'''
class PreprocessorThread(threading.Thread):
    def __init__(self, initialTime):
        threading.Thread.__init__(self)
        self.startTime = initialTime
        self.processCount = 0
        # self.mlp = joblib.load('mlp20201015.pkl')
        # self.scaler = joblib.load('scaler.pkl')
    
    def run(self):
        global outputBuffer
        global bufferTimestamp
        global client
        global isStartOfRound
        while time() - self.startTime <= 5:
            # Block till initial setup time reached
            pass
        
        clearToggle = False
        
        #Run continuously till end of script
        while True:
            #Blocking call until start of round
            # msg = client.sock.recv(1024).decode("utf8")
            # print(msg)
            
            # New code
            #THIS WILL BE SET TO TRUE IF RECEIVED FROM SERVER to DROP
            if clientFlag and isStartOfRound: 
                if not clearToggle:
                    outputBuffer = []
                    clearToggle = True
                if len(outputBuffer) > 0:
                    #start of move
                    response = ntpclient.request('sg.pool.ntp.org')
                    dateInstance = datetime.datetime.fromtimestamp(response.tx_time)
                    bufferTimestamp = getSeconds(dateInstance)
                    isStartOfRound = False
                    
            #Check if outputBuffer size == 90, then start to send to 'client'
            if len(outputBuffer) >= WINDOW_SIZE:
                # response = ntpclient.request('sg.pool.ntp.org')
                # dateInstance = datetime.datetime.fromtimestamp(response.tx_time)
                # bufferTimestamp = getSeconds(dateInstance)
                self.processCount += 1
                print(f"\nWindow size of {WINDOW_SIZE} is fulfilled! COUNT: {self.processCount}. Preprocessing...\n")
                self.runPreprocessor()
                outputBuffer = []
        
    def runPreprocessor(self):
        def extract_data():
            #read from outputBuffer
            global outputBuffer
            data = outputBuffer
            
            #parse into lists
            output = [[] for i in range(6)]
            for i in range(7, len(data)):
                if ("[" not in data[i]): # invalid row, either new line char or grabage
                    continue
                else:
                    start = data[i].find("[")
                    end = data[i].find("]")
                    arr = data[i][start+1:end].split(",")
                    for j in range(6):
                        output[j].append(float(arr[j]))
                        
            #Convert to pandas dataframe
            colNames = ["x_acc", "y_acc", "z_acc", "yaw", "pitch", "roll"]
            dataDict = dict()
            for i in range(len(output)):
                dataDict[colNames[i]] = output[i]
            dataFrame = pd.DataFrame(dataDict)
            return dataFrame
    
        # call the function to extract the data into a pandas dataframe
        df = extract_data()

        # use the .describe() method to calculate the time-domain metrics: mean, std, min, max 
        timeDomainMetrics = df.describe() 

        # initialize the list for storing final data
        result = []

        # append the time-domain metrics into result
        for num in [1,2,3,7]:
            result.extend(timeDomainMetrics.iloc[num].tolist())

        # result == x_mean, y_mean, z_mean, ...., pitch_max

        # obtain the x, y, z acceleration values from raw data
        x_values = df["x_acc"]
        y_values = df["y_acc"]
        z_values = df["z_acc"]


        # start calculating frequency domain data
        t_n = 5   # duration
        N = WINDOW_SIZE    # no. of samples
        T = t_n / N 
        f_s = 1/T

        def get_psd_values(raw_values, T, N, f_s):
            f_values, psd_values = welch(raw_values, fs=f_s)
            return f_values, psd_values

        # calculate the power spectral density (PSD)
        psdValues = []
        for values in (x_values, y_values, z_values):
            psdValues.append(get_psd_values(values, T, N, f_s))

        #xf_values, xpsd_values = get_psd_values(x_values, T, N, f_s)
        #yf_values, ypsd_values = get_psd_values(y_values, T, N, f_s)
        #zf_values, zpsd_values = get_psd_values(z_values, T, N, f_s)

        # calculate the signal power P_welch
        def calculate_P_welch(f_values, psd_values):
            df_welch = f_values[1] - f_values[0]
            return np.sum(psd_values) * df_welch

        # calculate Energy
        def calculate_FFT_Energy(t_values, N=N):
            Xk = np.fft.fft(t_values)
            return np.sum(np.abs(Xk)**2/N)
         
        # calculate Entropy
        def calculate_Entropy(psd_values):
            psdSum = np.sum(psd_values)
            for i in range(len(psd_values)):
                psd_values[i] /= psdSum
                psd_values[i] = psd_values[i] * np.log(psd_values[i])
            entropy = 0 - np.sum(psd_values)
            return entropy

        for f_values, psd_values in psdValues:
            signalPower = calculate_P_welch(f_values, psd_values)
            signalEntropy = calculate_Entropy(psd_values)
            result.append(signalPower)
            result.append(signalEntropy)

        # result == x_mean, y_mean, z_mean, ...., pitch_max, x_power, x_entropy, y_power, y_entropy, z_power, z_entropy

        x_energy = calculate_FFT_Energy(x_values)
        y_energy = calculate_FFT_Energy(y_values)
        z_energy = calculate_FFT_Energy(z_values)
        result.append(x_energy)
        result.append(y_energy)
        result.append(z_energy)

        # result == x_mean, y_mean, z_mean, ...., pitch_max, x_power, x_entropy, ..., z_entropy, x_energy, y_energy, z_energy

        xyCorrelation = np.correlate(x_values, y_values)
        xzCorrelation = np.correlate(x_values, z_values)
        yzCorrelation = np.correlate(y_values, z_values)

        result.append(xyCorrelation[0])
        result.append(yzCorrelation[0])
        result.append(xzCorrelation[0])
        
        with open(f"preprocessing.txt", "a") as text_file:
            print(f"{result}", file=text_file)
        
        #Classify in client to seek
        # self.classify(result)
        
        if clientFlag:
            self.sendToFPGA(result)
    
    def classify(self, result):
        print(result)
        MLinput = []
        MLinput.append(result)
        ml_input = self.scaler.transform(MLinput)
        resultList = self.mlp.predict(ml_input)
        print(f"Detected action: {ACTIONS[resultList[0]]}")
        
    
    def sendToFPGA(self, result):
        global client
        msg = ''
        for element in result:
            msg += str(element) + ','
        msg = msg[:-1]
        client.send_data(msg, ML_PACKET_TYPE)

'''
    Client Class for sending to FPGA
'''
class Client():
    def __init__(self, ip_address, port_num, secret_key):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        self.secret_key = str(secret_key).encode('utf8')
        
        
        #Send initial timestamp
        self.calibration()
        
        
        print(f"ULTRA96 client is connected to Ultra96 through: {ip_address}:{port_num}")
    
    
    '''
    msg str format is : '#[deviceID]|[x]|[y]|[z]|[y]|[p]|[r]|[timestamp]'
    timestamp can be some int if not using
    also encryption/decryption padding might not be compatible or smth sometimes
    the last byte is decrypted as nonsense on server side
    '''
    def send_data(self, msg, packetType):
        msgToSend = packetType + ':' + DANCER_ID + ':' + msg
        if packetType == ML_PACKET_TYPE:
            msgToSend += ':' + str(bufferTimestamp)
        to_send = self.encrypt_message(msgToSend)
        # print("to send:", to_send)
        
        self.sock.sendall(to_send)

    def calibration(self):
        global ntpclient
        first = self.sock.recv(1024).decode("utf8")
        recv_time = getSeconds(datetime.datetime.fromtimestamp(ntpclient.request('sg.pool.ntp.org').tx_time))
        to_return = first + str(recv_time) + '|' + \
                    str(getSeconds(datetime.datetime.fromtimestamp(ntpclient.request('sg.pool.ntp.org').tx_time))) + '|' + DANCER_ID
        self.sock.sendall(to_return.encode("utf8"))
        

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
        self.specialBuffer = None
        self.isAcknowledged = False
        self.tolerance = 5
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
            output += str(base30ToDecimal(data[i:i+3])) + ','
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
    def isCompleteBuffer(self, data, msgCount, goodPacketCount):
        def debugPrint(debugFlag, assembledString):
            #For debugging purposes [error packets]
            if printError:
                with open(f"laptopdata{self.number}.txt", "a") as text_file:
                    print(f"    F,{debugFlag}: <{assembledString}> Q=[{self.bufferQueue}] ({msgCount})", file=text_file)
        
        #If check fails, do buffering since data is either: 1) incomplete or 2) overflows
        if self.isAcknowledged:
            #Filter out nonsense bytes
            output = list(filter(None, re.split(r'[\x00-\x20]', data)))
            output = output[0]
            '''
            #    c1: buffer empty, size = 19, T
            #    c2: buffer empty, size > 19,
            #        if [:20] == T, then store [19] in buffer
            #    c3: buffer empty, size < 19,
            #        store in buffer, return
            #    c4: buffer, buffersize < 19,
            #       diff = 19 - len(buffer)
            #        return buffer + data[:diff]
            #        buffer = data[diff:]
            #    c5: buffer, buffersize = 19,
            #        return buffer[:19]
            #        return data #buffer empty now
            #        buffer = 
            #    c6: buffer, buffersize > 19, #shouldnt reach here
            #        return buffer[:19]
            #        buffer = buffer[19:] + data
            '''
            if msgCount > 10 and goodPacketCount / msgCount < 0.75:
                self.tolerance -= 1
            if self.tolerance <= 0 and self.checkValidity(data):
                print('~Consecutive bad packets... Using tolerance reset!!!')
                self.bufferQueue = ''
                self.tolerance = 5
                return GOOD_DATA_FLAG
            else:
                self.tolerance = 5
                assembledString = ''
                if len(output) == 0:
                    print('NO BYTES RCVED!')
                    return False
                if len(self.bufferQueue) == 0:
                    #Case 1: size=19
                    if len(output) == PACKET_SIZE:
                        if self.checkValidity(output):
                            self.bufferQueue = ''
                            return GOOD_DATA_FLAG
                    elif len(output) < PACKET_SIZE: #Case 2: size<19
                        assembledString = BUFFER_SKIP
                        self.bufferQueue = output
                        debugFlag = '<C2>'
                        debugFlag += output
                        debugFlag += '<C2>'
                        debugPrint(debugFlag, assembledString)
                    else: #Case 3: size>19
                        assembledString = output[:PACKET_SIZE]
                        self.bufferQueue = output[PACKET_SIZE:]
                        debugFlag = '<C3>'
                        debugFlag += output
                        debugFlag += '<C3>'
                        debugPrint(debugFlag, assembledString)
                else:
                    #Case 4: buffer, buffersize < 19
                    if len(self.bufferQueue) < PACKET_SIZE:
                        diffInBytes = PACKET_SIZE - len(self.bufferQueue)
                        assembledString = self.bufferQueue + output[:diffInBytes]
                        self.bufferQueue = output[diffInBytes:]
                        debugFlag = '<C4>'
                        debugFlag += output
                        debugFlag += '<C4>'
                        debugPrint(debugFlag, assembledString)
                    #Case 5: buffer, buffersize=19
                    elif len(self.bufferQueue) == PACKET_SIZE:
                        #Buffer is exactly 1 packet-size
                        #So need to send 2 packets
                        debugFlag = '<C5'
                        assembledString = self.bufferQueue
                        if len(output) == PACKET_SIZE and self.checkValidity(output):
                            debugFlag += 'a>'
                            self.specialBuffer = output
                            self.bufferQueue = ''
                        elif len(output) > PACKET_SIZE and self.checkValidity(output[:PACKET_SIZE]):
                            debugFlag += 'b>'
                            self.specialBuffer = output[:PACKET_SIZE]
                            self.bufferQueue = output[PACKET_SIZE]
                        else: #Smaller than 19 bytes
                            debugFlag += 'c>'
                            self.bufferQueue = output
                        debugFlag += output
                        debugFlag += '<C5>'
                        debugPrint(debugFlag, assembledString)
                    #Case 6: buffer, buffersize>19
                    else:
                        diffInBytes = len(self.bufferQueue) - PACKET_SIZE
                        assembledString = self.bufferQueue[:PACKET_SIZE]
                        self.bufferQueue = self.bufferQueue[PACKET_SIZE:] + output
                        debugFlag = '<C6>'
                        debugFlag += output
                        debugFlag += '<C6>'
                        debugPrint(debugFlag, assembledString)
                    
                #Returns true if current assembledString is valid
                if self.checkValidity(assembledString):
                    self.buffer = assembledString
                    return GOOD_DATA_FLAG
        return False

"""
    Handle packets received from beetle(s)
"""
class NotificationDelegate(DefaultDelegate):
    def __init__(self, number, thread):
        DefaultDelegate.__init__(self)
        self.number = str(number)
        self.thread = thread
        self.baseTime = self.pastTime = time()
        self.msgCount = self.goodPacketCount = self.goodPacketsArm = self.goodPacketsBody = 0
        self.bH = BufferHandler(number)
        self.deviceId = None
        # self.runningSum = 0
        # self.runningCount = 0
        
        #Position-related code
        # self.ignoreIdle = 1
        self.startOfOne = 0
        self.idleCount = 3
        self.oneCount = 0
        self.oneBuff = 0
        self.promptFlag = 1
        self.startMovePostTime = 0
        
    
    def positionOrPreprocessCode(self, data):
        global client
        global outputBuffer
        #Body-beetle code
        if self.deviceId == 1:
                        
            # print(data)
            
            moveType = None
            
            if self.idleCount > 0 and self.promptFlag:
                print('\n...You can start moving!\n')
                self.promptFlag = 0
            elif self.promptFlag:
                self.idleCount += 1
            
            if self.idleCount > 0:
                if not self.startOfOne and data == SPECIAL_SMALL_STEP:
                    self.startOfOne = 1
                    self.startMovePostTime = time()
                elif self.startOfOne:
                    self.oneCount += 1
                    if self.oneCount > 3:
                        if data == SPECIAL_SMALL_STEP:
                            self.oneBuff += 1
                        if self.oneCount > 8:
                            if self.oneBuff > 1:
                                print('\nBig\n')
                                moveType = MOVE_TYPE_BIG
                            else:
                                print('\nSmall\n')
                                moveType = MOVE_TYPE_SMALL
                            print(f"{self.oneBuff} / {self.oneCount}")
                            self.oneCount = 0
                            self.oneBuff = 0
                            self.startOfOne = 0
                            self.idleCount = -8 #waits around 1.6s before can move again
                            self.promptFlag = 1
                            print(f"Tt for moving positions: {round(time()-self.startMovePostTime, 3)}s")
                            outputBuffer = []
            
            if clientFlag and moveType is not None:
                client.send_data(moveType, POSITION_PACKET_TYPE)
            
        #Arm-beetle code
        elif self.deviceId == 0:
            #Adds to output buffer for preprocessing 
            appendToOutputBuffer(data)
    
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
                #self.thread.c.write(("A").encode())
                return
            if self.bH.isCompleteBuffer(data, self.msgCount, self.goodPacketCount):
                self.goodPacketCount += 1
                # self.runningCount += 1
                self.deviceId = None
                if self.bH.buffer:
                    data = self.bH.buffer
                    self.bH.buffer = None
                    flag = 'AS'
                if flag and (self.msgCount > 1 or time() - self.baseTime > 5):
                    if data[PACKET_SIZE-1].islower():
                        self.deviceId = 0
                        self.goodPacketsArm += 1
                    else:
                        self.deviceId = 1
                        self.goodPacketsBody += 1
                '''
                # Prints individual report
                # Device:number,flag,deviceID:data |total|goodPacketCount|goodPacketsArm|goodPacketsBody
                '''
                
                # Convert from base30 to decimal, accepts only PACKET_SIZE data (will ignore last checksum byte)
                if decimalConvert:
                    data = self.bH.convertToDecimal(data)
                
                #Run the position/preprocessing code based on deviceId
                self.positionOrPreprocessCode(data)
                
                #Debug code for checking threshold of body sensor
                # if self.deviceId == 1:
                    # #Get x value to append to self.sumOfTen
                    # tmpData = data.split(',')
                    # tmpData = int(tmpData[0])
                    # self.runningSum += tmpData
                    
                    # #Calculate x value sum of ten
                    # if self.runningCount % 17 == 0:
                        # if printGoodData:
                            # print(f"\nSumOfTen:{self.runningSum}, ({self.runningCount})\n")
                            # with open(f"laptopdata{self.number}.txt", "a") as text_file:
                                # print(f"SumOfTen:{self.runningSum}, ({self.runningCount})", file=text_file)
                        # self.runningSum = 0
                        # self.runningCount = 0
                
                
                #For debugging purposes [good packets]
                if printGoodData:
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"{self.number},{flag} [{self.deviceId}: {data}] ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})", file=text_file)
                
                #Do it again if there is specialBuffer
                if self.bH.specialBuffer:
                    flag = 'SPB'
                    data = self.bH.specialBuffer
                    self.bH.specialBuffer = None
                    if decimalConvert:
                        data = self.bH.convertToDecimal(data)
                    
                    #Run the position/preprocessing code based on deviceId
                    self.positionOrPreprocessCode(data)
                        
                    #For debugging purposes [good packets]
                    if printGoodData:
                        with open(f"laptopdata{self.number}.txt", "a") as text_file:
                            print(f"{self.number},{flag} [{self.deviceId}: {data}] ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})", file=text_file)
            
            #For debugging purposes (Prints every 5s) [Throughput]
            ### Send preprocessed data every 5s
            if time() - self.pastTime >= 5:
                tt = time() - self.baseTime
                print(f"---{self.number}: {round(tt, 2)}s have passed ---")
                print(f"{self.number} ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount}) | Buffer:{len(outputBuffer)}/{WINDOW_SIZE}")
                if printSummary:
                    #Prints overall report
                    with open(f"laptopdata{self.number}.txt", "a") as text_file:
                        print(f"{self.number} ({self.goodPacketsArm}|{self.goodPacketsBody}|{self.goodPacketCount}|{self.msgCount})", file=text_file)
                        print(f"\n*** {tt}s have passed ***\n", file=text_file)
                self.pastTime = time()
                self.msgCount = self.goodPacketCount = self.goodPacketsArm = self.goodPacketsBody = 0
                
        except:
            #Error decoding using UTF-8
            print('Decode error', data)

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
                            self.connection.withDelegate(NotificationDelegate(self.connection_index, self))
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
                    self.connection.withDelegate(NotificationDelegate(self.connection_index, self))
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
        self.connection.withDelegate(NotificationDelegate(self.connection_index, self))
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
                        print(f"No movement detected from device {self.connection_index}. Sending H again")
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
    # concount = 0
    # while True:
        # if concount == 2:
            # break
        # for addr in bt_addrs:
            # if bt_addrs_isConnected[addr]:
                # continue
            # idx = bt_addrs[addr]
            # bt_addrs_isConnected[addr] = True
            # print(addr, 'found!')
            # try:
                # p = Peripheral(addr)
                # connections[idx] = p
                # t = ConnectionHandlerThread(idx)
                # t.daemon = True #Set to true so can CTRL-C the program easily
                # t.start()
                # connection_threads[idx] = t
                # totalDevicesConnected += 1
                # concount += 1
                # sleep(1)
            # except: #Raised when unable to create connection
                # print('Error in connecting device')
    if preprocessFlag:
        ppT = PreprocessorThread(time())
        ppT.daemon = True
        ppT.start()

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
            '''
            Dancer A
            A -> init ntp
            A -> step if needed
            A -> move action do normal op, until server sends DROP packet(newRound)
            A -> If DROP packet received, set buffer to null, wait 1s, then set flag to true
            A -> Inside Preprocessing, will set timestamp the moment buffer gets filled up again
            A -> Sends same timestamp, appended to each ML_PACKET_TYPE thereafter for server to process
            '''
            if clientFlag:
                startOfRoundMsg = self.client.socket.recv(1024)
                print(startOfRoundMsg)
                outputBuffer = []
                sleep(1)
                isStartOfRound = True
            pass
    except KeyboardInterrupt:
        print('END OF PROGRAM. Disconnecting all devices..')
        endFlag = True
        
