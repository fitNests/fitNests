

# MPU6050 Calibrations

Before compiling and uploading code to your fitNests set, calibrations has to be done.

1. Go to MPU6050_calibration folder and compile [MPU6050_calibration.ino](https://github.com/fitNests/fitNests/blob/master/hardware_beetle%2BMPU6050/MPU6060_calibration/MPU6050_calibration.ino) in Arduino IDE.

2. Connect the beetle with MPU6050 to your computer via USB and upload the code to your Beetle.
**Make sure you are using the correct port (Tools -> Port -> <USB Port Number>**

3. Make sure your MPU6050 is placed on a flat surface. Then launch the serial monitor (Tools -> Serial Monitor)  
**Serial baud rate: 115200** 

4. Wait for the code to run on Beetle. (Enter any character to start)

**DO NOT TOUCH THE MPU6050 OR BEETLE DURING THE CALIBRATION** 

5. Once you see the line saying "FINISHED!", take down the 6 values in the serial monitor. It will look something like this "Your offsets:	-1755	1238	1520	-107	2	-23"

Take this values and place it in your MPU6050_Wrist.ino or MPU6050_Ankle.ino code under the functions section.

mpu.setXAccelOffset(-1755);  
mpu.setYAccelOffset(1238);  
mpu.setZAccelOffset(1520);  
mpu.setXGyroOffset(-107);  
mpu.setYGyroOffset(2);  
mpu.setZGyroOffset(-23);

Contact Nicholas if you face any issues or doubts.