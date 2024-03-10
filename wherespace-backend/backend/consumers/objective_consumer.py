import json
from typing import Tuple
from urllib.parse import parse_qs

# from ..serializers import EventMessageSerializer  # Assuming you have this serializer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.apps import apps

from .utils import json_converter
from ..models import EventRoom, EventMessage, Event
from ..restful.serializers.event import EventObjectiveSerializer

User = apps.get_model("backend", "User")
Todo = apps.get_model("backend", "Todo")
EventObjective = apps.get_model("backend", "EventObjective")


class ObjectiveConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope["url_route"]["kwargs"]["event_id"]
        self.room_group_name = "objective_%s" % self.event_id

        event = await self.get_event()
        user = self.scope["user"]

        if user.is_anonymous:
            query = parse_qs(self.scope["query_string"].decode("utf-8"))
            if user_id := query.get("user_id", None):
                user = await self.get_user(user_id[0])

        # Check if user is authenticated
        if user.is_authenticated and await event.async_is_participant(user):
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()

            # Send message history to user upon connection
            await self.send(text_data=await self.serializes_messages(event))
        else:
            # Reject the connection
            await self.close()

    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(pk=user_id)
        return user

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)

        objective_id = text_data_json["objective_id"]

        user_ids = parse_qs(self.scope["query_string"].decode("utf-8")).get(
            "user_id", None
        )
        user_id = user_ids and user_ids[0]

        if "delete_todo" in text_data_json:
            todo_id = text_data_json["delete_todo"]
            objective, data = await self.delete_todo(todo_id, objective_id, user_id)
        elif "complete_todo" in text_data_json:
            todo_id = text_data_json["complete_todo"]
            checked = text_data_json["completed"]
            objective, data = await self.complete_todo(
                todo_id, objective_id, checked, user_id
            )
        else:
            content = text_data_json["content"]
            objective, data = await self.save_objective(content, objective_id, user_id)

        if objective is None:
            return

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "exchange_objective", "objective": data},
        )

    # Receive message from room group
    async def exchange_objective(self, event):
        objective: str = event["objective"]

        # Send message to WebSocket
        await self.send(text_data=objective)

    @database_sync_to_async
    def complete_todo(
        self, todo_id: str, objective_id: str, completed: bool, user_id: str = None
    ) -> Tuple[EventObjective, str]:
        if user_id:
            user = User.objects.get(pk=user_id)
        else:
            user = self.scope["user"]

        if user.is_authenticated:
            obj = EventObjective.objects.get(pk=objective_id)
            todo = obj.todos.get(pk=todo_id)
            todo.completed = completed
            todo.save()
        else:
            obj = None

        return obj, json.dumps(
            obj and EventObjectiveSerializer(obj).data, default=json_converter
        )

    @database_sync_to_async
    def delete_todo(
        self, todo_id: str, objective_id: str, user_id: str = None
    ) -> Tuple[EventObjective, str]:
        if user_id:
            user = User.objects.get(pk=user_id)
        else:
            user = self.scope["user"]

        if user.is_authenticated:
            obj = EventObjective.objects.get(pk=objective_id)
            obj.todos.filter(pk=todo_id).delete()
        else:
            obj = None

        return obj, json.dumps(
            obj and EventObjectiveSerializer(obj).data, default=json_converter
        )

    @database_sync_to_async
    def serializes_messages(self, event: Event) -> str:
        return json.dumps(
            EventObjectiveSerializer(event.objective).data,
            default=json_converter,
        )

    @database_sync_to_async
    def save_objective(
        self, content: str, objective_id: str, user_id=None
    ) -> Tuple[EventMessage, str]:
        # Assume 'request.user' is the sender. Adjust according to your authentication setup.
        if user_id:
            user = User.objects.get(pk=user_id)
        else:
            user = self.scope["user"]

        if user.is_authenticated:
            obj = EventObjective.objects.get(pk=objective_id)
            Todo.objects.create(content=content, event_objective=obj)
        else:
            obj = None

        return obj, json.dumps(
            obj and EventObjectiveSerializer(obj).data, default=json_converter
        )

    @database_sync_to_async
    def get_event(self) -> Tuple[EventRoom, Event]:
        event = Event.objects.get(pk=self.event_id)
        return event
