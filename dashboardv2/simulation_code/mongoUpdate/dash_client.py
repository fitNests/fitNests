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
        print('sending data')
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
    test_data1 = ['stream', 1, [1, 2, 3], [3, 2, 1], 'rocket', 'pushback', 'rocket', 100, [1, 1, 1, 100, 100, 100], [2, 2, 2, 200, 200, 200],
                  [42, 3, 125, 310, 60, 70]]

    test_data2 = ['stream', 1, [2, 3, 1], [1, 2, 3], 'zigzag', 'shouldershrug', 'zigzag', 200, [300, 20, 1, 70, 12, 128], [20, 201, 80, 12, 44, 109, ],
                  [300, 300, 300, 3, 3, 3]]
    test_data3 = ['stream', 1, [3, 1, 2], [1, 2, 3], 'hair', 'hair', 'hair', 200, [20, 210, 41, 50, 112, 18], [120, 21, 220, 112, 4, 10, ],
                  [300, 300, 300, 3, 3, 3]]
    test_data4 = ['stream', 1, [3, 2, 1], [1, 2, 3], 'shouldershrug', 'zigzag', 'pushback', 200, [300, 20, 1, 70, 12, 128], [20, 201, 80, 12, 44, 109, ],
                  [300, 300, 300, 3, 3, 3]]
    test_data5 = ['stream', 1, [3, 1, 2], [1, 2, 3], 'windowwipe', 'windowwipe', 'windowwipe', 200, [300, 20, 1, 70, 12, 128], [20, 201, 80, 12, 44, 109, ],
                  [300, 300, 300, 3, 3, 3]]
    test_data6 = ['stream', 1, [1, 2, 3], [1, 2, 3], 'elbowlock', 'windowwipe', 'elbowlock', 200, [300, 20, 1, 70, 12, 128], [20, 201, 80, 12, 44, 109, ],
                  [300, 300, 300, 3, 3, 3]]
    test_data7 = ['stream', 1, [3, 2, 1], [1, 2, 3], 'scarecrow', 'scarecrow', 'elbowlock', 200, [300, 20, 1, 70, 12, 128], [20, 201, 80, 12, 44, 109, ],
                  [300, 300, 300, 3, 3, 3]]

    headers = ['id', 'type', 'pos', 'expectedPos', 'user1action', 'user2action', 'user3action', 'delay', 'user1features', 'user2features', 'user3features']
    if random.randint(1, 6) == 1:
        data = dict(zip(headers, test_data1))
    elif random.randint(1, 6) == 2:
        data = dict(zip(headers, test_data2))
    elif random.randint(1, 6) == 3:
        data = dict(zip(headers, test_data3))
    elif random.randint(1, 6) == 4:
        data = dict(zip(headers, test_data4))
    elif random.randint(1, 6) == 5:
        data = dict(zip(headers, test_data5))
    elif random.randint(1, 6) == 6:
        data = dict(zip(headers, test_data6))
    else:
        data = dict(zip(headers, test_data7))
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
            time.sleep(2)
            count += 1
            if count == 30:
                client.stop()
                print("stop sending")
                break
    except KeyboardInterrupt:
        client.stop()


if __name__ == '__main__':
    main()
