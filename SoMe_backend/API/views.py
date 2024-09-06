from django.http import HttpResponseRedirect
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions, status
from rest_framework.views import APIView, Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import get_object_or_404
from base import models
from base import serializers
from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token

tokenauth_header = openapi.Parameter(
    "Authorization",
    openapi.IN_HEADER,
    description="Format: 'Token {token}'",
    type=openapi.IN_HEADER,
)

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


class SessionAuthenticationPost(APIView):
    permission_classes = (AllowAny, )
    authentication_classes = ()

    def post(self, request):
        user = get_object_or_404(models.ExtendedUser, username=request.data.get("username"))
        if not user.check_password(request.data.get("password")):
            return Response({"user":None, "token":None}, status=status.HTTP_404_NOT_FOUND)
        user_serializer = serializers.UserSerializer(instance=user)
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if not user:
            raise ValidationError('user could not be authenticated')
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user":user_serializer.data, "token": token.key})


class SessionAuthenticationGet(APIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        user_serializer = serializers.UserSerializer(instance=request.user)
        token, _ = Token.objects.get_or_create(user=request.user)
        return Response({"user":user_serializer.data, "token": token.key})


class TokenAuthenticate(APIView):
    permission_classes = (AllowAny, )
    authentication_classes = ()

    def post(self, request):
        user = get_object_or_404(models.ExtendedUser, username=request.data.get("username"))
        if not user.check_password(request.data.get("password")):
            return Response({"user":None, "token":None}, status=status.HTTP_404_NOT_FOUND)
        user_serializer = serializers.UserSerializer(instance=user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user":user_serializer.data, "token": token.key})
    
