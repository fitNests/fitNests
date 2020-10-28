#define BASE_ITOA 30
#define ZERO_OFFSET 13500

unsigned long previous_timeA = 0;
long count = 0;
volatile bool start_handshake_flag = false;
volatile bool handshake_flag = false;
char buff[20];

/*Actual values range [-13500, 13499] 
 * ## TO BE REPLACED HERE... [x,y,z,yaw,pitch,roll,c=checksum+id]
*/
int arr[6] = {0, 19, 20, -123, -13500, 13499};

//compress checksum to single byte
int compress(int num) {
  if (num < 10) {
      return num;
  }
  return num%10 ^ compress(num/10);
}

//computeChecksum gives a 1-byte checksum
int computeChecksum(char *s) {
  int output = 0;
  for (int i = 0; i < strlen(s); i++) {
    output ^= s[i];
  }
  return compress(output);
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
  previous_timeA = millis();
}

//Task to check handshake with laptop
void checkHandshake() {
  if (!start_handshake_flag && Serial.available()) {
    if (Serial.read() == 'H') {
      buff[0] = 'A';
      Serial.print(buff);
      handshake_flag = true;
      delay(50);
      memset(buff, 0, 20);
      start_handshake_flag = true;
    }
  }
  if (start_handshake_flag && Serial.available()) {
    if (Serial.read() == 'A') {
      handshake_flag = true;
    }
  }
}

//Task to send 1st array of values (from arm sensor) ~15-20Hz
void sendArmData() {
  //Send arm sensor
  if (handshake_flag) {
    int i = 0;
    char temp[4];
    for (int j = 0; j < 6; j++) {
      
      itoa(getOffset(arr[j]), temp, BASE_ITOA); //TO BE REPLACED WITH ACTUAL ARRAY HERE
      
      setPad(buff, temp); //copies temp onto buff with pads
    }
    int checksumDecimal = computeChecksum(buff);
    //checksum from 'a' to 'p' for i==0
    buff[18] = checksumDecimal + 'a';
    
    Serial.print(buff);
    memset(buff, 0, 20);
//    previous_timeA = millis();
    
    //For dummy values --CAN REMOVE
    arr[0] = (arr[0] + 1)%10;
  }
}

void loop() {
  checkHandshake();
  sendArmData();
  delay(30);
}
