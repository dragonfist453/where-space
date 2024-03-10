import django_filters
from django.apps import apps
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..serializers.event import EventSerializer, EventObjectiveSerializer

EventObjective = apps.get_model("backend", "EventObjective")
Event = apps.get_model("backend", "Event")
User = apps.get_model("backend", "User")


class EventFilter(django_filters.FilterSet):
    bounding_box = django_filters.CharFilter(method="filter_bounding_box")

    class Meta:
        model = Event
        fields = ["start_time", "end_time", "bounding_box"]

    def filter_bounding_box(self, queryset, name, value: str):
        east, north, south, west = map(float, value.split(","))

        return queryset.filter(
            booking__space__longitude__gt=west,
            booking__space__longitude__lt=east,
            booking__space__latitude__gt=south,
            booking__space__latitude__lt=north,
        )


class EventObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventObjectiveSerializer
    # permission_classes = [permissions.IsAuthenticated]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event_instance = serializer.save()
        event_instance.attendees.add(self.request.user)
        event_instance.save()

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def hosting(self, request):
        events = Event.objects.filter(host=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def attending(self, request):
        events = Event.objects.filter(attendees=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        # TODO: remove when havel login
        # permission_classes=[permissions.IsAuthenticated],
    )
    def attend(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        user = request.user

        # TODO: remove when havel login
        if user.is_anonymous:
            user = User.objects.get(pk=request.data["user"])

        if event.is_fully_booked:
            return Response(
                {"detail": "Event is fully booked."}, status=status.HTTP_400_BAD_REQUEST
            )

        if event.attendees.filter(id=user.id).exists():
            return Response(
                {"detail": "Already attending event."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event.attendees.add(user)
        event.save()

        return Response(
            {"detail": "Successfully attended event."}, status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
        # TODO: remove when havel login
        # permission_classes=[permissions.IsAuthenticated],
    )
    def unattend(self, request, pk):
        event = get_object_or_404(Event, id=pk)
        user = request.user

        # TODO: remove when havel login
        if user.is_anonymous:
            user = get_object_or_404(User, id=request.data["user"])

        if not event.attendees.filter(id=user.id).exists():
            return Response(
                {"detail": "Not attending event."}, status=status.HTTP_400_BAD_REQUEST
            )

        event.attendees.remove(user)
        event.save()

        return Response(
            {"detail": "Successfully unattended event."}, status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def objective(self, request, pk):
        event = get_object_or_404(Event, id=pk)
        try:
            objective = event.objective
        except Event.objective.RelatedObjectDoesNotExist:
            objective = EventObjective.objects.create(event=event)

        serializer = EventObjectiveSerializer(
            objective, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
