// class default I2C address is 0x68
// AD0 low = 0x68
// AD0 high = 0x69

// declare static variables
#define OUTPUT_READABLE_WORLDACCEL

// include libraries
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#include "Wire.h"

// declare objects
MPU6050 mpu1(0x68);  //AD0 low
MPU6050 mpu2(0x69);  //AD0 High

// declare pins
const int INTERRUPT_PIN1 = 2;
const int INTERRUPT_PIN2 = 3;
const int LED_PIN = 13;

// declare variables
bool blinkState = false;
bool dmpReady = false;  // set true if DMP init was successful
uint8_t mpuIntStatus;   // holds actual interrupt status byte from MPU
uint8_t devStatus;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount;     // count of all bytes currently in FIFO
uint8_t fifoBuffer[64]; // FIFO storage buffer

// orientation/motion vars
Quaternion q;           // [w, x, y, z]         quaternion container
VectorInt16 aa;         // [x, y, z]            accel sensor measurements
VectorInt16 aaReal;     // [x, y, z]            gravity-free accel sensor measurements
VectorInt16 aaWorld;    // [x, y, z]            world-frame accel sensor measurements
VectorFloat gravity;    // [x, y, z]            gravity vector
float euler[3];         // [psi, theta, phi]    Euler angle container
float ypr[3];           // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

VectorInt16 dataSaved[2];
VectorFloat dataGyro[2];

// packet structure for InvenSense teapot demo
uint8_t teapotPacket[14] = { '$', 0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0x00, 0x00, '\r', '\n' };
// indicates whether MPU interrupt pin has gone high
volatile bool mpuInterrupt = false;

void dmpDataReady() {
  mpuInterrupt = true;
}

void setup_single(MPU6050 mpu, int INTERRUPT_PIN) {
  mpu.initialize();
  pinMode(INTERRUPT_PIN, INPUT);

  devStatus = mpu.dmpInitialize();
  
// Calibrations
//  mpu1.setXGyroOffset(-84);
//  mpu1.setYGyroOffset(94);
//  mpu1.setZGyroOffset(6);
//  mpu1.setXAccelOffset(-1960);
//  mpu1.setYAccelOffset(-6279);
//  mpu1.setZAccelOffset(2364);
//
//  mpu2.setXGyroOffset(-263);
//  mpu2.setYGyroOffset(136);
//  mpu2.setZGyroOffset(23);
//  mpu2.setXAccelOffset(-951);
//  mpu2.setYAccelOffset(-235);
//  mpu2.setZAccelOffset(1623);

  if (devStatus == 0) {
    // Calibration Time: generate offsets and calibrate our MPU6050
    mpu.CalibrateAccel(6);
    mpu.CalibrateGyro(6);
    mpu.PrintActiveOffsets();
    // turn on the DMP, now that it's ready
    mpu.setDMPEnabled(true);

    // enable Arduino interrupt detection
    attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), dmpDataReady, RISING);
    mpuIntStatus = mpu.getIntStatus();

    // set our DMP Ready flag so the main loop() function knows it's okay to use it
    dmpReady = true;

    // get expected DMP packet size for later comparison
    packetSize = mpu.dmpGetFIFOPacketSize();
  }
}

void loop_single(MPU6050 mpu, int INTERRUPT_PIN) {
  // if programming failed, don't try to do anything
  if (!dmpReady) return;

  // wait for MPU interrupt or extra packet(s) available
  while (!mpuInterrupt && fifoCount < packetSize) {
    if (mpuInterrupt && fifoCount < packetSize) {
      // try to get out of the infinite loop
      fifoCount = mpu.getFIFOCount();
    }
  }

  // reset interrupt flag and get INT_STATUS byte
  mpuInterrupt = false;
  mpuIntStatus = mpu.getIntStatus();

  // get current FIFO count
  fifoCount = mpu.getFIFOCount();

  if (fifoCount < packetSize) {

  }

  else if ((mpuIntStatus & (0x01 << MPU6050_INTERRUPT_FIFO_OFLOW_BIT)) || fifoCount >= 1024) {
    // reset so we can continue cleanly
    mpu.resetFIFO();
//    Serial.println(F("FIFO overflow!"));

  } else if (mpuIntStatus & (0x01 << MPU6050_INTERRUPT_DMP_INT_BIT)) {

    while (fifoCount >= packetSize) {
      mpu.getFIFOBytes(fifoBuffer, packetSize);
      fifoCount -= packetSize;

    }
#ifdef OUTPUT_READABLE_QUATERNION
    mpu.dmpGetQuaternion(&q, fifoBuffer);
#endif

#ifdef OUTPUT_READABLE_WORLDACCEL
    // display initial world-frame acceleration, adjusted to remove gravity
    // and rotated based on known orientation from quaternion
    mpu.dmpGetQuaternion(&q, fifoBuffer);
    mpu.dmpGetAccel(&aa, fifoBuffer);
    mpu.dmpGetGravity(&gravity, &q);
    mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity);
    mpu.dmpGetLinearAccelInWorld(&aaWorld, &aaReal, &q);
    mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
        
    dataSaved[INTERRUPT_PIN - 2].x = aaWorld.x;
    dataSaved[INTERRUPT_PIN - 2].y = aaWorld.y;
    dataSaved[INTERRUPT_PIN - 2].z = aaWorld.z;
    dataGyro[INTERRUPT_PIN - 2].x = ypr[0] * 180 / M_PI;
    dataGyro[INTERRUPT_PIN - 2].y = ypr[1] * 180 / M_PI;
    dataGyro[INTERRUPT_PIN - 2].z = ypr[2] * 180 / M_PI;

  }
#endif

  // blink LED to indicate activity
  blinkState = !blinkState;
  digitalWrite(LED_PIN, blinkState);
}


void setup() {
  // for debugging
  Serial.begin(115200);

  // inititalize wire library
  Wire.begin();
  Wire.setClock(100000);

  // initialize pins
  setup_single(mpu1, INTERRUPT_PIN1);
  setup_single(mpu2, INTERRUPT_PIN2);
}

void loop() {
  loop_single(mpu1, INTERRUPT_PIN1);
  loop_single(mpu2, INTERRUPT_PIN2);

    Serial.print("A:[x:");
    Serial.print(dataSaved[0].x);
    Serial.print("/y:");
    Serial.print(dataSaved[0].y);
    Serial.print("/z:");
    Serial.print(dataSaved[0].z);
    Serial.print(",y:");
    Serial.print(dataGyro[0].x);
    Serial.print("/p:");
    Serial.print(dataGyro[0].y);
    Serial.print("/r:");
    Serial.print(dataGyro[0].z);
    Serial.println("]");

    Serial.print("B:[x:");
    Serial.print(dataSaved[1].x);
    Serial.print("/y:");
    Serial.print(dataSaved[1].y);
    Serial.print("/z:");
    Serial.print(dataSaved[1].z);
    Serial.print(",y:");
    Serial.print(dataGyro[1].x);
    Serial.print("/p:");
    Serial.print(dataGyro[1].y);
    Serial.print("/r:");
    Serial.print(dataGyro[1].z);
    Serial.println("]");
    
}
