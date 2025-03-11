from django.urls import path
from . import views

urlspatterns = [
    path ('register/',views.register,name='register'),
]
