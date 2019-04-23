from django.conf.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/<pk:roompk>/draw/', consumers.PlayConsumer),
    path('ws/<pk:roompk>/users/', consumers.UsersConsumer)
]
