import os
import sys
import random
import time

import socket
import threading
from collections import Counter

import base64
import numpy as np
import pandas as pd
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
import joblib

import dash_client
import eval_client

eval_portnum = 50000
dash_portnum = 11111
eval_ip = ''
SECRET_KEY = 'thisisunhackable'

mlp = joblib.load('mlp20201015.pkl')
scaler = joblib.load('scaler.pkl')

ACTIONS = ['', 'hair', 'rocket', 'zigzag']
NUM_OF_CLIENTS = 3
MAX_PACKET_PER_ROUND = 3
IS_FIRST_CONNECTION = True

client_results = []
barrier = threading.Barrier(NUM_OF_CLIENTS)


class Server(threading.Thread):
    def __init__(self, ip_addr, port_num, condition):
        super(Server, self).__init__()

        global IS_FIRST_CONNECTION

        self.connection = None
        self.logout = False
        self.condition = condition

        # Create a TCP/IP socket and bind to port
        self.shutdown = threading.Event()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.secret_key = SECRET_KEY
        server_address = (ip_addr, port_num)
        assert(len(self.secret_key) == 16)

        print('starting up on %s port %s' % server_address, file=sys.stderr)
        self.socket.bind(server_address)

        # Listen for incoming connections
        self.socket.listen(1)
        self.client_address = self.setup_connection()

        if IS_FIRST_CONNECTION:
            barrier.wait(60)  # wait for all clients to connect first
            IS_FIRST_CONNECTION = False

        # self.evalclient = eval_client.Client(eval_ip, eval_portnum, self.secret_key)
        # self.dashclient = dash_client.Client('localhost', dash_portnum, self.secret_key)

    def decrypt_message(self, cipher_text):
        decoded_message = base64.b64decode(cipher_text)
        iv = decoded_message[:16]
        secret_key = bytes(str(self.secret_key), encoding="utf8") 

        cipher = AES.new(secret_key, AES.MODE_CBC, iv)
        decrypted_message = unpad(cipher.decrypt(decoded_message[16:]), AES.block_size)
        msg = decrypted_message.decode('utf8')

        return msg

    def run(self):
        zeroes = [0 for x in range(len(ACTIONS))]
        results_dict = dict(zip(ACTIONS, zeroes))

        # TODO: this def does not belong here, find a way to block all three threads before eval_server is ready
        # next_pos = self.evalclient.get_dancer_positions()

        while not self.shutdown.is_set():
            data = self.connection.recv(1024)
            if data:
                try:
                    with self.condition:
                        msg = data.decode("utf8")
                        decrypted_message = self.decrypt_message(msg)
                        # print('Received data:', decrypted_message)

                        # run ML classification
                        detected_action = self.ml_process(decrypted_message)
                        print("detected action: ", detected_action)
                        results_dict[detected_action] += 1
                        # pick majority and send to eval+dash servers
                        if (MAX_PACKET_PER_ROUND // 2) + 1 in results_dict.values():
                            final_result = max(results_dict, key=results_dict.get)

                            print('client final result:', final_result)
                            # self.send_eval(final_result)
                            # self.send_dash(processed[0:6], final_result)

                            # reset action count
                            results_dict = dict(zip(ACTIONS, zeroes))

                            # block thread until general processing is done
                            client_results.append(final_result)
                            self.condition.wait()

                            # send individually to dashboard???

                except Exception as e:
                    print("you broke shit you absolute failure, stop. ", str(e))
                    self.stop()
            else:
                print("one client shut down")
    
    def setup_connection(self):
        # Wait for a connection
        print('waiting for a connection', file=sys.stderr)
        self.connection, client_address = self.socket.accept()

        print('connection from', client_address, file=sys.stderr)

        return client_address

    def send_eval(self, result):
        to_send = '#1 2 3|' + result + '|100'
        print('to send: ', to_send)
        # self.evalclient.send_data(to_send)

    def send_dash(self, msg, results):
        msg = [int(float(x)) for x in msg]
        headers = ['id', 'position', 'action', 'delay', 'user1', 'user2', 'user3']
        data = ['stream', '1 2 3', results, 100, msg, [2, 2, 2, 200, 200, 200],
                         [3, 3, 3, 300, 300, 300]]
        to_send = dict(zip(headers,data))
        # self.dashclient.send_data(to_send)

    def ml_process(self, decrypted_message):  # currently directly from model
        x_input = []
        raw = decrypted_message[1:len(decrypted_message) - 2]
        processed = raw.split("|")
        x_input.append([float(num) for num in processed])
        # print(X_input)
        ml_input = scaler.transform(x_input)
        result = mlp.predict(ml_input)
        return ACTIONS[result[0]]

    def stop(self):
        self.connection.close()
        self.shutdown.set()


class Processing(threading.Thread):
    """
    General processing thread.
    Processes data from all three clients together and sends to eval_server.
    """
    def __init__(self, server_condition, process_condition):
        super(Processing, self).__init__()
        self.server_c = server_condition
        self.process_c = process_condition
        self.shutdown = threading.Event()

        # eval client initialized here
        # self.evalclient = eval_client.Client(eval_ip, eval_portnum, SECRET_KEY)

    def run(self):
        with self.process_c:
            while not self.shutdown.is_set():
                self.process_c.wait_for(len(client_results) == NUM_OF_CLIENTS)
                with self.server_c:
                    c = Counter(client_results)
                    final_action = c.most_common(1)[0][0]
                    '''
                    send final result or smth idk
                    '''
                    client_results.clear()
                    self.server_c.notifyAll()

    def calc_delay(self):
        return

    def calc_position(self):
        return

    def stop(self):
        self.shutdown.set()


def main():
    global eval_ip

    if len(sys.argv) != 3:
        print('Invalid number of arguments')
        print('python server.py [IP address] [Port]')
        print('in current setup, IP address is localhost')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])

    print("Enter eval_server ip address:")
    eval_ip = input()

    server_condition = threading.Condition()
    process_condition = threading.Condition()

    server_threads = []
    processing = Processing(server_condition, process_condition)
    processing.start()
    for i in range(NUM_OF_CLIENTS):
        s = Server(ip_addr, port_num, server_condition)
        server_threads.append(s)
        s.start()
        if len(server_threads) == NUM_OF_CLIENTS:
            print('All clients connected!')

    while True:
        try:
            pass  # TODO: can reconnect client from here?
        except KeyboardInterrupt:
            for s in server_threads:
                s.stop()
            processing.stop()
            print('Server shutdown. Goodbye bitches see you never.')
            break


if __name__ == '__main__':
    main()

