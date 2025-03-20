from django.urls import path
from .views import user, department, issue 


urlpatterns = [
    path('user/', user, name = 'user_list'),
    path('department/', department, name = 'department_list'),
    path('issue/', issue, name = 'issue_list')
]

