import os
import sys
import random
import time
import json

import socket
import threading

from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad


class Server(threading.Thread):
    def __init__(self, ip_addr, port_num):
        super(Server, self).__init__()

        self.connection = None
        self.logout = False

        # Create a TCP/IP socket and bind to port
        self.shutdown = threading.Event()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.secret_key = 'thisisunhackable'
        server_address = (ip_addr, port_num)
        assert(len(self.secret_key) == 16)

        print('starting up on %s port %s' % server_address, file=sys.stderr)
        self.socket.bind(server_address)

        # Listen for incoming connections
        self.socket.listen(1)
        self.client_address = self.setup_connection()

    def decrypt_message(self, received):
        decoded_message = json.loads(b64decode(received))
        secret_key = bytes(str(self.secret_key), encoding="utf8")
        iv = b64decode(decoded_message['iv'])
        cipher = AES.new(secret_key, AES.MODE_CBC, iv)

        ciphertext = b64decode(decoded_message['ciphertext'])
        decrypted_message = unpad(cipher.decrypt(ciphertext), AES.block_size)
        # decrypted_message = decrypted_message.decode('utf8')
        json_msg = json.loads(decrypted_message)

        return json_msg
    
    def run(self):
        while not self.shutdown.is_set():
            data = self.connection.recv(1024)

            if data:
                try:
                    msg = data.decode("utf8")
                    decrypted_message = self.decrypt_message(msg)
                    print('Received data:', decrypted_message)
                    print(type(decrypted_message))
                    # todo: convert data dict to required format to store
                except Exception as e:
                    print("Failure", str(e))
            else:
                print('no more data from', self.client_address, file=sys.stderr)
                self.stop()
    
    def setup_connection(self):
        # Wait for a connection
        print('waiting for a connection', file=sys.stderr)
        self.connection, client_address = self.socket.accept()

        print('connection from', client_address, file=sys.stderr)

        return client_address

    def stop(self):
        self.connection.close()
        self.shutdown.set()


def construct_message():
    test_data = ['stream', '1 2 3', 'hair', 100, [1, 1, 1, 100, 100, 100], [2, 2, 2, 200, 200, 200],
                 [3, 3, 3, 300, 300, 300]]
    msg = '#'
    for element in test_data:
        msg = msg + str(element) + '|'
    return msg[:-1]


def main():
    if len(sys.argv) != 3:
        print('Invalid number of arguments')
        print('python dash_server.py [IP address] [Port]')
        print('IP address is public ip of device hosting dashboard, port is...um haven\'t thought that through')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])

    my_server = Server(ip_addr, port_num)
    my_server.start()


if __name__ == '__main__':
    main()

