from django.apps import apps
from rest_framework import serializers

from .space import BookingSerializer
from .user import UserSerializer

Event = apps.get_model("backend", "Event")
User = apps.get_model("backend", "User")


class EventSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(required=False, allow_null=True)
    attendees = UserSerializer(many=True, required=False, allow_null=True)
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

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

    def is_participant(self, user):
        return self.attendees.filter(id=user.id).exists() or self.host == user
