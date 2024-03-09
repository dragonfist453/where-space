from django.db import models

from .mixins import UUIDMixin
from .user import User


class SpaceType(models.TextChoices):
    QUITE = "QUITE", "Quite"
    BUSY = "BUSY", "Busy"
    MEETING = "MEETING", "Meeting"


class Space(UUIDMixin, models.Model):
    MAX_RATING = 10

    name = models.CharField(max_length=1024)
    google_map_url = models.URLField()
    image_url = models.URLField()
    description = models.TextField()
    rate = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.CharField(max_length=20, choices=SpaceType.choices)


class Booking(UUIDMixin, models.Model):
    space = models.ForeignKey(
        Space,
        on_delete=models.CASCADE,
        related_name="bookings",
        related_query_name="booking",
        default=None,
        null=True,
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    host = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="host", related_query_name="host"
    )
