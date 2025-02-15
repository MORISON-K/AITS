from django.db import models

# Create your models here.
class User(models.Model):
    Student_ID =models.AutoField(primary_key=True) 
    name       =models.CharField(max_length= 100)
    email      =models.EmailField()
    role       =models.CharField(max_length= 100)

class Issues(models.Model):
    Issue_ID    = models.AutoField(primary_key=True)
    Category    = models.CharField(max_length= 100)
    Description = models.TextField()
    Status      = models.CharField(max_length=100)
    Assigned_To = models.CharField(max_length=100)

class Departments(models.Model):
    ID      =  models.AutoField(primary_key=True)
    Name    =  models.CharField(max_length= 100)
    Faculty =  models.CharField(max_length=100)


    
    

        




    