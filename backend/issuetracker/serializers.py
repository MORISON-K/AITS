from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Issue, Comment, Notification, IssueHistory, College, Department, Programme, Course, ISSUE_CATEGORY_CHOICES, YEAR_CHOICES, SEMESTER_CHOICES

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role', 'department', 'student_id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    department = serializers.CharField(write_only=True, required=False, allow_blank=True)
    student_id = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'department', 'student_id']
    
    def create(self, validated_data):
        role = validated_data.pop('role')
        department = validated_data.pop('department', None)
        student_id = validated_data.pop('student_id', None)
        
        user = User.objects.create_user(**validated_data)
        
        UserProfile.objects.create(
            user=user,
            role=role,
            department=department,
            student_id=student_id
        )
        
        return user



class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'issue', 'user', 'user_username', 'content', 'created_at']
        read_only_fields = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class IssueSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'created_by', 'created_by_username',
            'assigned_to', 'assigned_to_username', 'status', 'category',
            'priority', 'created_at', 'updated_at', 'comments'
        ]
        read_only_fields = ['created_by']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    issue_title = serializers.CharField(source='issue.title', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'issue', 'issue_title', 'message', 'is_read', 'created_at']
        read_only_fields = ['user', 'issue', 'message', 'created_at']


class IssueHistorySerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(source='changed_by.username', read_only=True)
    
    class Meta:
        model = IssueHistory
        fields = [
            'id', 'issue', 'changed_by', 'changed_by_username',
            'previous_status', 'new_status', 'comment', 'timestamp'
        ]
        read_only_fields = ['changed_by']
    
    def create(self, validated_data):
        validated_data['changed_by'] = self.context['request'].user
        return super().create(validated_data)


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'code', 'description']


class DepartmentSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'college', 'college_name', 'description']


class ProgrammeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Programme
        fields = ['id', 'name', 'code', 'department', 'department_name', 'description', 'level']

class CourseSerializer(serializers.ModelSerializer):
    programme_name = serializers.CharField(source='programme.name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'description', 'programme', 'programme_name', 'semester', 'year_of_study']

class IssueCategorySerializer(serializers.Serializer):
    value = serializers.CharField()
    display = serializers.CharField()

class YearSerializer(serializers.Serializer):
    value = serializers.CharField()
    display = serializers.CharField()
    
class SemesterSerializer(serializers.Serializer):
    value = serializers.CharField()
    display = serializers.CharField()
