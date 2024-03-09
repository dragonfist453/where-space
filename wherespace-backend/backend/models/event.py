from django.db import models

from .mixins import UUIDMixin
from .space import Booking


class Event(UUIDMixin, models.Model):
    name = models.CharField(max_length=1024)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="events",
        default=None,
        null=True,
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_attendees = models.PositiveIntegerField()
