from django.contrib import admin

# Register your models here.
from .models import User, Issues,Departments

admin.site.register(User)
admin.site.register(Issues)
admin.site.register(Departments)