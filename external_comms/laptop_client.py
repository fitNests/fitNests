# add secret key later
import sys
import socket
import time

# from Crypto.Cipher import AES

BLOCK_SIZE = 16
PADDING = '  '

class Client():
    def __init__(self, ip_address, port_num, group_id):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_address, port_num)
        self.sock.connect(server_address)
        print(f"Client is connected to server: {ip_address}")
        
        
    def send_data(self, position, action, delay):
        test_string = "#" + position + "|" + action + "|" + delay
        test_data = test_string.encode('utf-8')
        print("to send:", test_data)
        self.sock.sendall(test_data)
        
            
    def stop(self):
        self.sock.close()
        # self.connection.close()
        # self.shutdown.set()
        # self.timer.cancel()            
        
        
    def last_dancer_pos(self):
        dancer_pos = self.sock.recv(1024)
        # print("acknowledged")
        return dancer_pos


def main():
    if len(sys.argv) != 4:
        print('Invalid number of arguments')
        print('python server.py [IP address] [Port] [groupID]')
        sys.exit()

    ip_addr = sys.argv[1]
    port_num = int(sys.argv[2])
    group_id = sys.argv[3]

    client = Client(ip_addr, port_num, group_id)

    # testing
    time.sleep(15)
    action = ''

    count = 0
    while action != "logout":
        print(f"data: #{count}")
        client.send_data("1 2 3", "action", "2")
        dancer_pos = client.last_dancer_pos()
        print("From Server:", dancer_pos.decode('utf8'))
        time.sleep(2)
        count += 1
        if(count == 20) :
            client.stop()
            print("stop sending")
            break
            

if __name__ == '__main__':
    main()
