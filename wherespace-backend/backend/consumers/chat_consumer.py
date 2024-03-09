import json

# from ..serializers import EventMessageSerializer  # Assuming you have this serializer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.shortcuts import get_object_or_404

from ..models import EventRoom, EventMessage
from ..restful.serializers.chat_room import EventMessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_room_id = self.scope["url_route"]["kwargs"]["event_room_id"]
        self.room_group_name = "chat_%s" % self.event_room_id

        room = get_object_or_404(EventRoom, pk=self.event_room_id)
        event = room.event
        user = self.scope["user"]

        # Check if user is authenticated
        if user.is_authenticated and event.is_participant(user):
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()

            # Send message history to user upon connection
            await self.send(text_data=EventMessageSerializer(room.event_messages).data)
        else:
            # Reject the connection
            await self.close()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Save the message
        await self.save_message(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=EventMessageSerializer(message).data)

    @database_sync_to_async
    def save_message(self, message):
        event_room = EventRoom.objects.get(pk=self.event_room_id)
        # Assume 'request.user' is the sender. Adjust according to your authentication setup.
        EventMessage.objects.create(
            event=event_room, sender=self.scope["user"], text=message
        )
