from django.db import models
from django.db.models import Q, QuerySet
from django.contrib.auth.models import User, UserManager


# Man skal kunne sende venneanmodninger, disse skal gemmes indtil de bliver accepteret eller afvist
class FriendshipRequest(models.Model):
    from_user = models.ForeignKey("base.ExtendedUser", related_name="sentfriendrequests", on_delete=models.CASCADE)
    to_user = models.ForeignKey("base.ExtendedUser", related_name="receivedfriendrequests", on_delete=models.CASCADE)

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
        friends = ExtendedUser.objects.filter(pk__in=friends)
        return friends
    
    def add_friend(self, from_user, to_user):
        if FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise Exception("Friend request already exists.")
        if FriendshipRequest.objects.filter(to_user=from_user, from_user=to_user).exists():
            raise Exception("Friend request already exists.")
        
        FriendshipRequest.objects.create(from_user=from_user, to_user=to_user)

    def accept_friend_request(self, friend_request:FriendshipRequest):
        Friendship.objects.get_or_create(A=friend_request.from_user, B=friend_request.to_user)

    def reject_friend_request(self, friend_request:FriendshipRequest):
        friend_request.rejected = True
        friend_request.save()


# Django har allerede en defineret bruger tabel, så den vælger jeg bare at udvide.
class ExtendedUser(User):
    objects = ExtendedUserManager()
    # Billeder bliver gemt i "media" folderen, men her bestemmer jeg at den skal bruge "media/user_images"
    image = models.ImageField(null=True, blank=True, upload_to="user_images")



# Friendships følger lige nu formularen: 
# F = N * (N - 1)
# For at være mere optimal burde man bruge denne:
# F = (N * (N - 1)) / 2
# Grunden til at man bruger den første er fordi lige nu er venskabet A + B ikke det samme som B + A
class Friendship(models.Model):
    A = models.ForeignKey("base.ExtendedUser", on_delete=models.CASCADE, related_name="A_friendships")
    B = models.ForeignKey("base.ExtendedUser", on_delete=models.CASCADE, related_name="B_friendships")
    
