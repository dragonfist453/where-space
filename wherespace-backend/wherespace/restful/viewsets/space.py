from django.apps import apps
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..serializers.space import SpaceSerializer, BookingSerializer

Space = apps.get_model("backend", "Space")
Booking = apps.get_model("backend", "Booking")


class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAdminUser],
    )
    def register(self, request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def rate(self, request, pk):
        pass


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Assuming the 'host' is the authenticated user making the request
        serializer.save(host=self.request.user)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def book(self, request):
        context = {"request": request}
        serializer = self.get_serializer(data=request.data, context=context)
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
    def unbook(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        if booking.host != request.user:
            return Response(
                {"detail": "You are not the host of this booking."},
                status=status.HTTP_403_FORBIDDEN,
            )
        booking.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def check_in(self, request, pk):
        pass

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def check_out(self, request, pk):
        pass
