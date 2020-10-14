import os
import sys
import random
import time

import socket
import threading

import base64
import pandas as pd
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

MESSAGE_SIZE = 7  # position, action, delay, [xyzypr] * 3


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

    def decrypt_message(self, cipher_text):
        decoded_message = base64.b64decode(cipher_text)
        iv = decoded_message[:16]
        secret_key = bytes(str(self.secret_key), encoding="utf8")

        cipher = AES.new(secret_key, AES.MODE_CBC, iv)
        decrypted_message = unpad(cipher.decrypt(decoded_message[16:]), AES.block_size)
        decrypted_message = decrypted_message.decode('utf8')

        decrypted_message = decrypted_message[decrypted_message.find('#'):]
        decrypted_message = bytes(decrypted_message[1:], 'utf8').decode('utf8')

        msg = decrypted_message.split('|')
        headers = ['id', 'position', 'action', 'delay', 'user1', 'user2', 'user3']
        data = dict(zip(headers, msg))
        return data
    
    def run(self):
        while not self.shutdown.is_set():
            data = self.connection.recv(1024)

            if data:
                try:
                    msg = data.decode("utf8")
                    decrypted_message = self.decrypt_message(msg)
                    print('Received data:', decrypted_message)
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

