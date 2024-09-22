from . import models
from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField, FileField
from django.contrib.auth.models import User
from API.consumers import ONLINE

class ExtendedUserSerializer(ModelSerializer):
    #image = FileField()
    class Meta:
        model = models.ExtendedUser
        fields = ("image",)

class UserSerializer(ModelSerializer):
    is_online = SerializerMethodField()
    friends = SerializerMethodField()
    extendeduser = ExtendedUserSerializer(required=False)

    def get_is_online(self, obj):
        try:
            return obj.id in ONLINE
        except:
            return False

    def get_friends(self, obj):
        try:
            return list(models.ExtendedUser.objects.friends(obj).values_list("pk", flat=True))
        except:
            return None


    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'is_staff', 'extendeduser', 'friends', 'is_online')


class PostSerializer(ModelSerializer):
    comment_amount = IntegerField(
        source='comments.count', 
        read_only=True
    )
    author = UserSerializer()

    class Meta:
        model = models.Post
        fields = ("id","text","author","created_date","edited_date","public","comment_amount")


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