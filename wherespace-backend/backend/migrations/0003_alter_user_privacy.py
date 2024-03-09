# Generated by Django 5.0.3 on 2024-03-09 16:23

import backend.models.user
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0002_alter_user_options_alter_user_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="privacy",
            field=models.OneToOneField(
                default=backend.models.user.UserPrivacy.default_privacy,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user",
                to="backend.userprivacy",
            ),
        ),
    ]
