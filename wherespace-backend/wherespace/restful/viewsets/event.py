from django.apps import apps
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..serializers.event import EventSerializer

Event = apps.get_model("backend", "Event")


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=False, methods=["get"])
    def all(self, _):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

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
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def make(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def attend(self, request, event_uuid):
        event = get_object_or_404(Event, id=event_uuid)
        user = request.user

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
        permission_classes=[permissions.IsAuthenticated],
    )
    def unattend(self, request, event_uuid):
        event = get_object_or_404(Event, id=event_uuid)
        user = request.user

        if not event.attendees.filter(id=user.id).exists():
            return Response(
                {"detail": "Not attending event."}, status=status.HTTP_400_BAD_REQUEST
            )

        if event.host == user:
            return Response(
                {"detail": "Host cannot unattend event."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event.attendees.remove(user)
        event.save()

        return Response(
            {"detail": "Successfully unattended event."}, status=status.HTTP_200_OK
        )