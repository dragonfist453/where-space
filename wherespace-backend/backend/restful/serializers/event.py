from django.apps import apps
from rest_framework import serializers

from .space import BookingSerializer
from .user import UserSerializer

Event = apps.get_model("backend", "Event")
EventObjective = apps.get_model("backend", "EventObjective")
User = apps.get_model("backend", "User")


class EventObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventObjective
        fields = ["id", "goal_text", "todo_list"]
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
        ]
