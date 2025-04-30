from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Define the user roles
ROLE_CHOICES = (
    ('student', 'Student'),
    ('faculty', 'Faculty'),
    ('admin', 'Administrator'),
)

# Define the issue status options
STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('assigned', 'Assigned'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ('closed', 'Closed'),
)

# Years of study
YEAR_CHOICES = [
    ('1', 'First Year'),
    ('2', 'Second Year'),
    ('3', 'Third Year'),
    ('4', 'Fourth Year'),
    ('5', 'Fifth Year'),
]

# Semester choices
SEMESTER_CHOICES = [
    ('1', 'First Semester'),
    ('2', 'Second Semester'),
]

# Issue categories
ISSUE_CATEGORY_CHOICES = [
    ('grade_dispute', 'Grade Dispute'),
    ('course_material', 'Course Material Issue'),
    ('attendance', 'Attendance Issue'),
    ('exam_schedule', 'Exam Schedule Conflict'),
    ('registration', 'Registration Problem'),
    ('technical', 'Technical Issue'),
    ('other', 'Other'),
]

class College(models.Model):
    """
    Model for academic colleges
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    """
    Model for academic departments
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Programme(models.Model):
    """
    Model for academic programmes
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='programmes')
    description = models.TextField(blank=True, null=True)
    level = models.CharField(max_length=50, blank=True, null=True)  # e.g., Undergraduate, Graduate

    def __str__(self):
        return f"{self.name} ({self.code})"

class UserProfile(models.Model):
    """
    Extension of the User model to include additional information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    department = models.CharField(max_length=100, blank=True, null=True)
    student_id = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Issue(models.Model):
    """
    Model for storing academic issues
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_issues')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    category = models.CharField(max_length=100)
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    """
    Model for storing comments on issues
    """
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.issue.title}"

class Notification(models.Model):
    """
    Model for storing notifications
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:30]}..."

class Course(models.Model):
    """
    Model for academic courses
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, related_name='courses')
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    year_of_study = models.CharField(max_length=10, choices=YEAR_CHOICES)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class IssueHistory(models.Model):
    """
    Model for tracking issue history
    """
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='history')
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    previous_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    new_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    comment = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Issue {self.issue.id} changed from {self.previous_status} to {self.new_status}"

# Signal to create notifications when issues are created or updated
@receiver(post_save, sender=Issue)
def create_issue_notifications(sender, instance, created, **kwargs):
    """
    Create notifications when an issue is created or updated
    """
    if created:
        # Notify all faculty members and administrators about the new issue
        faculty_and_admin_profiles = UserProfile.objects.filter(role__in=['faculty', 'admin'])
        for profile in faculty_and_admin_profiles:
            Notification.objects.create(
                user=profile.user,
                issue=instance,
                message=f"New issue submitted: {instance.title}"
            )
    elif instance.status == 'resolved':
        # Notify the student who created the issue when it's resolved
        Notification.objects.create(
            user=instance.created_by,
            issue=instance,
            message=f"Your issue '{instance.title}' has been resolved"
        )
    elif instance.status == 'assigned' and instance.assigned_to:
        # Notify the faculty member when an issue is assigned to them
        Notification.objects.create(
            user=instance.assigned_to,
            issue=instance,
            message=f"You have been assigned to resolve the issue: {instance.title}"
        )
