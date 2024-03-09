from django.apps import apps
from rest_framework import serializers

Space = apps.get_model("backend", "Space")
Booking = apps.get_model("backend", "Booking")


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ["id", "name", "google_map_url"]
        read_only_fields = ["id"]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "space", "start_time", "end_time", "host", "attendees"]
        read_only_fields = ["id"]
