from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
       #Create and return a regular user with the given username, email, and password. 
        if not username:
            raise ValueError("The Username field must be set")
        if not password:
            raise ValueError("The Password field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        # Create and return a superuser with the given username, email, and password.
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'academic registrar')  # Default role for superusers

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('academic registrar', 'Academic Registrar'),
    ]
  
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='student')
    groups = models.ManyToManyField('auth.Group', related_name='ait_users_groups', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='ait_users_permissions', blank=True)
    objects = CustomUserManager()  # Attach the custom manager

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    faculty = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Issue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    ISSUE_CATEGORIES = [
        ('missing_marks', 'Missing marks'),
        ('incorrect_grades', 'Incorrect grades'),
        ('remarking', 'Remarking'),
        ('test_alert', 'Test alert'),
        ('other', 'Other'),
    ]
    category = models.CharField(max_length=100, choices=ISSUE_CATEGORIES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submitted_issues", limit_choices_to={'role': 'student'})
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_issues", limit_choices_to={'role__in': ('lecturer', 'academic registrar')})
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Issue {self.id}: {self.category} - {self.status}" 