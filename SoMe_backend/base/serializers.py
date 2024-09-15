from . import models
from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    has_pending_friend_request = SerializerMethodField()

    def get_has_pending_friend_request(self, obj):
        try:
            return obj.has_pending_friend_request
        except:
            return None

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'is_staff', 'has_pending_friend_request')


class PostSerializer(ModelSerializer):
    comment_amount = IntegerField(
        source='comments.count', 
        read_only=True
    )
    author = UserSerializer()

    class Meta:
        model = models.Post
        fields = ("text","author","created_date","edited_date","public","comment_amount")


class CommentSerializer(ModelSerializer):
    class Meta:
        model = models.Comment
        fields = '__all__'


class FriendshipRequestSerializer(ModelSerializer):
    class Meta:
        models = models.FriendshipRequest
        fields = '__all__'