from rest_framework import serializers


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = "backend.Event"
        fields = ["id", "space"]
