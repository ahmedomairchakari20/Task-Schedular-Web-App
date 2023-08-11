from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.utils import timezone

#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, email, username, password=None):
      if not email:
          raise ValueError('User must have an email address')
      if not username:
          raise ValueError('User must have an username')

      user = self.model(
          email=self.normalize_email(email),
          username=username,
      )
      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, name, password=None):
      user = self.create_user(
          email,
          password=password,
          name=name,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
  # email, username, name, occupation, age
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  username = models.CharField(max_length=50)

  name = models.CharField(max_length=200)
  occupation = models.CharField(max_length=200)
  age = models.IntegerField(null=True)
  notify=models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  feedback=models.CharField(max_length=500, null=True)
  support=models.CharField(max_length=500, null=True)

  objects = UserManager()

  USERNAME_FIELD = 'email'  # the default to login
  REQUIRED_FIELDS = ['username',]

  def __str__(self):
      return self.email


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    date = models.DateField(auto_created=True)
    time = models.TimeField(auto_created=True)
    color = models.CharField(default="#ffffff", max_length=10)
    image = models.ImageField(upload_to='task_images/', blank=True, null=True) 
    remind_me = models.BooleanField(default=False)
    recurring_task = models.BooleanField(default=False)
    remind_me_date = models.JSONField(default=list)
    recurring_task_date = models.JSONField(default=list)
    is_complete = models.BooleanField(default=False)
    complete_date = models.CharField(max_length=100, null=True)
    complete_percentage = models.IntegerField(default=0)
    start_datetime = models.DateTimeField(null=True)
    is_started = models.BooleanField(default=False)
    parent_task = models.IntegerField(null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reminded=models.BooleanField(default=False)
    def __str__(self):
        return self.title  
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    forget_password_token = models.CharField(max_length=100)
    name = models.CharField(max_length=200, default='n/a')  # Set default value here
    occupation = models.CharField(max_length=200,default='n/a')
    age = models.IntegerField(null=True)
    media = models.ImageField(upload_to='profile_images/', default='')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email
