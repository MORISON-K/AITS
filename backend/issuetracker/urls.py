from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'issues', views.IssueViewSet, basename='issue')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'issuehistory', views.IssueHistoryViewSet, basename='issuehistory')

# Add the new viewsets for colleges, departments, programmes, and courses
router.register(r'colleges', views.CollegeViewSet, basename='college')
router.register(r'departments', views.DepartmentViewSet, basename='department')
router.register(r'programmes', views.ProgrammeViewSet, basename='programme')
router.register(r'courses', views.CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('current-user/', views.get_current_user, name='current-user'),
    path('faculty-members/', views.get_faculty_members, name='faculty-members'),
    path('auth/faculty-members/', views.get_faculty_members, name='auth-faculty-members'),  # Additional path for existing API calls
    path('system-info/', views.get_system_info, name='system-info'),
    # Add URL patterns for the new endpoints
    path('years/', views.get_years, name='years'),
    path('semesters/', views.get_semesters, name='semesters'),
    path('issue-categories/', views.get_issue_categories, name='issue-categories'),
    path('my-issues/', views.get_my_issues, name='my-issues'),
    path('notifications/unread-count/', views.get_unread_notification_count, name='unread-notification-count'),
    path('notifications/unread_count/', views.get_unread_notification_count, name='unread_notification_count'),
    path('notifications/', views.get_user_notifications, name='user-notifications'),
    path('user-notifications/', views.get_user_notifications, name='user-notifications-alt'),
    path('notifications/mark-read/<int:notification_id>/', views.mark_notification_read, name='mark-notification-read'),
    path('notifications/mark-notification-read/<int:notification_id>/', views.mark_notification_read, name='mark-notification-read-alt'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark-all-notifications-read'),
    path('notifications/mark-all-notifications-read/', views.mark_all_notifications_read, name='mark-all-notifications-read-alt'),
]
