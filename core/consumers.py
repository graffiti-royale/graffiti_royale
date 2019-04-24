from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
import json
from .models import Room
from django.contrib.auth.models import User

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

class UsersConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roompk']
        self.room_group_name = 'users_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        enter = text_data_json['enter']
        color = text_data_json['color']
        word = text_data_json['random_word']

        user = User.objects.get(username=text_data_json['username'])
        room = Room.objects.get(pk=self.room_name)
        
        user.profile.color = color
        user.profile.word = word
        user.profile.save()
        
        if not enter:
            room.users.remove(user)
            if room.users.count() == 0:
                print('empty')
                room.delete()
            if user.profile.guest:
                user.delete()

        users = {person.username:{"word":person.profile.word, "guest":person.profile.guest, "color":person.profile.color, "paths":[]} for person in room.users.all()}

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'send_users',
                'users': users,
            }
        )

    def send_users(self, event):
        users = event['users']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'users': users,
            'room': self.room_name
        }))
