from . import models
from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField, FileField
from django.contrib.auth.models import User


class ExtendedUserSerializer(ModelSerializer):
    #image = FileField()
    class Meta:
        model = models.ExtendedUser
        fields = ("image",)

class UserSerializer(ModelSerializer):
    friends = SerializerMethodField()
    has_pending_friend_request = SerializerMethodField()
    is_friend = SerializerMethodField()
    has_friend_requests = SerializerMethodField()
    extendeduser = ExtendedUserSerializer()

    def get_friends(self, obj):
        try:
            return list(models.ExtendedUser.objects.friends(obj).values_list("pk", flat=True))
        except:
            return None

    def get_has_pending_friend_request(self, obj):
        try:
            return obj.has_pending_friend_request
        except:
            return None
        
    def get_is_friend(self, obj):
        try:
            return obj.is_friend
        except:
            return None
    
    def get_has_friend_requests(self, obj):
        try:
            return obj.extendeduser.has_friend_requests
        except:
            return None

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'is_staff', 'has_pending_friend_request', 'has_friend_requests', 'is_friend', 'extendeduser', 'friends')


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