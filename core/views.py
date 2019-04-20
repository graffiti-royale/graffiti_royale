from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe
import json
from django.contrib.auth.models import User
from django.http import JsonResponse
import random

# Chooses a random word from our Words.csv file
def get_random_word():
    with open("Words.csv") as word_list:
        lines = [line for line in word_list]
    return random.choice(lines).lower()


# Create your views here.

def homepage(request):
    return render(request, 'homepage.html', context={})

def tutorial(request):
    return render(request, 'tutorial.html', context={})

def play(request, username):
    print(username)
    random_word = get_random_word()
    return render(request, 'play.html', context = 
    {"username": username,
    "random_word": random_word,
    })
    
def make_guest(request):
    return render(request, 'make_guest.html', context={})

def check_guest_name(request):
    data = json.loads(request.body)
    try:
        User.objects.get(username=data['username'])
        return JsonResponse({"message": 'Username already in use.'})
    except:
        return JsonResponse({"url": f"play/{data['username']}"})
