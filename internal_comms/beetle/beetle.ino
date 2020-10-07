#include <SoftwareSerial.h>
#define BASE_ITOA 30
#define ZERO_OFFSET 13500

unsigned long previous_timeA = 0;
unsigned long previous_timeB = 0;
long count = 0;
volatile bool handshake_flag = false;
char buff[20];

//Dummy values to send
//Actual values range [-13500, 13499]
int arr[6] = {0, 19, 20, -123, -13500, 13499};

//compress + computeChecksum gives a 1-byte checksum
int compress(int num) {
  if (num < 10) {
      return num;
  }
  return num%10 ^ compress(num/10);
}
int computeChecksum(char *s) {
  int output = 0;
  for (int i = 0; i < strlen(s); i++) {
    output ^= s[i];
  }
  return compress(output);
}

//__Deprecated function to print padded numbers__
void padprint(char *s) {
  int count = 3 - strlen(s);
  while (count--) {
    Serial.print('0');
  }
  for (int i = 0; i < strlen(s); i++) {
    Serial.print(s[i]); 
  }
}

//Function to offset raw values by ZERO_OFFSET
int getOffset(int num) {
  return (num + ZERO_OFFSET)%(ZERO_OFFSET*2);
}

//Function to pad numbers being sad with extra 0s. b: buffer to be padded, s: original numbers
void setPad(char *b, char *s) {
  int padsize = 3 - strlen(s);
  int startIdx = strlen(b);
  for (int i = startIdx; i < startIdx+padsize; i++) {
    b[i] = '0';
  }
  int y = 0;
  startIdx = strlen(b);
  for (int i = startIdx; i < startIdx+strlen(s); i++) {
    b[i] = s[y++];
  }
}

void setup() {
  Serial.begin(115200);  //initial the Serial
  randomSeed(analogRead(0));
  previous_timeA = millis();
  previous_timeB = millis();
}

//Task to check handshake with laptop
void checkHandshake() {
  if (!handshake_flag && Serial.available()) {
    if (Serial.read() == 'H') {
      buff[0] = 'A';
      Serial.print(buff);
      handshake_flag = true;
      delay(50);
    }
  }  
}

//Task to send 1st array of values (from arm sensor) ~15-20Hz
void sendArmData() {
  //Send arm sensor
  if (handshake_flag && (millis() - previous_timeA >= 30UL) ) {
    int i = 0;
    char temp[4];
    for (int j = 0; j < 6; j++) {
      itoa(getOffset(arr[j]), temp, BASE_ITOA);
      setPad(buff, temp); //copies temp onto buff with pads
    }
    int checksumDecimal = computeChecksum(buff);
    //checksum from 'a' to 'p' for i==0
    buff[18] = checksumDecimal + 'a';
    
    Serial.print(buff);
    memset(buff, 0, 20);
    delay(23);
    previous_timeA = millis();
    
    //simulate changing values
    arr[0] = (arr[0] + 1)%10;
  }
}

//Task to send 2nd array of values (from body sensor) ~4-5Hz
void sendBodyData() {
    //Send body sensor
  if (handshake_flag && (millis() - previous_timeB >= 181UL) ) {
    int i = 1;
    char temp[4];
    for (int j = 0; j < 6; j++) {
      itoa(getOffset(arr[j]), temp, BASE_ITOA);
      setPad(buff, temp); //copies temp onto buff with pads
    }
    int checksumDecimal = computeChecksum(buff);
    //checksum from 'A' to 'P' for i==1
    buff[18] = checksumDecimal + 'A';
    
    Serial.print(buff);
    memset(buff, 0, 20);
    delay(13);
    previous_timeB = millis();
  }
}

void loop() {
  checkHandshake();
  sendArmData();
  sendBodyData();
}
