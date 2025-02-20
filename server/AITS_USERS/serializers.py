from rest_framework import serializers
from .models import User, Department, Issue

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())


    class Meta:
        model = Issue
        fields = '__all__'
