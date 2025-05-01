from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q
from .models import (
    UserProfile, Issue, Comment, Notification, IssueHistory,
    College, Department, Programme, Course,
    ROLE_CHOICES, STATUS_CHOICES, YEAR_CHOICES, SEMESTER_CHOICES, ISSUE_CATEGORY_CHOICES
)
from .serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    IssueSerializer, CommentSerializer, NotificationSerializer,
    IssueHistorySerializer, CollegeSerializer, DepartmentSerializer,
    ProgrammeSerializer, CourseSerializer, YearSerializer, SemesterSerializer,
    IssueCategorySerializer
)

class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow administrators to access the view
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'admin'

class IsFacultyUser(permissions.BasePermission):
    """
    Permission to only allow faculty members to access the view
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'faculty'

class IsStudentUser(permissions.BasePermission):
    """
    Permission to only allow students to access the view
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'student'

class UserRegistrationView(generics.CreateAPIView):
    """
    API view for user registration
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API view for retrieving and updating user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile

class IssueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Issue model
    """
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Filter issues based on user role
        if hasattr(user, 'profile'):
            role = user.profile.role
            
            if role == 'admin':
                # Admins can see all issues
                return Issue.objects.all().order_by('-created_at')
            elif role == 'faculty':
                # Faculty can see issues assigned to them
                return Issue.objects.filter(assigned_to=user).order_by('-created_at')
            else:  # student
                # Students can only see issues they created
                return Issue.objects.filter(created_by=user).order_by('-created_at')
        
        return Issue.objects.none()
    
    def perform_create(self, serializer):
        # When a new issue is created, save it and create a notification for admins
        issue = serializer.save()
        
        # Create notifications for administrators
        admin_profiles = UserProfile.objects.filter(role='admin')
        for profile in admin_profiles:
            Notification.objects.create(
                user=profile.user,
                issue=issue,
                message=f"New issue reported: {issue.title}"
            )
    
    def perform_update(self, serializer):
        # Get the issue before update
        issue = self.get_object()
        old_status = issue.status
        old_assigned_to = issue.assigned_to
        
        # Update the issue
        updated_issue = serializer.save()
        
        # Check if status changed
        if old_status != updated_issue.status:
            # Create issue history entry
            IssueHistory.objects.create(
                issue=updated_issue,
                changed_by=self.request.user,
                previous_status=old_status,
                new_status=updated_issue.status,
                comment=f"Status changed from {old_status} to {updated_issue.status}"
            )
            
            # Create notification for issue creator
            Notification.objects.create(
                user=updated_issue.created_by,
                issue=updated_issue,
                message=f"Your issue '{updated_issue.title}' status changed to {updated_issue.status}"
            )
        
        # Check if assigned user changed
        if old_assigned_to != updated_issue.assigned_to and updated_issue.assigned_to is not None:
            # Create notification for newly assigned user
            Notification.objects.create(
                user=updated_issue.assigned_to,
                issue=updated_issue,
                message=f"You have been assigned to the issue: {updated_issue.title}"
            )
    
    @action(detail=False, methods=['get'], url_path='assigned')
    def assigned(self, request):
        """
        Get issues assigned to the current user
        """
        user = request.user
        issues = Issue.objects.filter(assigned_to=user).order_by('-created_at')
        serializer = self.get_serializer(issues, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'], url_path='history')
    def history(self, request):
        """
        Get issue history for the current user based on their role
        """
        user = request.user
        if hasattr(user, 'profile'):
            role = user.profile.role
            
            if role == 'admin':
                # Admins can see all issues
                issues = Issue.objects.all().order_by('-updated_at')[:20]  # Limit to recent 20
            elif role == 'faculty':
                # Faculty can see issues assigned to them
                issues = Issue.objects.filter(assigned_to=user).order_by('-updated_at')[:20]
            else:  # student
                # Students can only see issues they created
                issues = Issue.objects.filter(created_by=user).order_by('-updated_at')[:20]
                
            serializer = self.get_serializer(issues, many=True)
            return Response(serializer.data)
            
        return Response([], status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        issue = self.get_object()
        
        # Only assigned faculty or admin can resolve issues
        if request.user.profile.role not in ['faculty', 'admin'] or (issue.assigned_to != request.user and request.user.profile.role != 'admin'):
            return Response(
                {"detail": "You do not have permission to resolve this issue."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update issue status
        old_status = issue.status
        issue.status = 'resolved'
        issue.save()
        
        # Create issue history entry
        IssueHistory.objects.create(
            issue=issue,
            changed_by=request.user,
            previous_status=old_status,
            new_status='resolved',
            comment="Issue marked as resolved"
        )
        
        # Create notification for issue creator
        Notification.objects.create(
            user=issue.created_by,
            issue=issue,
            message=f"Your issue '{issue.title}' has been resolved"
        )
        
        return Response({"status": "Issue resolved successfully"}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Comment model
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filter comments by issue ID if provided in query params
        issue_id = self.request.query_params.get('issue', None)
        if issue_id:
            return Comment.objects.filter(issue_id=issue_id).order_by('-created_at')
        
        # Otherwise, return comments for issues the user has access to
        user = self.request.user
        if hasattr(user, 'profile'):
            role = user.profile.role
            
            if role == 'admin':
                return Comment.objects.all().order_by('-created_at')
            elif role == 'faculty':
                return Comment.objects.filter(
                    Q(issue__assigned_to=user) | Q(user=user)
                ).order_by('-created_at')
            else:  # student
                return Comment.objects.filter(
                    Q(issue__created_by=user) | Q(user=user)
                ).order_by('-created_at')
        
        return Comment.objects.none()
    
    def perform_create(self, serializer):
        comment = serializer.save()
        issue = comment.issue
        
        # Create notification for all involved users (except commenter)
        involved_users = set()
        if issue.created_by != self.request.user:
            involved_users.add(issue.created_by)
        if issue.assigned_to and issue.assigned_to != self.request.user:
            involved_users.add(issue.assigned_to)
        
        for user in involved_users:
            Notification.objects.create(
                user=user,
                issue=issue,
                message=f"New comment on issue '{issue.title}'"
            )

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Notification model
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return notifications for the current user
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        
        # Ensure user can only mark their own notifications as read
        if notification.user != request.user:
            return Response(
                {"detail": "You do not have permission to modify this notification."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.is_read = True
        notification.save()
        
        return Response({"status": "Notification marked as read"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        # Mark all of the user's notifications as read
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        
        return Response({"status": "All notifications marked as read"}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        Get the count of unread notifications for the current user
        """
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"count": count})

class IssueHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for IssueHistory model
    """
    serializer_class = IssueHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filter by issue ID if provided
        issue_id = self.request.query_params.get('issue', None)
        if issue_id:
            return IssueHistory.objects.filter(issue_id=issue_id).order_by('-timestamp')
        
        # Otherwise, filter based on user role
        user = self.request.user
        if hasattr(user, 'profile'):
            role = user.profile.role
            
            if role == 'admin':
                return IssueHistory.objects.all().order_by('-timestamp')
            elif role == 'faculty':
                return IssueHistory.objects.filter(issue__assigned_to=user).order_by('-timestamp')
            else:  # student
                return IssueHistory.objects.filter(issue__created_by=user).order_by('-timestamp')
        
        return IssueHistory.objects.none()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """
    Get the current authenticated user's information
    """
    user = request.user
    user_data = UserSerializer(user).data
    
    try:
        profile = UserProfile.objects.get(user=user)
        user_data['role'] = profile.role
        user_data['role_id'] = profile.id  # Add the profile ID as role_id
        user_data['department'] = profile.department
        user_data['student_id'] = profile.student_id
    except UserProfile.DoesNotExist:
        user_data['role'] = None
        user_data['role_id'] = None
    
    return Response(user_data)



@api_view(['GET'])
@permission_classes([IsAdminUser | IsFacultyUser])
def get_faculty_members(request):
    """
    Get a list of faculty members
    """
    faculty_profiles = UserProfile.objects.filter(role='faculty')
    faculty_users = [profile.user for profile in faculty_profiles]
    serializer = UserSerializer(faculty_users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_system_info(request):
    """
    Get system information like available roles and issue statuses
    """
    role_choices = [{"value": value, "label": label} for value, label in ROLE_CHOICES]
    status_choices = [{"value": value, "label": label} for value, label in STATUS_CHOICES]
    
    return Response({
        "roles": role_choices,
        "statuses": status_choices,
        "priorities": [
            {"value": "low", "label": "Low"},
            {"value": "medium", "label": "Medium"},
            {"value": "high", "label": "High"},
            {"value": "urgent", "label": "Urgent"}
        ],
        "categories": [
            "Course Registration",
            "Grade Appeal",
            "Technical Issue",
            "Financial Aid",
            "Exam Schedule",
            "Course Content",
            "Advisor Question",
            "Other"
        ]
    })

class CollegeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for College model
    """
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view colleges

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Department model
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view departments
    
    def get_queryset(self):
        """
        Optionally filter departments by college
        """
        queryset = Department.objects.all()
        college_id = self.request.query_params.get('college', None)
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset

class ProgrammeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Programme model
    """
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view programmes
    
    def get_queryset(self):
        """
        Optionally filter programmes by department or college
        """
        queryset = Programme.objects.all()
        department_id = self.request.query_params.get('department', None)
        college_id = self.request.query_params.get('college', None)
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        elif college_id:
            queryset = queryset.filter(department__college_id=college_id)
            
        return queryset

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Course model
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Optionally filter courses by programme, semester, or year
        """
        queryset = Course.objects.all()
        programme_id = self.request.query_params.get('programme', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        
        if programme_id:
            queryset = queryset.filter(programme_id=programme_id)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year_of_study=year)
            
        return queryset

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_years(request):
    """
    Get a list of available academic years
    """
    year_data = [
        {"value": year_value, "display": year_label} 
        for year_value, year_label in YEAR_CHOICES
    ]
    return Response(year_data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_semesters(request):
    """
    Get a list of available academic semesters
    """
    semester_data = [
        {"value": sem_value, "display": sem_label} 
        for sem_value, sem_label in SEMESTER_CHOICES
    ]
    return Response(semester_data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_issue_categories(request):
    """
    Get a list of available issue categories
    """
    category_data = [
        {"value": cat_value, "display": cat_label} 
        for cat_value, cat_label in ISSUE_CATEGORY_CHOICES
    ]
    return Response(category_data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_issues(request):
    """
    Get a list of issues created by the current user
    """
    issues = Issue.objects.filter(created_by=request.user).order_by('-created_at')
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_unread_notification_count(request):
    """
    Get the count of unread notifications for the current user
    """
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({"count": count})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_notifications(request):
    """
    Get notifications for the current user
    """
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """
    Mark a notification as read
    """
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({"status": "success"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """
    Mark all notifications as read for the current user
    """
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"status": "success"})
