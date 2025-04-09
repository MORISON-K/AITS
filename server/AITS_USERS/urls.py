from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import SendEmailView



router = DefaultRouter()
router.register(r'colleges', views.CollegeViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'programmes', views.ProgrammeViewSet)


urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/user/', views.UserDetailView.as_view(), name='user_details'),
    path('', include(router.urls)),
    path('send-email/', SendEmailView.as_view(), name='send-email'),
    path('years/', views.YearOptionsView.as_view(), name='year-options'),
    path('semesters/', views.SemesterOptionsView.as_view(), name='semester-options'),  
    path('courses/', views.CourseListView.as_view(), name='courses-list'),  
    path('departments/filtered/', views.DepartmentListView.as_view(), name='department-filtered'),
    path('programmes/filtered/', views.ProgrammeListView.as_view(), name='programme-filtered'),
]
