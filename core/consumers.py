from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
import json
from .models import Room
# from django.contrib.auth.models import User

class PlayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roompk']
        self.room_group_name = 'draw_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        point = text_data_json['point']
        new_path = text_data_json['new_path']
        username = text_data_json['username']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'paths',
                'point': point,
                'username': username,
                'new_path': new_path
            }
        )

    async def paths(self, event):
        point = event['point']
        username = event['username']
        new_path = event['new_path']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'new_path': new_path,
            'point': point,
            'username': username
        }))

class StartConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roompk']
        self.room_group_name = 'start_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data = json.loads(text_data)
        message_type = text_data['messageType']
        print(message_type)
        # Send message of type 'start' to room group if the room is full
        if message_type == 'startgame':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'start',
                }
            )
        # Send message of type 'ping' to room group if the room still has space
        elif message_type == 'ping':
            # print(text_data['roomData'])
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'ping',
                    'roomData': text_data['roomData'],
                    'username': text_data['username']
                }
            )
        # Send message of type 'pong' as the response to a 'ping' message
        elif message_type == 'pong':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'pong',
                    'ponger': text_data['ponger'],
                    'pinger': text_data['pinger']
                }
            )

    def start(self, text_data):
        # Send message of type 'start' to WebSocket if the room is full
        self.send(text_data=json.dumps({
            'type': 'start'
        }))

    def ping(self, text_data):
        # Pass the ping message to the WebSocket
        self.send(text_data=json.dumps({
            'type': 'ping',
            'roomData': text_data['roomData'],
            'pinger': text_data['username']
        }))

    def pong(self, text_data):
        # Pass the username data that we received from a pong message to the WebSocket
        self.send(text_data=json.dumps({
            'type': 'pong',
            'ponger': text_data['ponger'],
            'pinger': text_data['pinger']
        }))

class ScoreConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roompk']
        self.room_group_name = 'score_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user1 = text_data_json['user1']
        user2 = text_data_json['user2']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'add_score',
                'user1': user1,
                'user2': user2
            }
        )

    def add_score(self, event):
        user1 = event['user1']
        user2 = event['user2']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'user1': user1,
            'user2': user2
        }))
