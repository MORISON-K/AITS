from rest_framework import permissions
from .models import User, Department, Issue

class IsStudent(permissions.BasePermission):
    """
    Allows access only to authenticated users with role 'student'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'student'
        )

class IsLecturer(permissions.BasePermission):
    """
    Allows access only to authenticated users with role 'lecturer'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'lecturer'
        )

class IsRegistrar(permissions.BasePermission):
    """
    Allows access only to authenticated users with role 'registrar'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'registrar'
        )

class IsAdministrator(permissions.BasePermission):
    """
    Allows access only to authenticated users with role 'admin'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an Issue to edit it.
    Assumes the Issue instance has an attribute 'student' representing the submitter.
    """
    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.student == request.user

class CanAssignIssue(permissions.BasePermission):
    """
    Allows only lecturers or administrators to assign or manage an Issue.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['lecturer', 'admin']
        )

