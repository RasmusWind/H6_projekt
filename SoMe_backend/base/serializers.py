from . import models
from rest_framework.serializers import ModelSerializer, IntegerField


class UserSerializer(ModelSerializer):
    class Meta:
        model = models.ExtendedUser
        fields = ('first_name', 'last_name', 'is_staff')


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