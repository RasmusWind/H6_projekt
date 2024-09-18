from django.contrib import admin
from .models import ExtendedUser, FriendshipRequest
# Register your models here.

admin.site.register(ExtendedUser)
admin.site.register(FriendshipRequest)