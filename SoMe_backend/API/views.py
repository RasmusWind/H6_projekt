from django.shortcuts import render
from django.http import HttpResponseRedirect
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="H6_SoMe_Projekt API",
      default_version='v1',
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

def goto_swagger_page(request):
    return HttpResponseRedirect("/swagger")