from django.apps import apps
from rest_framework import serializers

Event = apps.get_model("backend", "Event")


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "space"]
