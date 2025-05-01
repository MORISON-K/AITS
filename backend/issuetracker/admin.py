from django.contrib import admin
from .models import UserProfile, Issue, Comment, Notification, IssueHistory

# Register models for admin interface
admin.site.register(UserProfile)
admin.site.register(Issue)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(IssueHistory)
