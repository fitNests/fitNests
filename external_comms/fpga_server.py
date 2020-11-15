import os
import sys
import random
import time
import datetime

import socket
import threading
from collections import Counter
import ntplib

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
import sync_delay

EVAL_ON = 1
DASH_ON = 1
eval_portnum = 50000
dash_portnum = 11111
eval_ip = ''
SECRET_KEY = 'thisisunhackable'

mlp = joblib.load('mlp20201112v1.pkl')
scaler = joblib.load('scaler1112v1.pkl')

ACTIONS = ['', 'hair', 'rocket', 'zigzag', 'elbowlock', 'pushback', 'scarecrow', 'shouldershrug', 'windowwipe',
           'logout']
NUM_OF_CLIENTS = 3
ACTION_THRESHOLD = 2  # number of times the same action is detected to determine final action
NUM_ROUNDS = 33

client_results = ['' for x in range(NUM_OF_CLIENTS)]
client_step = [0 for x in range(NUM_OF_CLIENTS)]  # dancer to step
dancer_pos = [x for x in range(NUM_OF_CLIENTS)]  # position to dancer
timestamp_list = [None for x in range(NUM_OF_CLIENTS)]
offset = [0 for x in range(NUM_OF_CLIENTS)]  # time offset
features_dict = [[], [], []]

# packettype
SENSOR_DATA = '0'
POS_DATA = '1'

EVAL_REFRESH = False  #
refresh_time = None
WAITTIME = 2  # time to wait to before sending to eval server

# ntpclient = ntplib.NTPClient()


