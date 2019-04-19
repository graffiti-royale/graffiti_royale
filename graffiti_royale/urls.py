"""graffiti_royale URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('registration.backends.default.urls')),
    path('', views.homepage, name='homepage'),
    path('play/<str:username>/', views.play, name='play'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('makeguest/', views.make_guest, name='make_guest'),
    path('checkguestname/', views.check_guest_name, name='check_guest')
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
