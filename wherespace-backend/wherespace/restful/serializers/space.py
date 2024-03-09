from rest_framework import serializers


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = "backend.Space"
        fields = ["id", "name", "google_map_url"]
        read_only_fields = ["id"]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = "backend.Booking"
        fields = ["id", "space", "start_time", "end_time", "host", "attendees"]
        read_only_fields = ["id"]
