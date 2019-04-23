from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe
from .models import Room, Profile
import json
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import random

ROOM_CAP = 5

# Chooses a random word from our Words.csv file
def get_random_word():
    with open("Words.csv") as word_list:
        lines = [line.strip() for line in word_list]
    return random.choice(lines).lower()


# Create your views here.

def homepage(request):
    return render(request, 'homepage.html', context={})

def tutorial(request):
    return render(request, 'tutorial.html', context={})

def play(request, username):
    user = get_object_or_404(User, username=username)
    room, _ = Room.objects.get_or_create(full=False)
    random_word = get_random_word()

    room.users.add(user)
    if room.users.count() > ROOM_CAP-1:
        room.full=True
    room.save()

    return render(request, 'play.html', context = {
        "username": username,
        "roompk": room.pk,
        "random_word": random_word,
        "ROOM_CAP": ROOM_CAP
        })
    
def make_guest(request):
    return render(request, 'make_guest.html', context={})

def check_guest_name(request):
    data = json.loads(request.body)
    user, created = User.objects.get_or_create(username=data['username'])

    if created:
        user.profile.guest = True
        user.profile.save()
        return JsonResponse({"url": f"play/{user.username}"})
    return JsonResponse({"message": 'Username already in use.'})

def get_serviceworker(request):
    return render(request, 'sw.js', content_type='application/javascript', context={})
