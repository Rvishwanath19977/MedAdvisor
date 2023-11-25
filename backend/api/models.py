from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    has_filled_pre_medical_form = models.BooleanField(default=False)

    @property
    def is_doctor(self):
        return self.role == 'doctor'


class PreMedicalForm(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    patient = models.ForeignKey(User, related_name='pre_medical_forms', on_delete=models.CASCADE)
    symptoms = models.TextField(blank=True)
    form_filled_by_doctor = models.BooleanField(default=False)
    age = models.PositiveIntegerField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    disorders_diagnosed = models.TextField(blank=True)

    prediction = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"PreMedicalForm for {self.patient.username}"

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(default=None)
    pre_medical_form = models.ForeignKey(PreMedicalForm, on_delete=models.CASCADE, related_name='blog_posts', null=True, blank=True)

class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    commenter_role = models.CharField(max_length=20, default='patient')