from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe
import json
from django.contrib.auth.models import User
from django.http import JsonResponse

# Create your views here.

def homepage(request):
    return render(request, 'homepage.html', context={})

def tutorial(request):
    return render(request, 'tutorial.html', context={})

def play(request, username):
    print(username)
    return render(request, 'play.html', context = {"username": username})
    
def make_guest(request):
    return render(request, 'make_guest.html', context={})

def check_guest_name(request):
    data = json.loads(request.body)
    try:
        User.objects.get(username=data['username'])
        return JsonResponse({"message": 'Username already in use.'})
    except:
        return JsonResponse({"url": f"play/{data['username']}"})

def get_javascript_file(request, )
