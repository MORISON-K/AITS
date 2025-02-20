from django.contrib import admin

# Register your models here.
from .models import User, Issue,Department

admin.site.register(User)
admin.site.register(Issue)
admin.site.register(Department)