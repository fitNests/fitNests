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
$ ssh -L 8081:localhost:9999 [username]@sunfire.comp.nus.edu.sg
```
where [username] is your Sunfire username (hope you remember your password).

### Sunfire ---> FPGA
Only one person needs to run the following on sunfire (most likely Clay):
```
$ ssh -L 9999:localhost:9999 xilinx@137.132.86.228
```

### FPGA ---> Sunfire
From FPGA, do _local_ port forwarding in the background.
```
$ ssh -f -L 11111:localhost:11111 [username].sunfire.comp.nus.edu.sg -N
```

### Sunfire ---> Dashboard
Make sure that GatewayPorts is enabled in sshd_config.
From dashboard device, do _remote_ port forwarding.
```
$ ssh -R 11111:localhost:11111 [username].sunfire.comp.nus.edu.sg
```

### Ports in use
laptop:port1 : 8081

sunfire:port2 : 9999

xilinx:port2 : 9999

xilinx:port3 : 50000 (connects to eval server)

xilinx:port4 : 11111

dashserver:port4 : 11111

xilinx:9900-9910 : reserved for Lincoln to run Jupyter Notebook and misc stuff

Increment port number by 1 (in code and args) if encountered socket connection refused errors.

## System setup flow (IMPORTANT)

1. Setting up ssh tunnels

    a. Three dancers set up ssh port forwarding to sunfire
    
    b. Clay sets up ssh port forwarding from sunfire to fpga (laptop --> fpga complete)
    
    c. Umar sets up ssh remote port forwarding from sunfire to dashboard
    
    d. Clay sets up ssh port forwarding from fpga to sunfire (fpga --> dashboard complete)
  
2. Running servers and clients _(we only have 60 seconds after eval_server starts running!)_

    a. Get eval server IP address, give port number and secret key
    
    b. Umar runs dashboard server
    
    c. Give OK to run eval server _(60 seconds start here)_
    
    d. Clay runs fpga server, enters eval server ip address. Wait for 'waiting for connection'
    
    e. Three dancers run client to connect to fpga server
    
    f. Wait for eval server to display move and position, and ~~undulate~~ dance!
  
3. Evaluation done

    a. all clients logout by `Ctrl+C`
    
    b. fpga server shuts down by `Ctrl+C`
    
    c. all remaining servers should subsequently shut down with properly closed sockets. `Ctrl+C` any that are still up, but be aware that sockets may not close properly.
