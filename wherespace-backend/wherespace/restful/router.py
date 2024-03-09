from rest_framework import routers

from .viewsets.event import EventViewSet
from .viewsets.user import UserViewSet

__all__ = ["generate_restful_router"]


def generate_restful_router() -> routers.BaseRouter:
    router = routers.SimpleRouter()
    router.register(r"users", UserViewSet, "users")
    router.register(r"events", EventViewSet, "events")

    return router
