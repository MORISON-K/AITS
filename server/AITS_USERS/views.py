from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Issue, Department
from .serializers import UserSerializer,IssueSerializer, DepartmentSerializer, CustomTokenObtainPairSerializer

class IsStudent(permissions.BasePermission):
    """ Allows access only to authenticated users with role 'student'. """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

        refresh = RefreshToken.for_user(serializer.validated_data['user'])
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': serializer.validated_data['user'].id,
            'username': serializer.validated_data['user'].username,
            'email': serializer.validated_data['user'].email,
            'role': serializer.validated_data['user'].role,
        }

        return Response(data, status=200)

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class IsLecturer(permissions.BasePermission):
    """ Allows access only to authenticated users with role 'lecturer'. """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'lecturer'
        )

class IsRegistrar(permissions.BasePermission):
    """ Allows access only to authenticated users with role 'registrar'. """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'registrar'
        )

class IsAdministrator(permissions.BasePermission):
    """ Allows access only to authenticated users with role 'admin'. """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """ Object-level permission to only allow owners of an Issue to edit it.
    Assumes the Issue instance has an attribute 'student' representing the submitter.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.student == request.user

class CanAssignIssue(permissions.BasePermission):
    """ Allows only lecturers or administrators to assign or manage an Issue. """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['lecturer', 'admin']
        )

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdministrator]

class DepartmentList(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdministrator]

class IssueList(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsStudent | IsLecturer | IsRegistrar | IsAdministrator]

class IssueDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsOwnerOrReadOnly | CanAssignIssue]

class AssignIssue(generics.UpdateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [CanAssignIssue]
    fields = ['assigned_to']
