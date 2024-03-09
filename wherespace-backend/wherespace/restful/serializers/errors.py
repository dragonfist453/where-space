from __future__ import annotations

from rest_framework import serializers


class AppError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f"{self.name}: {self.message}"

    @property
    def name(self) -> str:
        return self.__class__.__name__


class ErrorSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    message = serializers.CharField(max_length=1000)

    def create(self, validated_data) -> AppError:
        return globals().get(validated_data.get("name"))(validated_data.get("message"))

    def update(self, instance, validated_data):
        instance.message = validated_data.get("message", instance.message)
        return instance
