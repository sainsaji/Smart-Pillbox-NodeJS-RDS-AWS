//Libraries
#include "RTClib.h"
#include <Stepper.h>
#include<Servo.h>
#include <Adafruit_NeoPixel.h>

int pos;

//Neopixel Definitions
#define STRIPA 12
#define STRIPSIZE 16

//Day of Week
#define LEAP_YEAR(Y)     ( (Y>0) && !(Y%4) && ( (Y%100) || !(Y%400) )) 

//Initializations
RTC_DS3231 rtc; 
Stepper myStepper(200, 8, 9, 10, 11);
Servo Myservo;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(STRIPSIZE, STRIPA, NEO_GRB + NEO_KHZ800);


//Stepper
int rotation=0;
bool rotEnable = false;
const float resolution  = 10;
int initialDay = 0;
int numofrotation = 0;

//Ultrasonic
#define echoPin 5 // attach pin D2 Arduino to pin Echo of HC-SR04
#define trigPin 7 //attach pin D3 Arduino to pin Trig of HC-SR04
long duration; // variable for the duration of sound wave travel
int distance; 

//schedules
String timeNow = "";
String timeThen = "";
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
String incoming = "1{11:142022-12-15}";

//Unlock
bool unlock = false;
bool pillSlot = false;

//To check Human Presence
void checkDistance()
{
  // Clears the trigPin condition
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  // Displays the distance on the Serial Monitor
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  if(distance<=5)
  {
    unlockPillSlot();  
  }
}

//To calculate day of week from a given date
int dayOfWeek(uint16_t year, uint8_t month, uint8_t day)
{
  uint16_t months[] = {
    0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365         };   // days until 1st of month

  uint32_t days = year * 365;        // days until year 
  for (uint16_t i = 4; i < year; i += 4) if (LEAP_YEAR(i) ) days++;     // adjust leap years, test only multiple of 4 of course

  days += months[month-1] + day;    // add the days of this year
  if ((month > 2) && LEAP_YEAR(year)) days++;  // adjust 1 if this year is a leap year, but only after febr

  return days % 7;   // remove all multiples of 7
}

//Rotation Resolutions
int step_degree(float desired_degree)
{
    return (desired_degree/resolution);
}

//Rotate SPB One day
void rotateSPB()
{
  rotEnable = true;
  numofrotation++;
  while(rotEnable)
    {
      myStepper.step(step_degree(40));
      delay(50);
      rotation+=1;
      if(rotation==73)
      {
        rotEnable = false;
        rotation=0;
      }
    }
  Serial.print("Number of Rotations:");
  Serial.print(numofrotation);
}

//Read Current Date and Time
String timeRead()
{
  DateTime time = rtc.now();
  return String(time.timestamp(DateTime::TIMESTAMP_FULL));
}

//Read Todays Day
String weekDayRead()
{
  DateTime time = rtc.now();
  return String(daysOfTheWeek[time.dayOfTheWeek()]);
}

//Check for Schedule
void scheduleCheck(String scheduledDateTime,String currentDateTime)
{
  Serial.println();
  Serial.print("Scheduled Time:");
  Serial.print(scheduledDateTime);
  Serial.print(" Current Time:");
  Serial.print(currentDateTime);
  Serial.println();
  if(scheduledDateTime.substring(5,15)==currentDateTime.substring(0,10))
  {
    Serial.println("Date Matched");
    if(scheduledDateTime.substring(0,5)==currentDateTime.substring(11,16))
    {
      Serial.println("Time Matched");
      unlock = true;
      strip.setPixelColor(0,255, 0, 0);
      strip.show();
      timeNow = timeRead();
      Serial.println("Scheduled Day:");
      int day = dayOfWeek(2022,12,15);
      Serial.println(daysOfTheWeek[day]);
      while(true)
      {
        Serial.println("Rotating Pill Box");
        if(initialDay>=7)
        {
          initialDay=0;
        }
        if(initialDay!=day)
        {
          rotateSPB();
          initialDay++;
        }
        else
        {
          break;
        }
      }
    }
    while(unlock)
    {
      checkDistance();
      timeThen = timeRead();
      int time1 = timeNow.substring(14,16).toInt();
      int time2 = timeThen.substring(14,16).toInt();
      Serial.println("Time Differnce is:");
      Serial.println(time2-time1);
      if(time2-time1>2)
      {
        Serial.println("expired");
        timeNow = "";
        timeThen = "";
        unlock = false;
        strip.setPixelColor(0,0, 255, 0);
        strip.show();
      }
    }
  }
}

//Extract date and time from MQTT String
void dateTimeExtractor(int count,String strippedString)
{
  Serial.println("Extracting Date and Time");
  int parta = 1;
  int partb = 16;
  for(int i=0;i<count;i++)
  {
    scheduleCheck(strippedString.substring(parta,partb),timeRead());
    parta = parta+17;
    partb = partb+17;
  }
}

//To unlock Pill Slot
void unlockPillSlot()
{
  for(pos=0;pos<=180;pos++)
    {
      Myservo.write(pos);
      delay(15);
    }
    delay(10000);
    for(pos=180;pos>=0;pos--)
    {
      Myservo.write(pos);
      delay(15);
    }
}

void setup() 
{
  // Open serial communications and wait for port to open:
  strip.begin();
  strip.setBrightness(100);  
  strip.show(); 
  Myservo.attach(6);
  myStepper.setSpeed(60);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(LED_BUILTIN,OUTPUT);
  Serial.begin(115200);
  Serial.println("Uno Serial Start");
  if (! rtc.begin()) 
  {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1) delay(10);
  }
  if (rtc.lostPower()) 
  {
    Serial.println("RTC lost power, let's set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}


void loop() 
{ 
  if (Serial.available()) 
  {
    incoming = Serial.readString();
    Serial.println("From NodeMCU");
    Serial.println(incoming);
    if(incoming.indexOf("2022") > 0)
    {
      Serial.println("Stripping");
      String stripped = incoming.substring(0,18);
      Serial.println(stripped);
      Serial.println("Todays Date:");
      Serial.println(weekDayRead());
      int countOfSchedule = incoming.substring(0,1).toInt();
      Serial.print("Number of Schedules:");
      Serial.println(countOfSchedule);
      String strippedString = incoming.substring(1);
      Serial.println("Recived Schedule String");
      Serial.println(strippedString);
      dateTimeExtractor(countOfSchedule,strippedString);
      }
    }
  
}
