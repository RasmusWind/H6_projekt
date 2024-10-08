from django.db import models
from django.db.models import Q, QuerySet
from django.contrib.auth.models import User, UserManager


# Man skal kunne sende venneanmodninger, disse skal gemmes indtil de bliver accepteret eller afvist
class FriendshipRequest(models.Model):
    from_user = models.ForeignKey(User, related_name="sentfriendrequests", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="receivedfriendrequests", on_delete=models.CASCADE)

    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)


# I denne manager gør jeg det muligt at få fat i de
class ExtendedUserManager(UserManager):

    def friends(self, user) -> QuerySet:
        friends = []
        friendships = Friendship.objects.filter(Q(A=user)|Q(B=user)).select_related("A", "B")
        for friendship in friendships:
            if friendship.A != user:
                friends.append(friendship.A.pk)
            else:
                friends.append(friendship.B.pk)
        friends = User.objects.filter(pk__in=friends)
        return friends
    
    # -1 = bad, 0 = good, 1 = different good
    def add_friend(self, from_user, to_user):

        if FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user, rejected=False):
            return -1
        
        existing_friend_request_to_me = FriendshipRequest.objects.filter(to_user=from_user, from_user=to_user, rejected=False).first()
        if existing_friend_request_to_me:
            self.accept_friend_request(existing_friend_request_to_me)
            return 1
        
        FriendshipRequest.objects.create(from_user=from_user, to_user=to_user)
        return 0

    def remove_friend(self, from_user, to_user):
        friendship = Friendship.objects.filter(Q(A=from_user, B=to_user)|Q(A=to_user, B=from_user)).first()
        if friendship:
            friendship.delete()

    def accept_friend_request(self, friend_request:FriendshipRequest):
        Friendship.objects.get_or_create(A=friend_request.from_user, B=friend_request.to_user)
        friend_request.delete()

    def reject_friend_request(self, friend_request:FriendshipRequest):
        friend_request.delete()

    def remove_friend_request(self, from_user, to_user):
        friend_request = FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user).first()
        if friend_request:
            friend_request.delete()


# Django har allerede en defineret bruger tabel, så den vælger jeg bare at udvide.
class ExtendedUser(models.Model):
    objects = ExtendedUserManager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Billeder bliver gemt i "media" folderen, men her bestemmer jeg at den skal bruge "media/user_images"
    image = models.ImageField(null=True, blank=True, upload_to="user_images")
    
    @property
    def has_friend_requests(self):
        return FriendshipRequest.objects.filter(to_user=self.user).exists()


# Friendships følger lige nu formularen: 
# F = N * (N - 1)
# For at være mere optimal burde man bruge denne:
# F = (N * (N - 1)) / 2
# Grunden til at man bruger den første er fordi lige nu er venskabet A + B ikke det samme som B + A
class Friendship(models.Model):
    A = models.ForeignKey(User, on_delete=models.CASCADE, related_name="A_friendships")
    B = models.ForeignKey(User, on_delete=models.CASCADE, related_name="B_friendships")
    

class Post(models.Model):
    text = models.TextField(max_length=1024, null=False, blank=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    created_date = models.DateTimeField(auto_now_add=True)
    edited_date = models.DateTimeField(auto_now=True)
    public = models.BooleanField(default=False)


class Comment(models.Model):
    post = models.ForeignKey("base.Post", on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="comments")
    text = models.TextField(max_length=512, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    edited_date = models.DateTimeField(auto_now=True)