import sys
import socket
import time
import random

from Crypto import Random
from Crypto.Cipher import AES
from base64 import b64encode

ACTIONS = ['zigzag', 'rocket', 'hair']
POSITIONS = ['1 2 3', '3 2 1', '2 3 1', '3 1 2', '1 3 2', '2 1 3']
PADDING = b' '
BLOCK_SIZE = 16


class Client:
    def __init__(self, ip_address, port_num, secret_key):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        self.secret_key = str(secret_key).encode('utf8')
        print(f"EVALUATION client is connected to server through: {ip_address}:{port_num}")

    def send_data(self, msg):
        to_send = self.encrypt_message(msg)
        # print("to send:", to_send)
        self.sock.sendall(to_send)

    def stop(self):
        self.sock.close()

    def encrypt_message(self, msg):
        message = self.add_padding(str(msg).encode('utf8'))
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(message)
        encoded = b64encode(iv + encrypted)
        return encoded

    def add_padding(self, plaintext):
        return plaintext + ((BLOCK_SIZE - (len(plaintext) % BLOCK_SIZE)) * PADDING)

    def get_dancer_positions(self):
        new_position = self.sock.recv(1024)
        return new_position.decode('utf8')


# testing purposes
def construct_random_message():
    # test data returns random choice of position, action and delay
    test_data = [random.choice(POSITIONS), random.choice(ACTIONS), random.randint(1, 1000)]
    msg = '#'
    for element in test_data:
        msg = msg + str(element) + '|'
    return msg[:-1]


def main():
    if len(sys.argv) != 4:
        print('Invalid number of arguments')
        print('python server.py [IP address] [Port] [secret key]')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])
    group_id = sys.argv[3]

    client = Client(ip_addr, port_num, group_id)

    time.sleep(60)
    action = ''

    # test client-server connection with 20 randomly generated packets
    count = 0
    while action != "logout":
        print(f"data: #{count + 1}")
        message = construct_random_message()
        client.send_data(message)
        new_position = client.get_dancer_positions()
        print("New dancer position received from server:", new_position)
        time.sleep(2)
        count += 1
        if count == 20:
            client.stop()
            print("stop sending")
            break
            

if __name__ == '__main__':
    main()
