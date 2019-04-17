from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    users = models.ManyToManyField(User, related_name='room', blank=True)
    name = models.CharField(max_length=50)
