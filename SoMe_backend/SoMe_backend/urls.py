from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(
        r"^media/(?P<path>.*)$", serve, kwargs={"document_root": settings.MEDIA_ROOT}
    ),
    # Static
    re_path(
        r"^static/(?P<path>.*)$", serve, kwargs={"document_root": settings.STATIC_ROOT}
    ),
    path('', include('API.urls'))
]
