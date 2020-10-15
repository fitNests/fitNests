# System connection guide

## First time installations on VM (laptop client)

### Install pycryptodome module at root

```
$ sudo apt-get install python3-pip
$ sudo pip3 install pycryptodome
```
**MUST** use pip3 to install for Python3!

Install pycryptodome at root, because the client is run inside the bluepy code which requires root permissions.

Check that there are no issues importing `Crypto.Cipher.AES` and `Crypto.Util.Padding` as root.

## SSH port forwarding

> laptop:port1 --- sunfire:port2 --- xilinx:port2
> xilinx:port3 --- evalserver:port3
> xilinx:port4 --- dashserver:port4
 
### Laptop ---> Sunfire
On each laptop, run
```
$ ssh -L [port1]:localhost:9999 [username]@sunfire.comp.nus.edu.sg
```
where [port1] can be any port >= 4 digits that is not in use by your system, and [username] is your Sunfire username (hope you remember your password).

### Sunfire ---> FPGA
Only one person needs to run the following on sunfire (most likely Clay):
```
$ ssh -L 9999:localhost:9999 xilinx@137.132.86.228
```

### FPGA ---> Sunfire
This is for dashboard

### Ports in use
laptop:port1 : You pick, just make sure the ssh port forwarded and port entered when running client match (recommend 8080 or 9999)

sunfire:port2 : 9999

xilinx:port2 : 9999

xilinx:port3 : 50000

xilinx:port4 : 11111

dashserver:port4 : 11111

xilinx:9900-9910 : reserved for Lincoln to run Jupyter Notebook and misc stuff

Increment port number by 1 (in code and args) if encounter socket connection refused errors.

## Connection

### Quick rundown on how socket comms work

#### laptop ---> FPGA
Server on FPGA is set up first, listening for up to 3 connections on a specified IP address and port. (In our case, port 9999 on xilinx localhost, which is connected by two steps to your laptops through SSH tunneling from the previous section)

Server establishes connection with the laptops, and the laptops will be able to send data to the server by sending data to the laptop-side port connected to the previously set-up SSH tunnel.

### How to use fpga_client.py 
Testing mode (waits 10 seconds, then sends 15 packets of randomly at 2s interval):

Run the following in shell (WHILE the fpga_server is running):
```
python3 fpga_client.py localhost [port1] 'thisisunhackable'
```
import fpga_client

client = fpga_client.Client(ip_addr:str, portnum:int, secretkey:str)

### How to run fpga_server.py
```
python3 fpga_server.py localhost 9999
```

### How eval_server.py works
~~i'm so fucking tired~~

## System setup flow (IMPORTANT)

1. Setting up ssh tunnels
  a. Three dancers set up ssh port forwarding to sunfire
  b. Clay sets up ssh port forwarding from sunfire to fpga (laptop --> fpga complete)
  c. Umar sets up ssh remote port forwarding from sunfire to dashboard
  d. Clay sets up ssh port forwarding from fpga to sunfire (fpga --> dashboard complete)
  
2. Running servers and clients _(we only have 60 seconds after eval_server starts running!)
  a. Get eval server IP address, give port number and secret key
  b. Umar runs dashboard server
  c. Give OK to run eval server _(60 seconds start here)_
  d. Clay runs fpga server, enters eval server ip address. Wait for 'waiting for connection'
  e. Three dancers run client to connect to fpga server
  f. Wait for eval server to display move and position, and ~~undulate~~ dance!
  
3. Evaluation done
  a. all clients logout by `Ctrl+C` (for now)
  b. all servers should subsequently shut down with properly closed sockets. `Ctrl+C` any that are still up, but be aware that sockets may not close properly and another port may need to be connected (minor todo: find a way to cleanly shut down servers?)
