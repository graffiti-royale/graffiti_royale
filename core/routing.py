from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/(?P<roompk>[^/]+)/draw/$', consumers.PlayConsumer),
    url(r'^ws/(?P<roompk>[^/]+)/users/$', consumers.UsersConsumer),
    url(r'^ws/(?P<roompk>[^/]+)/score/$', consumers.ScoreConsumer)
]
