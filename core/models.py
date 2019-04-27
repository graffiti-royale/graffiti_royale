from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import datetime

class Room(models.Model):
    users = models.IntegerField(default=0)
    name = models.CharField(max_length=50, default='Room')
    full = models.BooleanField(default=False)
    JSON = models.TextField(max_length=1000, default='')
    createdAt = models.DateTimeField(auto_now_add=True)
    gameStart = models.DateTimeField(null=True)
