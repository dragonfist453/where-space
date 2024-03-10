from django.contrib.auth.models import AbstractUser
from django.db import models

from .mixins import UUIDMixin


# class UserPrivacy(UUIDMixin, models.Model):
#     is_looking_for_peers = models.BooleanField(default=False)
#     user = models.OneToOneField(
#         "User",
#         on_delete=models.CASCADE,
#         related_name="privacy",
#         related_query_name="privacy",
#     )
#

# def default_privacy():
#     return UserPrivacy.objects.create(is_looking_for_peers=False).id


class UserInterests(models.TextChoices):
    ComputerScience = "Computer Science", "Computer Science"
    Mathematics = "Mathematics", "Mathematics"
    Physics = "Physics", "Physics"
    Chemistry = "Chemistry", "Chemistry"
    Biology = "Biology", "Biology"
    Medicine = "Medicine", "Medicine"
    Engineering = "Engineering", "Engineering"
    Business = "Business", "Business"
    Economics = "Economics", "Economics"
    Law = "Law", "Law"
    Politics = "Politics", "Politics"
    History = "History", "History"
    Philosophy = "Philosophy", "Philosophy"
    Psychology = "Psychology", "Psychology"
    Art = "Art", "Art"
    Music = "Music", "Music"
    Literature = "Literature", "Literature"
    Language = "Language", "Language"
    Sports = "Sports", "Sports"
    Cooking = "Cooking", "Cooking"
    Traveling = "Traveling", "Traveling"
    Fashion = "Fashion", "Fashion"
    Movies = "Movies", "Movies"
    Games = "Games", "Games"
    Technology = "Technology", "Technology"
    Science = "Science", "Science"
    Environment = "Environment", "Environment"
    Social = "Social", "Social"


class User(UUIDMixin, AbstractUser):
    # interests = ArrayField(
    #     models.CharField(max_length=512, choices=UserInterests.choices),
    #     default=list,
    # )
    profile_picture_url = models.URLField()
    privacy = models.BooleanField(default=True)


#
# @receiver(post_save, sender=User)
# def create_user_privacy(sender, instance, created, **kwargs):
#     if created:
#         UserPrivacy.objects.create(user=instance)
