from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import get_object_or_404
from base.models import User, Post, Comment, FriendshipRequest, ExtendedUser
from base.serializers import UserSerializer, PostSerializer, CommentSerializer, FriendshipRequestSerializer
from .views import tokenauth_header
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from drf_yasg.utils import swagger_auto_schema
from rest_framework.authtoken.models import Token

# Dette skal stå før hver api endpoint for sessionauth
#@swagger_auto_schema(
#    method="get",
#    manual_parameters=[tokenauth_header],
#)
#@api_view(["GET"])
#@authentication_classes([SessionAuthentication])
#@permission_classes([IsAuthenticated])



@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def create_user(request):
    user_serializer = UserSerializer(data=request.data)
    username = user_serializer.data.get("username")
    password = user_serializer.data.get("password")
    if ExtendedUser.objects.filter(username=username).exists():
        return Response({"status":"error", "message":"Username already exists."})

    if user_serializer.is_valid():
        user_serializer.save()
        user = user_serializer.instance
        user.set_password(password)
        user.save()
        user_serializer = UserSerializer(instance=user)
        token = Token.objects.create(user=user)
        return Response({"user":user_serializer.data, "token": token.key})
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method="get", manual_parameters=[tokenauth_header])
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_by_token(request):
    user_serializer = UserSerializer(instance=request.user)
    return Response({"status":"success", "user":user_serializer.data})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_public_posts(request):
    posts = Post.objects.filter(public=True)
    post_serializer = PostSerializer(posts, many=True)
    return Response({"status":"success", "posts":post_serializer.data})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_posts(request):
    user = request.user
    friends = ExtendedUser.objects.friends(user)
    posts = Post.objects.filter(author__in=friends)
    post_serializer = PostSerializer(posts, many=True)
    return Response({"status":"success", "posts":post_serializer.data})