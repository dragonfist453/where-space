from django.apps import apps
from rest_framework import serializers

User = apps.get_model("backend", "User")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "privacy",
            "email",
            "username",
            "first_name",
            "last_name",
            # "interests",
            "profile_picture_url",
        ]
        read_only_fields = ["id"]

        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
