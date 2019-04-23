from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .views import get_random_word

class Room(models.Model):
    users = models.ManyToManyField(User, related_name='room', blank=True)
    name = models.CharField(max_length=50)

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    guest = models.BooleanField(default=False)
<<<<<<< HEAD
    word = models.CharField(max_length=100, null=True)
=======
    color = models.TextField(max_length=10, null=True)
>>>>>>> 5fc2bd9af8e30f40e710c1133e6dd6d1ba656c94

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
