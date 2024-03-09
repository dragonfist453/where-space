from django.db import models

from .user import User


class Space(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=1024)
    google_map_url = models.URLField()


class Booking(models.Model):
    id = models.UUIDField(primary_key=True)
    space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="bookings", related_query_name="booking",
                              default=None, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    host = models.OneToOneField(User, on_delete=models.CASCADE, related_name="host", related_query_name="host")
    attendees = models.ManyToManyField(User, related_name="attends", related_query_name="attend")
