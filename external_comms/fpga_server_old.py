import os
import sys
import random
import time

import socket
import threading

import base64
import numpy as np
import pandas as pd
from Crypto.Cipher import AES

MESSAGE_SIZE = 8  # device ID, xyzypr, timestamp


class Server(threading.Thread):
    def __init__(self, ip_addr, port_num, group_id):
        super(Server, self).__init__()

        self.connection = None
        self.timer = None
        self.logout = False

        # Create a TCP/IP socket and bind to port
        self.shutdown = threading.Event()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_addr, port_num)

        print('starting up on %s port %s' % server_address, file=sys.stderr)
        self.socket.bind(server_address)

        # Listen for incoming connections
        self.socket.listen(1)
        self.client_address, self.secret_key = self.setup_connection()

    def decrypt_message(self, cipher_text):
        decoded_message = base64.b64decode(cipher_text)
        iv = decoded_message[:16]
        secret_key = bytes(str(self.secret_key), encoding="utf8") 

        cipher = AES.new(secret_key, AES.MODE_CBC, iv)
        decrypted_message = cipher.decrypt(decoded_message[16:]).strip()
        decrypted_message = decrypted_message.decode('utf8')

        decrypted_message = decrypted_message[decrypted_message.find('#'):]
        decrypted_message = bytes(decrypted_message[1:], 'utf8').decode('utf8')

        messages = decrypted_message.split('|')
        deviceid, x, y, z, yaw, pitch, roll, timestamp = messages[:MESSAGE_SIZE]
        return {
            'deviceID': deviceid,
            'x': x, 'y': y, 'z': z,
            'yaw': yaw, 'pitch': pitch, 'roll': roll,
            'timestamp': timestamp
        }

    def run(self):
        while not self.shutdown.is_set():
            data = self.connection.recv(1024)

            if data:
                try:
                    msg = data.decode("utf8")
                    decrypted_message = self.decrypt_message(msg)
                    print('Received data:', decrypted_message)
                    # todo: send data received to ML
                except Exception as e:
                    print("Failure", str(e))
            else:
                print('no more data from', self.client_address, file=sys.stderr)
                self.stop()
    
    def setup_connection(self):
        # Wait for a connection
        print('waiting for a connection', file=sys.stderr)
        self.connection, client_address = self.socket.accept()

        print("Enter the secret key: ")
        secret_key = sys.stdin.readline().strip()

        print('connection from', client_address, file=sys.stderr)
        if len(secret_key) == 16 or len(secret_key) == 24 or len(secret_key) == 32:
            pass
        else:
            print("AES key must be either 16, 24, or 32 bytes long")
            self.stop()
        
        return client_address, secret_key

    def stop(self):
        self.connection.close()
        self.shutdown.set()
        self.timer.cancel()


def main():
    if len(sys.argv) != 4:
        print('Invalid number of arguments')
        print('python server.py [IP address] [Port] [groupID]')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])
    group_id = sys.argv[3]

    server1 = Server(ip_addr, port_num, group_id)
    # server2 = Server(ip_addr, port_num, group_id)
    # server3 = Server(ip_addr, port_num, group_id)
    server1.start()
    # server2.start()
    # server3.start()




if __name__ == '__main__':
    main() # python3 server.py [server IP address] [Port] [5]
