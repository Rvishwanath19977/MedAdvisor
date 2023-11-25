from rest_framework import serializers
from .models import User, PreMedicalForm, BlogPost, Comment


class PreMedicalFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreMedicalForm
        fields = ['id', 'patient', 'symptoms', 'form_filled_by_doctor', 'age', 'country', 'gender', 'disorders_diagnosed', 'prediction']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'has_filled_pre_medical_form']