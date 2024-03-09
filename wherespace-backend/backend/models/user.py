from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from .mixins import UUIDMixin


class UserPrivacy(UUIDMixin, models.Model):
    is_looking_for_peers = models.BooleanField(default=False)
    user = models.OneToOneField(
        "User",
        on_delete=models.CASCADE,
        related_name="privacy",
        related_query_name="privacy",
    )


def default_privacy():
    return UserPrivacy.objects.create(is_looking_for_peers=False).id


class User(UUIDMixin, AbstractUser):
    pass


@receiver(post_save, sender=User)
def create_user_privacy(sender, instance, created, **kwargs):
    if created:
        UserPrivacy.objects.create(user=instance)
