from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.goto_swagger_page),
    path('swagger/', views.schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]