from django.shortcuts import render

# Create your views here.

def homepage(request):
    return render(request, 'homepage.html', context={})

def tutorial(request):
    return render(request, 'tutorial.html', context={})

def play(request):
    return render(request, 'play.html', context = {})
    