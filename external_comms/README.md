# Client connection guide

## First time installations

### Install pycryptodome module at root

```
$ sudo apt-get install python3-pip
$ sudo -i
$ sudo pip3 install pycryptodome
$ python3 -m Cryptodome.SelfTest
```
**MUST** use pip3 to install for Python3!

Install pycryptodome at root, because the client is run inside the blueno code which requires root permissions.

Check that there are no issues importing `Crypto.Cipher.AES` and `Crypto.Util.Padding` as root.

## SSH port forwarding

> laptop:port1 --- sunfire:port2 --- xilinx:port3
 
### Laptop --- Sunfire
On each laptop, run
```
$ ssh -L [port1]:localhost:9999 [username]@sunfire.comp.nus.edu.sg
```
where [port1] can be any port >= 4 digits that is not in use by your system, and [username] is your Sunfire username (hope you remember your password).

### Sunfire --- FPGA
Only one person needs to run the following on sunfire (most likely me):
```
$ ssh -L 9999:localhost:9999 xilinx@137.132.86.228
```

## Connection

### Quick rundown on how socket comms work: laptop ---> FPGA
Server on FPGA is set up first, listening for up to 3 connections on a specified IP address and port. (In our case, port 9999 on xilinx localhost, which is connected by two steps to your laptops through SSH tunneling from the previous section)

Server establishes connection with the laptops, and the laptops will be able to send data to the server by sending data to the laptop-side port connected to the previously set-up SSH tunnel.

### How to use fpga_client.py
Testing mode (waits 10 seconds, then sends 15 packets of randomly at 2s interval):

Run the following in shell (WHILE the server is running):
```
python3 fpga_client.py localhost [port1] 'thisisunhackable'
```

### How to run fpga_server.py
```
python3 fpga_server.py localhost 9999
```

### How eval_server.py works

