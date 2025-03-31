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



        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
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
