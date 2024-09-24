from django.test import TestCase
from base.models import ExtendedUser, FriendshipRequest, Friendship
from django.contrib.auth.models import User
from django.db.models import QuerySet
from . import views
import requests

class SessionLoginTest(TestCase):
    def test_sessionlogin(self):
        data = {"username":"raller", "password":"Pass1234!"}
        response = requests.post("http://127.0.0.1:8000/sessionLogin", data)
        response = response.json()
        self.assertEqual(response.get("status"), "success")


class ExtendedUserManagerTest(TestCase):
    def test_create_users(self):
        data = {"username":"raller", "password":"Pass1234!", "email":"raller@test.dk", "first_name":"raller", "last_name":"test"}
        response = requests.post("http://127.0.0.1:8000/signup", data)
        response = response.json()
        status = response.get("status")
        message = response.get("message")
        if status and status == "error" and message and message == "Username already exists.":
            self.assertTrue(True)
        else:
            self.assertTrue(response.get("user") != None)
        
        data = {"username":"raller2", "password":"Pass1234!", "email":"raller2@test.dk", "first_name":"raller2", "last_name":"test"}
        response = requests.post("http://127.0.0.1:8000/signup", data)
        response = response.json()
        status = response.get("status")
        message = response.get("message")
        if status and status == "error" and message and message == "Username already exists.":
            self.assertTrue(True)
        else:
            self.assertTrue(response.get("user") != None)

    def test_get_friends(self):
        user = User.objects.filter(username="raller").first()
        friends = ExtendedUser.objects.friends(user)
        self.assertTrue(isinstance(friends, QuerySet))

    def test_send_and_reject_friendrequests(self):
        User.objects.create(username="raller", password="Test1234!")
        User.objects.create(username="raller2", password="Test1234!")

        from_user = User.objects.get(username="raller")
        to_user = User.objects.get(username="raller2")

        ExtendedUser.objects.add_friend(from_user, to_user)
        request = FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user).first()
        self.assertTrue(isinstance(request, FriendshipRequest))

        ExtendedUser.objects.reject_friend_request(request)
        request = FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user).first()
        self.assertTrue(request is None)

        ExtendedUser.objects.add_friend(from_user, to_user)
        request = FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user).first()
        ExtendedUser.objects.accept_friend_request(request)

        to_user_friends = ExtendedUser.objects.friends(to_user)
        from_user_friends = ExtendedUser.objects.friends(from_user)

        self.assertTrue(to_user in from_user_friends)
        self.assertTrue(from_user in to_user_friends)

