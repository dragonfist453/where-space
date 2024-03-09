from django.db import models

from .mixins import UUIDMixin
from .user import User


class Rating(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ratings",
        related_query_name="rating",
    )
    rating = models.FloatField()
    space = models.ForeignKey(
        "Space",
        on_delete=models.CASCADE,
        related_name="ratings",
        related_query_name="rating",
    )


class Space(UUIDMixin, models.Model):
    MAX_RATING = 10

    name = models.CharField(max_length=1024)
    google_map_url = models.URLField()
    image_url = models.ImageField()
    description = models.TextField()


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
