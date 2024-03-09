from rest_framework import routers
from rest_framework.permissions import AllowAny
from rest_framework.renderers import OpenAPIRenderer, CoreJSONRenderer
from rest_framework.schemas import get_schema_view

from .viewsets.event import EventViewSet
from .viewsets.space import SpaceViewSet, BookingViewSet
from .viewsets.user import UserViewSet

__all__ = ["generate_restful_router"]


def generate_restful_router() -> routers.BaseRouter:
    router = routers.SimpleRouter()
    router.register(r"users", UserViewSet, "users")
    router.register(r"events", EventViewSet, "events")
    router.register(r"spaces", SpaceViewSet, "spaces")
    router.register(r"bookings", BookingViewSet, "bookings")

    return router


def generate_schema():
    return get_schema_view(
        title="Your Project API",
        description="API for all things related to your project",
        version="1.0.0",
        renderer_classes=[OpenAPIRenderer, CoreJSONRenderer],
        permission_classes=[AllowAny],
    )
