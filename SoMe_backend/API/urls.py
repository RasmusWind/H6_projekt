from django.urls import path, re_path
from . import views, endpoints

urlpatterns = [
    path('', views.goto_swagger_page),
    path('sessionLogin', views.SessionAuthenticationLogin.as_view()),
    path('tokenLogin', views.TokenAuthenticationLogin.as_view()),
    path('sessionGetUser', views.SessionAuthenticationGetUser.as_view()),
    path('tokenGetUser', views.TokenAuthenticationGetUser.as_view()),
    path('signup', endpoints.create_user),

    path('search_users', endpoints.search_users),
    path('create_post', endpoints.create_post),
    path('send_friend_request', endpoints.send_friend_request),
    path('remove_friend_request', endpoints.remove_friend_request),
    path('get_friends', endpoints.get_friends),
    path('get_public_posts', endpoints.get_public_posts),

    path('swagger/', views.schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]