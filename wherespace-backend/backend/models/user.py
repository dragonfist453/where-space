from django.contrib.auth.models import AbstractUser
from django.db import models


class UserPrivacy(models.Model):
    id = models.UUIDField(primary_key=True)
    is_looking_for_peers = models.BooleanField(default=False)

    @staticmethod
    def default_privacy():
        return UserPrivacy.objects.create(is_looking_for_peers=False).id


class User(AbstractUser):
    id = models.UUIDField(primary_key=True)
    # TODO: privacy default
    privacy = models.OneToOneField(UserPrivacy, on_delete=models.CASCADE, related_name="user")
