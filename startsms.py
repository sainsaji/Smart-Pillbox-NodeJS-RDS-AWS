# python3.6

import random

from paho.mqtt import client as mqtt_client
from twilio.rest import Client
from datetime import datetime
import time

# Your Account SID from twilio.com/console
account_sid = "ACa17ae3b337557bc9b97062d8fde8427d"
# Your Auth Token from twilio.com/console
auth_token  = "6f9d1d5b03c5f587105e803e3d70e44e"

clientx = Client(account_sid, auth_token)


broker = 'broker.emqx.io'
port = 1883
topic = "spb"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 100)}'
username = 'emqx'
password = 'public'

message1 = ""
def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        message1 = msg.payload.decode();
        print(message1[2:7])
        time.sleep(2)
        sendSMS = True
        while sendSMS:
            now = datetime.now()
            current_time = now.strftime("%H:%M")
            if(current_time==(message1[2:7])):
                message = clientx.messages.create(
                to="+919113879508", 
                from_="+16508998979",
                body="Take Your Pill")
                print(message.sid)
                sendSMS = False            
    client.subscribe(topic)
    client.on_message = on_message
    
    


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()
    


if __name__ == '__main__':
    run()
