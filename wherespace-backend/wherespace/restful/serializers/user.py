from django.apps import apps
from rest_framework import serializers

User = apps.get_model("backend", "User")


class UserPrivacySerializer(serializers.ModelSerializer):
    class Meta:
        model = "backend.User"
        fields = ["id", "privacy"]
        read_only_fields = ["id"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = "backend.User"
        fields = ["id", "privacy", "email", "username"]
        read_only_fields = ["id"]

        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
