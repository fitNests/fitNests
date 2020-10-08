# Client connection guide

## First time installations

### Install pycryptodome for Crypto module
```
$ sudo apt-get install python3-pip
$ pip3 uninstall crypto
$ pip3 install pycryptodome
$ python3 -m Cryptodome.SelfTest
```
**MUST** use pip3 to install for Python3!
Check that there are no issues importing `Crypto.Cipher.AES` and `Crypto.Util.Padding`.

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
### Quick rundown on how socket comms work laptop ---> FPGA
Server on FPGA is set up first, listening for up to 3 connections on a specified IP address and port. (In our case, port 9999 on xilinx localhost, which is connected by two steps to your laptops through SSH tunneling from the previous section)
