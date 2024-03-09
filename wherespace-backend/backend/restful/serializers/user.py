from django.apps import apps
from rest_framework import serializers

User = apps.get_model("backend", "User")
UserPrivacy = apps.get_model("backend", "UserPrivacy")


class UserPrivacySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacy
        fields = ["id", "is_looking_for_peers"]
        read_only_fields = ["id"]


class UserSerializer(serializers.ModelSerializer):
    privacy = UserPrivacySerializer()

    class Meta:
        model = User
        fields = ["id", "privacy", "email", "username"]
        read_only_fields = ["id"]

        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
