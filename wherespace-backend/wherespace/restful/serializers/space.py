from django.apps import apps
from rest_framework import serializers

from .user import UserSerializer

Rating = apps.get_model("backend", "Rating")
Space = apps.get_model("backend", "Space")
Booking = apps.get_model("backend", "Booking")


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ["id", "user", "rating"]
        read_only_fields = ["id"]


class SpaceSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(
        many=True, read_only=True
    )  # TODO: should it be read only?

    class Meta:
        model = Space
        fields = ["id", "name", "google_map_url", "image_url", "description", "ratings"]
        read_only_fields = ["id"]


class BookingSerializer(serializers.ModelSerializer):
    space = SpaceSerializer()
    attendees = UserSerializer(many=True)
    host = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "space", "start_time", "end_time", "host", "attendees"]
        read_only_fields = ["id"]
