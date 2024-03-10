from django.apps import apps
from rest_framework import serializers

from .space import BookingSerializer
from .user import UserSerializer

Event = apps.get_model("backend", "Event")
EventObjective = apps.get_model("backend", "EventObjective")
User = apps.get_model("backend", "User")
Todo = apps.get_model("backend", "Todo")


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["id", "content", "completed", "event_objective"]
        read_only_fields = ["id"]


class EventObjectiveSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, required=False)

    class Meta:
        model = EventObjective
        fields = ["id", "goal_text", "todos"]
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        print(validated_data)

        instance.goal_text = validated_data.get("goal_text", instance.goal_text)
        update_todos = validated_data.get("todos", [])
        instance.todos.exclude(
            id__in=[id_val for todo in update_todos if (id_val := todo.get("id", None))]
        ).delete()

        for todo in update_todos:
            if todo.get("id", None) is None:
                Todo.objects.create(
                    content=todo["content"],
                    completed=todo.get("completed", False),
                    event_objective=instance,
                )
            else:
                todo_instance = Todo.objects.get(pk=todo["id"])
                todo_instance.content = todo.get("content", todo_instance.content)
                todo_instance.completed = todo.get("completed", todo_instance.completed)
                todo_instance.save()

        instance.save()

        return instance


class EventSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(required=False, allow_null=True)
    attendees = UserSerializer(many=True, required=False, allow_null=True)
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    objective = EventObjectiveSerializer(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "booking",
            "start_time",
            "end_time",
            "max_attendees",
            "attendees",
            "host",
            "objective",
            "summary",
        ]
