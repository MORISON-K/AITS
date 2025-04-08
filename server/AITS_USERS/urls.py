from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import SendEmailView



# Create a router for automatic URL routing for viewsets (like CollegeViewSet, etc.
router = DefaultRouter()
router.register(r'colleges', views.CollegeViewSet)  # /colleges/
router.register(r'departments', views.DepartmentViewSet) # /departments/
router.register(r'programmes', views.ProgrammeViewSet) # /programmes/

# Main URL patterns for the app
urlpatterns = [
     # User authentication routes
    path('auth/register/', views.RegisterView.as_view(), name='register'), # Register new user
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),  # Login (JWT token)
    path('auth/logout/', views.LogoutView.as_view(), name='logout'), # Logout (blacklist token)
    path('auth/user/', views.UserDetailView.as_view(), name='user_details'), # Get or update current user 
    
    # Include automatically generated URLs for viewsets (colleges, departments, programmes)
    path('', include(router.urls)),
    path('send-email/', SendEmailView.as_view(), name='send-email'),
]
