# Generated by Django 5.0.3 on 2024-03-09 20:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0008_eventroom_eventmessage_privatechat_privatemessage"),
    ]

    operations = [
        migrations.RenameField(
            model_name="eventmessage",
            old_name="event",
            new_name="room",
        ),
    ]
