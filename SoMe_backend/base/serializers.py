from . import models
from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField
from django.contrib.auth.models import User


class ExtendedUserSerializer(ModelSerializer):
    class Meta:
        model = models.ExtendedUser
        fields = ("image",)

class UserSerializer(ModelSerializer):
    has_pending_friend_request = SerializerMethodField()
    has_friend_requests = SerializerMethodField()
    extendeduser = ExtendedUserSerializer()

    def get_has_pending_friend_request(self, obj):
        try:
            return obj.has_pending_friend_request
        except:
            return None
    
    def get_has_friend_requests(self, obj):
        try:
            return obj.extendeduser.has_friend_requests
        except:
            return None

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'is_staff', 'has_pending_friend_request', 'has_friend_requests', 'extendeduser')


class PostSerializer(ModelSerializer):
    comment_amount = IntegerField(
        source='comments.count', 
        read_only=True
    )
    author = UserSerializer()

    class Meta:
        model = models.Post
        fields = ("text","author","created_date","edited_date","public","comment_amount")


class CreatePostSerializer(ModelSerializer):
    class Meta:
        model = models.Post
        fields = ("text", "author","public")


class CommentSerializer(ModelSerializer):
    class Meta:
        model = models.Comment
        fields = '__all__'


class FriendshipRequestSerializer(ModelSerializer):
    class Meta:
        models = models.FriendshipRequest
        fields = '__all__'