class Server(threading.Thread):
    """
    Process thread for one connection.
    """

    def __init__(self, connection):
        super(Server, self).__init__()

        self.connection = connection

        self.shutdown = threading.Event()
        self.secret_key = SECRET_KEY
        assert (len(self.secret_key) == 16)

        self.dancerid = None

        self.is_set_action = False
        self.is_set_timestamp = False
        self.is_first_packet = True

        # initial time calibration handshake
        try:
            self.calibration()
        except Exception as e:
            print("Error in calibrating:", e)
            self.stop()

        print(f"DANCER {self.dancerid + 1} CONNECTED!!!")

    def calibration(self):
        global ntpclient

        # first = getSeconds(datetime.datetime.fromtimestamp(ntpclient.request('sg.pool.ntp.org').tx_time))
        first = int(round(time.time() * 1000))
        self.connection.sendall((str(first) + '|').encode("utf8"))
        packet = self.connection.recv(1024).decode("utf8")
        last = int(round(time.time() * 1000))
        self.dancerid = int(packet[-1:])
        # ntpconnect = False
        # while ntpconnect is False:
        #     try:
        #         last = getSeconds(datetime.datetime.fromtimestamp(ntpclient.request('sg.pool.ntp.org').tx_time))
        #         ntpconnect = True
        #     except Exception as ntpX:
        #         print('error in connecting to ntp server:', ntpX, '\nTrying again...')
        packet = packet[:-1] + str(last)
        packet_int = [int(x) for x in packet.split('|')]
        offset[self.dancerid] = sync_delay.calculate_offset(packet_int)

    def run(self):
        global EVAL_REFRESH

        zeroes = [0 for x in range(len(ACTIONS))]
        results_dict = dict(zip(ACTIONS, zeroes))
        # starttime = 0

        while not self.shutdown.is_set():
            if EVAL_REFRESH:
                if self.is_set_action and (client_results[self.dancerid] != ''):
                    # indicates this thread has already determined action and waiting for the next round
                    continue
                elif self.is_set_action:
                    # next round has begun
                    self.connection.sendall(b'ready')
                    self.is_set_action = False
                    # starttime = time.time()
                data = self.connection.recv(1024)
                if data:
                    try:
                        msg = data.decode("utf8")
                        decrypted_message = self.decrypt_message(msg)
                        msglist = decrypted_message.split(":")
                        packettype = msglist.pop(0)
                        # print('Received data:', packettype, self.dancerid, msglist)

                        # detect action based on received data
                        if packettype == SENSOR_DATA and self.is_set_action is False:
                            # drop first packet sent
                            if self.is_first_packet:
                                self.is_first_packet = False
                                continue

                            # detect action and increment detected action counter by 1
                            detected_action = self.ml_process(msglist[0])
                            results_dict[detected_action] += 1
                            if not self.is_set_timestamp:
                                timestamp_list[self.dancerid] = sync_delay.get_ultra96_time(int(msglist[1]),
                                                                                            offset[self.dancerid])
                                self.is_set_timestamp = True

                            # determine action: if same action is detected [TWICE] set this action
                            if ACTION_THRESHOLD in results_dict.values():
                                final_result = max(results_dict, key=results_dict.get)
                                print(f'~ dancer {self.dancerid + 1} action result: {final_result} ~')

                                # reset action count
                                results_dict = dict(zip(ACTIONS, zeroes))
                                client_results[self.dancerid] = final_result
                                features_dict[self.dancerid] = [int(float(x)) for x in
                                                                msglist[0][1:len(msglist[0]) - 2].split(',')[:6]]
                                # reset flags and block until next round
                                self.is_set_timestamp = False
                                self.is_set_action = True
                                self.is_first_packet = True
                                # print("time taken to decide on one move is", time.time() - starttime)

                        elif packettype == POS_DATA:
                            # set the step size taken by this dancer
                            client_step[self.dancerid] = int(msglist[0])

                    except Exception as e:
                        if self.is_first_packet:
                            # high chance first packet received is broken (for some reason)
                            print("broken first packet, carry on.")
                        else:
                            print(f"Error from dancer {self.dancerid + 1}:", str(e))
                        self.is_first_packet = False
                else:
                    print(f"DANCER {self.dancerid + 1} SHUT DOWN")
                    self.stop()

    def decrypt_message(self, cipher_text):
        decoded_message = base64.b64decode(cipher_text)
        iv = decoded_message[:16]
        secret_key = bytes(str(self.secret_key), encoding="utf8")

        cipher = AES.new(secret_key, AES.MODE_CBC, iv)
        decrypted_message = unpad(cipher.decrypt(decoded_message[16:]), AES.block_size)
        msg = decrypted_message.decode('utf8')

        return msg

    def ml_process(self, message):
        """
        Machine learning classification process. mlp file itself returns an integer whose index corresponds
        to items in ACTIONS list.
        Returns detected action based on data input.
        """
        x_input = []
        raw = message[1:len(message) - 2]
        processed = raw.split(",")
        x_input.append([float(num) for num in processed])
        ml_input = scaler.transform(x_input)
        result = mlp.predict(ml_input)
        return ACTIONS[result[0]]

    def stop(self):
        self.connection.close()
        self.shutdown.set()


