from django.urls import path, include

from . import consumers
from .restful.router import generate_restful_router, generate_schema

websocket_urlpatterns = [
    path("ws/event_room/<uuid:event_id>/", consumers.ChatConsumer.as_asgi()),
    path("ws/objective/<uuid:event_id>/", consumers.ObjectiveConsumer.as_asgi()),
]

urlpatterns = [
    path("", include(generate_restful_router().urls)),
    path("api-auth/", include("rest_framework.urls")),
    path("schema/", generate_schema()),
]
