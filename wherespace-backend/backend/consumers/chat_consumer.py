import json
from typing import Tuple

# from ..serializers import EventMessageSerializer  # Assuming you have this serializer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework import serializers

from ..models import EventRoom, EventMessage, Event
from ..restful.serializers.chat_room import EventMessageSerializer


class HistoryMessageSerializer(serializers.Serializer):
    messages = EventMessageSerializer(many=True)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope["url_route"]["kwargs"]["event_id"]
        self.room_group_name = "chat_%s" % self.event_id

        room, event = await self.get_room_and_event()
        user = self.scope["user"]

        # Check if user is authenticated
        if user.is_authenticated and await event.async_is_participant(user):
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()

            # Send message history to user upon connection
            await self.send(text_data=await self.serializes_messages(room))
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
        await self.send(text_data=await self.serializes_message(message))

    @database_sync_to_async
    def serializes_messages(self, room) -> str:
        return json.dumps(
            HistoryMessageSerializer({"messages": room.event_messages.all()}).data
        )

    @database_sync_to_async
    def serializes_message(self, message) -> str:
        return json.dumps(EventMessageSerializer(message).data)

    @database_sync_to_async
    def save_message(self, message):
        event_room = EventRoom.objects.get(pk=self.event_id)
        # Assume 'request.user' is the sender. Adjust according to your authentication setup.
        EventMessage.objects.create(
            event=event_room, sender=self.scope["user"], text=message
        )

    @database_sync_to_async
    def get_room_and_event(self) -> Tuple[EventRoom, Event]:
        try:
            room = EventRoom.objects.get(event__pk=self.event_id)
        except EventRoom.DoesNotExist:
            event = Event.objects.get(pk=self.event_id)
            room = EventRoom(event=event)
            room.save()

        return room, room.event
