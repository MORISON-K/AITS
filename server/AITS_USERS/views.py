from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserSerializer, DepartmentSerializer,ProgrammeSerializer,CollegeSerializer, IssueSerializer, IssueUpdateSerializer, CourseSerializer, NotificationSerializer, SchoolSerializer
from .models import User, Department, Issue, College, Programme, IssueUpdate, Course, Notification, School

User = get_user_model()

class CustomTokenObtainSerializer(TokenObtainPairSerializer):
      def validate(self, attrs):
        credentials = {'password': attrs.get("password")}

        # Allow login with username or email
        try:
            validate_email(attrs.get("username"))
            credentials['email'] = attrs.get("username")
        except ValidationError:
            credentials['username'] = attrs.get("username")

        user = authenticate(**credentials) 
        if not user:
            raise AuthenticationFailed("Invalid login credentials")

        self.user = user  #  Assign user

        data = {}
        refresh = self.get_token(self.user)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['role'] = self.user.role
        return data



class CustomTokenObtainPairView(TokenObtainPairView):
    """
    This view authenticates the user and returns a pair of access and refresh JWT tokens.
    You can customize the serializer if you need to add extra data in the token response.
    """
    # If customization is needed, define a custom serializer_class here.
    serializer_class = CustomTokenObtainSerializer

class RegisterView(generics.CreateAPIView):
    """
    Registers a new user.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()



class LogoutView(APIView):
    """
    Logs out the user by blacklisting their refresh token.
    Ensure that your settings and installed apps are configured to support token blacklisting.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Requires 'rest_framework_simplejwt.token_blacklist' to be in INSTALLED_APPS.
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieves or updates the authenticated user's details.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [permissions.AllowAny]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    permission_classes = [permissions.AllowAny]