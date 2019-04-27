from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe
from .models import Room
import json
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import close_old_connections
import random, time
import datetime

ROOM_CAP = 2

# Chooses a random word from our Words.csv file
def get_random_word():
    with open("Words.csv") as word_list:
        lines = [line.strip() for line in word_list]
    return random.choice(lines).lower()

def get_number_of_rounds(initial_player_count):
    if initial_player_count <= 5:
        return 1
    if initial_player_count <= 10:
        return 2
    if initial_player_count <= 20:
        return 3
    if initial_player_count <= 40:
        return 4
    if initial_player_count <= 80:
        return 5
    return 6

# Create your views here.

def homepage(request):
    return render(request, 'homepage.html', context={})

def tutorial(request):
    return render(request, 'tutorial.html', context={})

def waiting_room(request, roompk, username):
    username = username
    close_old_connections()
    room = Room.objects.get(pk=roompk)
    word = get_random_word()
    colors_list = ['#FF6633', '#FFB399', '#FF33FF', '#00B3E6', '#3366E6',
    '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900',
    '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#FF1A66',
    '#E6331A', '#33FFCC', '#66994D', '#B366CC', '#4D8000',
    '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF',
    '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999',
    '#00E680', '#4D8066', '#809980', '#1AFF33', '#FF3380',
    '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380',
    '#FF4D4D', '#99E6E6', '#6666FF']
    color = random.choice(colors_list)

    if room.JSON:
        room.JSON += f', "{username}": '+'{"word": '+f'"{word}", "color": "{color}", "paths": [], "score": 0'+"}"
    else:
        room.JSON = f'"{username}": '+'{"word": '+f'"{word}", "color": "{color}", "paths": [], "score": 0'+"}"
    room.users += 1
    if room.users > ROOM_CAP-1:
        room.full=True
    print(room.JSON)
    room.save()
    print(room.JSON)
    full = room.full
    timer = int(time.mktime(room.createdAt.timetuple())) * 1000
    close_old_connections()

    return render(request, 'waiting_room.html', context = {
        "full": full,
        "roompk": roompk,
        "JSON": room.JSON,
        "time": timer,
        "username": username,
        "ROOM_CAP": ROOM_CAP
    })

def play(request, roompk, username):
    close_old_connections()
    room = get_object_or_404(Room, pk=roompk)
    room_data = "{"+room.JSON+"}"
    room.full = True
    if room.gameStart is None:
        room.gameStart = datetime.datetime.utcnow()
        room.save()
    start = int(time.mktime(room.gameStart.timetuple())) * 1000
    return render(request, 'play.html', context = {"room_data":room_data, "roompk":roompk, "start": start})
    
def make_guest(request):
    return render(request, 'make_guest.html', context={})

def check_guest_name(request):
    data = json.loads(request.body)
    username = data['username']
    room, _ = Room.objects.get_or_create(full=False)
    if username not in room.JSON:
        return JsonResponse({"url": f"waiting-room/{room.pk}/{data['username']}"})
    return JsonResponse({"message": 'Username already in use.'})

def get_serviceworker(request):
    return render(request, 'sw.js', content_type='application/javascript', context={})
