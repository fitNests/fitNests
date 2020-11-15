import sys
import socket
import time
import random
import json

from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode


class Client:
    def __init__(self, ip_address, port_num, secret_key):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        self.secret_key = str(secret_key).encode('utf8')
        print(f"Client is connected to dashboard through: {ip_address}:{port_num}")

    def send_data(self, msg):
        to_send = self.encrypt_message(msg)
        # print("to send:", to_send)
        # print('sending data')
        self.sock.sendall(to_send)

    def stop(self):
        self.sock.close()

    def encrypt_message(self, msg):  # msg is a DICT
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
        ciphertext = json.dumps(msg).encode("utf8")
        encrypted = cipher.encrypt(pad(ciphertext, AES.block_size))

        to_send = json.dumps({'iv': b64encode(iv).decode('utf8'), 'ciphertext': b64encode(encrypted).decode('utf8')})
        return b64encode(to_send.encode('utf8'))


# dummy data for test purposes.
def construct_message():
    test_data1 = ['stream', '1 2 3', 'hair', 100, [1, 1, 1, 100, 100, 100], [2, 2, 2, 200, 200, 200],
                 [3, 3, 3, 300, 300, 300]]
    test_data2 = ['stream', '1 2 3', 'zigzag', 200, [100,100,100,1,1,1], [200,200,200,2,2,2,],
                 [300,300,300,3,3,3]]
    # msg = '#'
    # for element in test_data:
    #     msg = msg + str(element) + '|'
    # return msg[:-1]
    
    headers = ['id', 'position', 'action', 'delay', 'user1', 'user2', 'user3']
    if random.randint(1,2) == 1:
        data = dict(zip(headers, test_data1))
    else:
        data = dict(zip(headers, test_data2))
    return data


def main():
    if len(sys.argv) != 4:
        print('Invalid number of arguments')
        print('python dash_client.py [IP address] [Port] [secret key]')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])
    secret_key = sys.argv[3]

    client = Client(ip_addr, port_num, secret_key)

    # testing
    action = ''
    count = 0

    try:
        time.sleep(3)
        # testing client-server connection with 20 randomly generated packets
        while action != "logout":
            print(f"data: #{count + 1}")
            message = construct_message()
            client.send_data(message)
            time.sleep(1)
            count += 1
            if count == 15:
                client.stop()
                print("stop sending")
                break
    except KeyboardInterrupt:
        client.stop()


if __name__ == '__main__':
    main()
