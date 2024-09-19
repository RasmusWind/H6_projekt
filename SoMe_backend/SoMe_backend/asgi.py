"""
ASGI config for SoMe_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SoMe_backend.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.security.websocket import OriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter, get_default_application
from channels.auth import AuthMiddlewareStack
import API.routing
#application = get_default_application()
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': OriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                API.routing.websocket_urlpatterns
            )
        ),
        ['*']
    )
})
