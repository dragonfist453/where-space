from django.db import models

from .mixins import UUIDMixin
from .space import Booking
from .user import User


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
    attendees = models.ManyToManyField(
        User, related_name="attends", related_query_name="attend"
    )
    host = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="events",
        related_query_name="event",
    )

    @property
    def is_fully_booked(self):
        return (
            self.attendees.count() >= self.max_attendees - 1
        )  # has to take account of the host
