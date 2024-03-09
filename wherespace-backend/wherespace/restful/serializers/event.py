from django.apps import apps
from rest_framework import serializers

from .space import BookingSerializer
from .user import UserSerializer

Event = apps.get_model("backend", "Event")


class EventSerializer(serializers.ModelSerializer):
    booking = BookingSerializer()
    attendees = UserSerializer(many=True)
    host = UserSerializer()

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
        ]
