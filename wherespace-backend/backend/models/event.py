from django.db import models

from .mixins import UUIDMixin
from .space import Space


class Event(UUIDMixin, models.Model):
    id = models.UUIDField(primary_key=True)
    space = models.ForeignKey(
        Space, on_delete=models.CASCADE, related_name="events", default=None, null=True
    )
