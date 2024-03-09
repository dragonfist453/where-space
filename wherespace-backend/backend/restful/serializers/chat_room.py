from django.apps import apps
from rest_framework import serializers

EventMessage = apps.get_model("backend", "EventMessage")
EventRoom = apps.get_model("backend", "EventRoom")
Event = apps.get_model("backend", "Event")
User = apps.get_model("backend", "User")


class EventMessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = EventMessage
        exclude = ["room"]


class EventRoomSerializer(serializers.ModelSerializer):
    event_messages = EventMessageSerializer(many=True)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = EventRoom
        fields = "__all__"
