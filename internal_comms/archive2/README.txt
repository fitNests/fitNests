### INSTRUCTIONS ON HOW TO USE ###

1) Setting up Beetles
Upload 'Beetle_MPU6050_Wrist.ino' and 'Beetle_MPU6050_Ankle.ino' code onto each beetle.

2) Setting up the server
Run:
ssh -X -L 8081:localhost:9999 <USER>@sunfire.comp.nus.edu.sg
Password: <Your SoC password>

Run:
ssh -X -L 9999:localhost:9999 xilinx@137.132.86.228
Password: xilinx

#For claire to run server
Run:
cd ext_comms
python3 fpga_server.py localhost 9999

3) Setting up the client connection
(For setting up sunfire hop)
Run:
ssh -X -L 8081:localhost:9999 <USER>@sunfire.comp.nus.edu.sg
Password: <Your SoC password>

(For running main client code)
Run: (On VMBOX)
cd ~/shared/BLE_comms1_code/working
OR (if git-clone)
cd fitNests/internal_comms/<YOUR_NAME>

sudo python3 client.py

#YOU NEED TO SEE 2 LINES Stating your Beetles' MAC ADDRESS before the line of 'End of Initial Scan' for it to indicate a success!

################################################################################################
!!! Note for reconnection issues !!!
If your wearable has issues with establishing a stable connection, you may need to edit some parameter in the btle.py package under bluepy.

Run:
cd /usr/local/lib/python3.8/dist-packages/bluepy
sudo vim btle.py

//Goto line 402, under _getResp(...) method under Peripheral class.
//You need to change timeout from `None` to `3`
