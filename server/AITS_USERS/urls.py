from django.urls import path
from . import views


urlpatterns = [
    path('user/', views.user, name = 'user_list'),
    path('department/', views.department, name = 'department_list'),
    path('issue/', views.issue, name = 'issue_list')
]

