from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/(?P<roompk>[^/]+)/draw/$', consumers.PlayConsumer),
    url(r'^ws/(?P<roompk>[^/]+)/start/$', consumers.StartConsumer),
    url(r'^ws/(?P<roompk>[^/]+)/score/$', consumers.ScoreConsumer)
]
