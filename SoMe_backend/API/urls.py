from django.urls import path, re_path
from . import views, endpoints

urlpatterns = [
    path('', views.goto_swagger_page),
    path('sessionauthenticate', views.SessionAuthenticationPost.as_view()),
    path('tokenauthenticate', views.TokenAuthenticate.as_view()),
    path('signup', endpoints.create_user),
    path('swagger/', views.schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]