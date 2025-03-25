from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, Department, Issue, College, Programme, IssueUpdate, Course, Notification, School

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                  'role', 'role_id', 'college', 'department', 'programme']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data.get('username', validated_data['email']),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'student'),
            role_id=validated_data.get('role_id'),
            college=validated_data.get('college'),
            department=validated_data.get('department'),
            programme=validated_data.get('programme')
        )
        return user

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class IssueUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueUpdate
        fields = ['id', 'issue', 'user', 'comment', 'created_at']
        read_only_fields = ['created_at']

class IssueSerializer(serializers.ModelSerializer):
    updates = IssueUpdateSerializer(many=True, read_only=True, source='updated')
    
    class Meta:
        model = Issue
        fields = ['id', 'category', 'description', 'status', 'student', 
                  'course', 'assigned_to', 'created_at', 'updated_at', 'updates']
        read_only_fields = ['created_at', 'updated_at']

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name'] 

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School              
        fields = ['id', 'name', 'college'] 

class ProgrammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ['id', 'code', 'name', 'department']  

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course 
        fields = ['id', 'code', 'name', 'department']  

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'issue', 'message', 'is_read', 'created_at']
        read_only_fields = ['created_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 
                  'role', 'role_id', 'college', 'department', 'programme']
    
    def validate(self, data):
        # Check if passwords match
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Ensure required fields based on role
        if data.get('role') == 'student':
            if not data.get('programme'):
                raise serializers.ValidationError({"programme": "Programme is required for students."})
            if not data.get('college'):
                raise serializers.ValidationError({"college": "College is required for students."})
        
        if data.get('role') == 'lecturer' and not data.get('department'):
            raise serializers.ValidationError({"department": "Department is required for lecturers."})
            
        return data
    
    def create(self, validated_data):
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        
        # Create the user using the user manager
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data.get('username', validated_data['email']),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'student'),
            role_id=validated_data.get('role_id'),
            college=validated_data.get('college'),
            department=validated_data.get('department'),
            programme=validated_data.get('programme')
        )
        return user
