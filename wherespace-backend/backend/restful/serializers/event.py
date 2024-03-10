from django.apps import apps
from rest_framework import serializers

from .space import BookingSerializer
from .user import UserSerializer

Event = apps.get_model("backend", "Event")
EventObjective = apps.get_model("backend", "EventObjective")
User = apps.get_model("backend", "User")
Todo = apps.get_model("backend", "Todo")


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["id", "content", "completed", "event_objective"]
        read_only_fields = ["id"]


class EventObjectiveSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, required=False)

    class Meta:
        model = EventObjective
        fields = ["id", "goal_text", "todos"]
        read_only_fields = ["id"]


class EventSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(required=False, allow_null=True)
    attendees = UserSerializer(many=True, required=False, allow_null=True)
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    objective = EventObjectiveSerializer(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "booking",
            "start_time",
            "end_time",
            "max_attendees",
            "attendees",
            "host",
            "objective",
            "summary",
        ]
