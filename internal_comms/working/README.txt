### INSTRUCTIONS ON HOW TO USE ###

1) Setting up Beetles
Upload 'beetle_arm.ino' and 'beetle_body.ino' code onto each beetle.
#Do your necessary replacement of the array within the code

2) Setting up the server
Run:
ssh -X -L 8080:localhost:9999 <USER>@sunfire.comp.nus.edu.sg
Password: <Your SoC password>

Run:
ssh -X -L 9999:localhost:9999 xilinx@137.132.86.228
Password: xilinx

Run:
cd ext_comms
python3 fpga_server.py localhost 9999

3) Setting up the client connection
(For setting up sunfire hop)
Run:
ssh -X -L 8080:localhost:9999 <USER>@sunfire.comp.nus.edu.sg
Password: <Your SoC password>

(For running main client code)
Run: (On VMBOX)
cd ~/shared/BLE_comms1_code/working
sudo python3 ble_client.py
