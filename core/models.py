from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .views import get_random_word
import random

class Room(models.Model):
    users = models.ManyToManyField(User, related_name='room', blank=True)
    name = models.CharField(max_length=50)

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    guest = models.BooleanField(default=False)
    word = models.CharField(max_length=100, null=True)
    color = models.TextField(max_length=10, null=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
