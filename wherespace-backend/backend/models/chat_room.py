from django.db import models

from .mixins import UUIDMixin


class _Message(UUIDMixin, models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ["created_at"]


class EventMessage(_Message):
    room = models.ForeignKey(
        "EventRoom",
        on_delete=models.CASCADE,
        related_name="event_messages",
        related_query_name="event_message",
    )
    sender = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="event_messages",
        related_query_name="event_message",
    )


class EventRoom(UUIDMixin, models.Model):
    event = models.OneToOneField(
        "Event",
        on_delete=models.CASCADE,
        related_name="chat_room",
        related_query_name="chat_room",
    )


class PrivateMessage(_Message):
    chat = models.ForeignKey(
        "PrivateChat",
        on_delete=models.CASCADE,
        related_name="private_messages",
        related_query_name="private_message",
    )

    sender = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="private_messages",
        related_query_name="private_message",
    )


class PrivateChat(UUIDMixin, models.Model):
    from_user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="from_private_chats",
        related_query_name="private_chats",
    )
    to_user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="to_private_chats",
        related_query_name="private_chats",
    )
