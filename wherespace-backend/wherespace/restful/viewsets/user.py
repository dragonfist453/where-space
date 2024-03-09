from django.apps import apps
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..permissions import IsNotAuthed
from ..serializers.user import UserSerializer

User = apps.get_model("backend", "User")


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = []

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsNotAuthed],
    )
    def register(self):
        if self.request.user.is_authenticated:
            return False

        serializer = UserSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsNotAuthed],
    )
    def login(self, request):
        if request.user.is_authenticated:
            return Response(
                {"detail": "Already logged in."}, status=status.HTTP_400_BAD_REQUEST
            )

        print(request.data)

        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"detail": "Login successful."}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def logout(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Not logged in."}, status=status.HTTP_400_BAD_REQUEST
            )

        logout(request)
        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def me(self, request):
        """
        Get the details of the authenticated user.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
