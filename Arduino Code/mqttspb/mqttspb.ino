#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include<SoftwareSerial.h>

SoftwareSerial s(3,1);

// WiFi
const char *ssid = "MCA-IOT"; // Enter your WiFi name
const char *password = "UZtqSWHh";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "broker.emqx.io";
const char *topic = "spb";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String incoming = "";
void setup() {
  // Set software serial baud to 115200;
  pinMode(LED_BUILTIN,OUTPUT);
  Serial.begin(115200);
  Serial1.begin(115200);
  // connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
      String client_id = "esp8266-client-";
      client_id += String(WiFi.macAddress());
      Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
      if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
          Serial.println("Public emqx mqtt broker connected");
      } else {
          Serial.print("failed with state ");
          Serial.print(client.state());
          delay(2000);
      }
  }
  // publish and subscribe
  client.publish(topic, "hello emqx");
  client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length) {
  char message[100];
  for (int i = 0; i < length; i++) {
//      Serial.print((char) payload[i]);
      message[i]=payload[i];
  }
  incoming = String(message);
  s.write(123);
  Serial.println(incoming);
  digitalWrite(LED_BUILTIN,HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN,LOW);
}

void loop() {
  client.loop();
}
