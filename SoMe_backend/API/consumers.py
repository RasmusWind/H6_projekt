import json
from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

ONLINE = []

class Consumer(WebsocketConsumer):

    def get_sender_user(self, user_id):
        return User.objects.get(pk=user_id)

    def connect(self):
        userLazy = self.scope['user']
        user = self.get_sender_user(userLazy.id)
        ONLINE.append(user.id)

        single_group_name = f"user-{user.id}"

        async_to_sync(self.channel_layer.group_add)(
            "all_users",
            self.channel_name
        )
        
        async_to_sync(self.channel_layer.group_add)(
            single_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']
        receiver = text_data_json["receiver"]

        if (receiver == "publicPost"):
            async_to_sync(self.channel_layer.group_send)(
                "all_users",
                {
                    'type':'post',
                    'sender':sender,
                    'message':message
                }
            )
        elif (receiver == "friendsPost"):
            async_to_sync(self.channel_layer.group_send)(
                "all_users",
                {
                    'type':'post',
                    'sender':sender,
                    'message':message
                }
            )
        elif(message == "friendrequest"):
            async_to_sync(self.channel_layer.group_send)(
                f"user-{receiver}",
                {
                    'type':'friendrequest',
                    'sender':sender,
                    'message':message
                }
            )
        elif(message == "acceptfriendrequest"):
            async_to_sync(self.channel_layer.group_send)(
                f"user-{receiver}",
                {
                    'type':'friendrequest',
                    'sender':sender,
                    'message':message
                }
            )
        elif(message == "removefriendrequest"):
            async_to_sync(self.channel_layer.group_send)(
                f"user-{receiver}",
                {
                    'type':'friendrequest',
                    'sender':sender,
                    'message':message
                }
            )
        elif(message == "removefriend"):
            async_to_sync(self.channel_layer.group_send)(
                f"user-{receiver}",
                {
                    'type':'friendrequest',
                    'sender':sender,
                    'message':message
                }
            )

    def post(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'sender':sender,
            'message':message
        }))
        
    def friendrequest(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'sender':sender,
            'message':message
        }))

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'sender':sender,
            'message':message
        }))

    def disconnect(self, code):
        user_id = self.scope['user'].id
        ONLINE.remove(user_id)
        return super().disconnect(code)