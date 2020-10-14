import sys
import socket
import time
import random

from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode

# ACTIONS = ['zigzag', 'rocket', 'hair']
# POSITIONS = ['1 2 3', '3 2 1', '2 3 1', '3 1 2', '1 3 2', '2 1 3']
DEVICE = ['1', '2', '3']


class Client:
    def __init__(self, ip_address, port_num, secret_key):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        self.secret_key = str(secret_key).encode('utf8')
        print(f"ULTRA96 client is connected to Ultra96 through: {ip_address}:{port_num}")

    def send_data(self, msg):
        # test_string = "#" + position + "|" + action + "|" + delay + "|"
        to_send = self.encrypt_message(msg)
        print("to send:", to_send)
        self.sock.sendall(to_send)

    '''
    rmb to call this to shut down the client
    '''
    def stop(self):
        self.sock.close()

    def encrypt_message(self, msg):
        message_bytes = str(msg).encode('utf8')
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(pad(message_bytes, AES.block_size))
        encoded = b64encode(iv + encrypted)
        return encoded


# DEPRECATED
def construct_message():
    # test data temporary format is '#[deviceID]|[x]|[y]|[z]|[y]|[p]|[r]|[timestamp]
    test_data = [random.choice(DEVICE), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000),
                 random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000), random.randint(1, 10000)]
    msg = '#'
    for element in test_data:
        msg = msg + str(element) + '|'
    return msg[:-1]


# testing purposes DEPRECATED PLS DON'T RUN MAIN
def main():
    if len(sys.argv) != 4:
        print('Invalid number of arguments')
        print('python3 fpga_client.py [IP address] [Port] [secret key]')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])
    secret_key = sys.argv[3]

    action = ''
    count = 0

    client = Client(ip_addr, port_num, secret_key)
    try:
        time.sleep(10)
        # testing client-server connection with 20 randomly generated packets
        while action != "logout":
            print(f"data: #{count + 1}")
            message = construct_message()
            client.send_data(message)
            time.sleep(2)
            count += 1
            if count == 15:
                client.stop()
                print("stop sending")
                break
    except KeyboardInterrupt:
        client.stop()

    '''
    # stress testing number of packets sent in 5s with at least 10ms delay
    delay = time.time() + 5  # 5 seconds
    while time.time() < delay:
        client.send_data(message)
        count += 1
        time.sleep(0.01)
    
    # client.send_data(construct_logout())
    # client.stop()
    # print("within 5 seconds, sent", count, "packets")
    '''


if __name__ == '__main__':
    main()
