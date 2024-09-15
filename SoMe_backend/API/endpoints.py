from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import get_object_or_404
from base.models import User, Post, Comment, FriendshipRequest, ExtendedUser
from django.contrib.auth.models import User
from base.serializers import UserSerializer, PostSerializer, CommentSerializer, FriendshipRequestSerializer
from .views import tokenauth_header
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from drf_yasg.utils import swagger_auto_schema
from rest_framework.authtoken.models import Token
import json
from django.db.models import Exists, OuterRef

# Dette skal stå før hver api endpoint for sessionauth
#@swagger_auto_schema(
#    method="get",
#    manual_parameters=[tokenauth_header],
#)
#@api_view(["GET"])
#@authentication_classes([SessionAuthentication])
#@permission_classes([IsAuthenticated])



@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def create_user(request):
    user_serializer = UserSerializer(data=request.data)
    username = user_serializer.data.get("username")
    password = user_serializer.data.get("password")
    if User.objects.filter(user__username=username).exists():
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


# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search_users(request):
    try:
        # filter_dict = json.loads(request.query_params.get("filter"))
        users = User.objects.all().annotate(
            has_pending_friend_request=Exists(FriendshipRequest.objects.filter(from_user=request.user, to_user_id=OuterRef('pk')))
        )
        

        user_serializer = UserSerializer(users, many=True)

        return Response({"status": "success", "users":user_serializer.data})
    except Exception:
        return Response({"status": "error", "message": "Invalid filter", "users": None})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_all_posts(request):
    posts = Post.objects.all()
    post_serializer = PostSerializer(posts, many=True)
    return Response({"status":"success", "posts":post_serializer.data})


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


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request):
    friends = ExtendedUser.objects.friends(request.user)
    user_serializer = UserSerializer(friends, many=True)
    return Response({"status": "success", "friends":user_serializer.data})


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    to_user_id = request.data.get("to_user_id")
    to_user = User.objects.filter(pk=to_user_id).first()
    if to_user:
        ExtendedUser.objects.add_friend(request.user, to_user)
        return Response({"status": "success"})
    return Response({"status": "error", "message": "User not found"})


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    friend_request_id = request.data.get("friend_request_id")
    friend_request = FriendshipRequest.objects.filter(pk=friend_request_id)
    if friend_request:
        ExtendedUser.objects.accept_friend_request(friend_request)
        return Response({"status":"success"})
    return Response({"status":"error", "message":"Friend request not found"})