class Processing(threading.Thread):
    """
    General processing thread.
    Processes data from all three clients together and sends to eval and dash.
    """

    def __init__(self):
        super(Processing, self).__init__()
        self.shutdown = threading.Event()
        self.timeout = 50  # automatically send to eval server around every 50 seconds regardless of results
        # self.timer = threading.Timer(self.timeout, self.set_refresh_false)

        # eval client and dash client initialized here
        if EVAL_ON:
            self.evalclient = eval_client.Client(eval_ip, eval_portnum, SECRET_KEY)
        if DASH_ON:
            self.dashclient = dash_client.Client('localhost', dash_portnum, SECRET_KEY)

        self.dashheaders = ['id', 'type', 'pos', 'expectedPos', 'user1action', 'user2action', 'user3action',
                            'delay', 'user1features', 'user2features', 'user3features']

    def run(self):
        """
        Processing: determines required fields from all three clients' data and
        sends to eval server and dash server if applicable. Receives current
        new position from eval server to signal start of next round and
        clears all buffers to start the round.
        Shuts down after
        """
        global client_results
        global client_step
        global EVAL_REFRESH
        global refresh_time
        global dancer_pos
        global timestamp_list
        global NUM_ROUNDS

        # can't tell when the eval server is ready for first round so guess
        time.sleep(20)
        print("eval server ready, maybe, can't tell")
        EVAL_REFRESH = True
        refresh_time = time.time()
        counting_down = True
        while not self.shutdown.is_set():
            self.check_client_complete()

            if (not EVAL_REFRESH) or (time.time() - refresh_time > self.timeout and counting_down):
                counting_down = False
                final_action = self.calc_action()
                # print(f'\n[[[Final decided action is {final_action}]]]')
                if NUM_OF_CLIENTS == 3:
                    self.calc_position()
                delay = self.calc_delay()
                # print(f"[[[sync delay calculated is {delay}]]]")
                time.sleep(WAITTIME)
                if EVAL_ON:
                    self.send_eval(dancer_pos, final_action, delay)
                    next_pos = self.evalclient.get_dancer_positions()
                else:
                    next_pos = '1 2 3'  # default if eval server not connected
                NUM_ROUNDS -= 1

                try:
                    print(f"----received from eval server: {next_pos} ----\n")
                    new = next_pos.split(' ')
                    newi = [int(x) for x in new]
                except ValueError:
                    if DASH_ON and NUM_OF_CLIENTS == 3:
                        self.send_dash_evaluated(delay, dancer_pos)
                        self.stop()
                    continue
                dancer_pos = [int(x) - 1 for x in new]
                if DASH_ON and NUM_OF_CLIENTS == 3:
                    self.send_dash_evaluated(delay, newi)

                # basic logging
                write_ind_action()

                # clear all buffers
                client_results = ['' for x in range(NUM_OF_CLIENTS)]
                client_step = [0 for x in range(NUM_OF_CLIENTS)]
                timestamp_list = [None for x in range(NUM_OF_CLIENTS)]
                EVAL_REFRESH = True
                refresh_time = time.time()
                counting_down = True

    def check_client_complete(self):
        """
        Check if all three clients have determined their respective action.
        It is assumed that steps taken by clients are already set.
        """
        is_complete = True
        for i in client_results:
            if i == '':
                is_complete = False
                break
        if is_complete:
            self.set_refresh_false()

    def set_refresh_false(self):
        global EVAL_REFRESH
        EVAL_REFRESH = False

    def calc_action(self):
        c = Counter(client_results)
        return c.most_common(1)[0][0]

    def calc_delay(self):
        delay = sync_delay.calculate_sync_delay(timestamp_list)
        return int(delay)

    def calc_position(self):
        global dancer_pos

        intermediate = [0 for x in range(NUM_OF_CLIENTS)]  # position to steps
        for i in range(len(client_step)):
            actual_step = client_step[i]
            curr_position = dancer_pos.index(i)
            intermediate[curr_position] = actual_step

        if intermediate[0] == intermediate[-1] == 0:
            # print("no change")
            pass
        elif intermediate[0] == 1 and intermediate[-1] == 0:
            dancer_pos[0], dancer_pos[1] = dancer_pos[1], dancer_pos[0]
        elif intermediate[0] == 0 and intermediate[-1] == 1:
            dancer_pos[1], dancer_pos[2] = dancer_pos[2], dancer_pos[1]
        elif intermediate[0] == 2 and intermediate[-1] == 2:
            dancer_pos[0], dancer_pos[2] = dancer_pos[2], dancer_pos[0]
        elif intermediate[0] == 2 and intermediate[-1] == 1:
            dancer_pos[0], dancer_pos[1], dancer_pos[2] = dancer_pos[1], dancer_pos[2], dancer_pos[0]
        elif intermediate[0] == 1 and intermediate[-1] == 2:
            dancer_pos[0], dancer_pos[1], dancer_pos[2] = dancer_pos[2], dancer_pos[0], dancer_pos[1]
        else:
            print(f'invalid position! now keeping previous position')

    def send_eval(self, pos_result, action_result, delay):
        # format expected is smth like '#1 2 3|action|100'
        to_send = '#'
        for i in pos_result:
            to_send += str(i + 1) + ' '
        to_send = to_send[:-1] + "|"
        to_send += action_result + '|' + str(delay)
        print('\n----to send to eval_server: ', to_send, '----')
        self.evalclient.send_data(to_send)

    def send_dash_expected(self, expectedpos):
        """
        DEPRECATED. Sends dashboard server expected position. All other fields are dummy data.
        """
        expectedposlist = expectedpos.split(' ')
        l = [int(x) for x in expectedposlist]
        data = ['stream', 0, [0, 0, 0], l, '', '', '', 0, [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
        to_send = dict(zip(self.dashheaders, data))
        self.dashclient.send_data(to_send)

    def send_dash_evaluated(self, delay, ep):
        # sends as dict
        got_pos = [x + 1 for x in dancer_pos]
        data = ['stream', 1, got_pos, ep, client_results[0], client_results[1], client_results[2], str(delay),
                features_dict[0], features_dict[1], features_dict[2]]
        to_send = dict(zip(self.dashheaders, data))
        self.dashclient.send_data(to_send)

    def stop(self):
        self.shutdown.set()
        if EVAL_ON:
            self.evalclient.stop()
        if DASH_ON:
            self.dashclient.stop()


def write_ind_action():
    """
    Basic logging function to record individual dancer actions before majority is chosen.
    """
    with open("actions.txt", "a+") as f:
        f.write(str(client_results) + '\n')


def getSeconds(dateInstance):
    """
    DEPRECATED used to convert ntp timestamp to milliseconds.
    """
    dt_obj = datetime.datetime.strptime(str(dateInstance), '%Y-%m-%d %H:%M:%S.%f')
    millisec = dt_obj.timestamp() * 1000
    return int(millisec)


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
    if eval_ip == '':
        eval_ip = 'localhost'

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_address = (ip_addr, port_num)
    print('starting up on %s port %s' % server_address, file=sys.stderr)
    sock.bind(server_address)

    # Listen for incoming connections
    # allow for up to 10 reconnections
    sock.listen(NUM_OF_CLIENTS + 10)

    server_threads = []
    processing = Processing()
    processing.start()

    # initial connection: make sure three clients are connected first!
    print(f'Waiting for {NUM_OF_CLIENTS} connection(s)...')
    try:
        for i in range(NUM_OF_CLIENTS):
            connection, client_address = sock.accept()
            print('connection from', client_address, file=sys.stderr)
            s = Server(connection)
            server_threads.append(s)
            if len(server_threads) == NUM_OF_CLIENTS:
                print('All clients connected! Hopefully!')
    except KeyboardInterrupt:
        processing.stop()
        for s in server_threads:
            s.stop()
        print('Terminated server before connections are established.')
        exit(0)

    for s in server_threads:
        s.start()

    while True:
        try:
            if threading.active_count() == 1:
                # only main thread remains which means processing thread has completed.
                for s in server_threads:
                    s.stop()
                processing.stop()
                print('\nSESSION COMPLETE. SERVER SHUTDOWN :)')
                exit(0)
            elif threading.active_count() < NUM_OF_CLIENTS + 2:
                # 5 threads should be active: main thread + processing thread + 3 server threads
                print('====attempting to reconnect a client===')
                connection, client_address = sock.accept()
                print('====connection from', client_address, "===")
                s = Server(connection)
                server_threads.append(s)
                s.start()
        except KeyboardInterrupt:
            # manual termination
            for s in server_threads:
                s.stop()
            processing.stop()
            print('\nSERVER SHUTDOWN.')
            exit(0)


if __name__ == '__main__':
    main()
