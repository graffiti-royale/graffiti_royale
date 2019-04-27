"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""

import os
import django
from channels.routing import get_default_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "graffiti_royale.settings")
os.environ['ASGI_THREADS']="4"
django.setup()
application = get_default_application()
