from django.apps import apps
from rest_framework import serializers

Space = apps.get_model("backend", "Space")
Booking = apps.get_model("backend", "Booking")
User = apps.get_model("backend", "User")


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ["id", "name", "google_map_url", "image_url", "description", "ratings"]
        read_only_fields = ["id"]


class BookingSerializer(serializers.ModelSerializer):
    space = serializers.PrimaryKeyRelatedField(queryset=Space.objects.all())
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Adjust 'required' based on some condition, for example:
        if "request" in self.context and self.context["request"].method == "POST":
            self.fields["host"].required = False

    class Meta:
        model = Booking
        fields = ["id", "space", "start_time", "end_time", "host"]
        read_only_fields = ["id"]
