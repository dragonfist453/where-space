from django.apps import apps
from rest_framework import serializers

from .user import UserSerializer

Rating = apps.get_model("backend", "Rating")
Space = apps.get_model("backend", "Space")
Booking = apps.get_model("backend", "Booking")


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Rating
        fields = ["id", "user", "rating"]
        read_only_fields = ["id"]


class SpaceSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True)

    class Meta:
        model = Space
        fields = ["id", "name", "google_map_url", "image_url", "description", "ratings"]
        read_only_fields = ["id"]


class BookingSerializer(serializers.ModelSerializer):
    space = SpaceSerializer()
    host = UserSerializer()

    class Meta:
        model = Booking
        fields = ["id", "space", "start_time", "end_time", "host"]
        read_only_fields = ["id"]
