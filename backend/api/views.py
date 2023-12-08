from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, PreMedicalFormSerializer, BlogPostSerializer, CommentSerializer
from .models import User, PreMedicalForm, BlogPost, Comment
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer
from rest_framework import generics
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
# ========================================================================================
from django.http import JsonResponse
import joblib
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def index(request):
    data = {'message': 'Welcome to the backend API for your React application'}
    return Response(data)

@api_view(['POST'])
def register(request):
    data = request.data
    serializer = UserSerializer(data=data)
    role = data.get('role')

    if serializer.is_valid():
        user = serializer.save()
        user.set_password(data['password'])
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True

        user.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.id, 'message': 'User registered successfully'}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def login_view(request):
    data = request.data
    user = authenticate(request, username=data['username'], password=data['password'])

    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user) 
        return Response({'token': token.key, 'user_id': user.id, 'message': 'Login successful'}, status=200)
    return Response({'message': 'Invalid credentials'}, status=401)

@api_view(['GET'])
def user_details(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fill_pre_medical_form(request):
    data = request.data
    data['patient'] = request.user.id

    serializer = PreMedicalFormSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        request.user.has_filled_pre_medical_form = True
        request.user.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pre_medical_form(request):
    user = request.user
    if user.role == 'doctor' or 'patient':
        forms = PreMedicalForm.objects.filter(form_filled_by_doctor=False)
        serializer = PreMedicalFormSerializer(forms, many=True)
        return Response(serializer.data)
    return Response({'detail': 'You do not have permission to access this page.'}, status=403)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def reply_to_pre_medical_form(request, form_id):
    form = PreMedicalForm.objects.get(pk=form_id)
    if request.user.role == 'doctor' and not form.form_filled_by_doctor:
        form.form_filled_by_doctor = True
        form.save()
        return Response({'message': 'Form has been replied to successfully.'})
    return Response({'detail': 'You do not have permission to reply to this form.'}, status=403)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_blog_post(request):
    user = request.user
    pre_medical_form = PreMedicalForm.objects.filter(patient=user).first()
    if pre_medical_form:
        data = request.data
        data['author'] = user.id
        serializer = BlogPostSerializer(data=data)
        if serializer.is_valid():
            blog_post = serializer.save(pre_medical_form=pre_medical_form)
            send_blog_post_notification_email(blog_post, serializer)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    else:
        return Response({'message': 'Please fill out a PreMedicalForm before creating a BlogPost.'}, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    data = request.data
    data['author'] = request.user.id
    data['commenter_role'] = 'doctor' if request.user.is_doctor else 'patient'
    data['receiver'] = data.get('receiver', None) 
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        comment = serializer.save()
        if data['commenter_role'] == 'doctor':
            send_comment_notification_email(comment, serializer)

        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

def send_comment_notification_email(comment, serializer):
    subject = 'New Comment on Your Blog'
    message = f'Hi {comment.blog_post.author.username},\n\nYou have a new comment on your blog post "{comment.blog_post.title}".\n\nComment: {comment.content}'
    from_email = 'med_advisor@outlook.com'
    to_email = [comment.blog_post.author.email]
    try:
        print(f"Attempting to send email to: {to_email}")
        send_mail(subject, message, from_email, to_email, fail_silently=False)
        print("Email sent successfully.")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error sending email: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

def send_blog_post_notification_email(blog_post, serializer):
    subject = 'New Comment on Your Blog'

    # Accessing BlogPost information
    blog_post_info = f'Title: "{blog_post.title}".\n\nContent: {blog_post.content}'

    # Accessing associated PreMedicalForm information
    pre_medical_form_info = ''
    if blog_post.pre_medical_form:
        pre_medical_form_info = f'\n\nPreMedicalForm Information:\n' \
                                f'Symptoms: {blog_post.pre_medical_form.symptoms}\n' \
                                f'Age: {blog_post.pre_medical_form.age}\n' \
                                f'Country: {blog_post.pre_medical_form.country}\n' \
                                f'Gender: {blog_post.pre_medical_form.gender}\n' \
                                f'Prediction %: {blog_post.pre_medical_form.prediction}\n' \
                                f'Disorders Diagnosed: {blog_post.pre_medical_form.disorders_diagnosed}'

    message = f'Hi {blog_post.author.username},\n\n{blog_post_info}{pre_medical_form_info}'

    from_email = 'med_advisor@outlook.com'
    to_email = [blog_post.author.email]
    try:
        print(f"Attempting to send email to: {to_email}")
        send_mail(subject, message, from_email, to_email, fail_silently=False)
        print("Email sent successfully.")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error sending email: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comments(request, blog_post_id):
    try:
        comments = Comment.objects.filter(blog_post=blog_post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Comment.DoesNotExist:
        return Response({'message': 'Comments not found for the given blog post.'}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_comments(request):
    try:
        # Get the list of blog post IDs from the query parameters
        blog_post_ids = request.GET.getlist('blog_post_ids', [])
        
        comments = Comment.objects.filter(blog_post__in=blog_post_ids)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Comment.DoesNotExist:
        return Response({'message': 'Comments not found for the given blog post(s).' }, status=404)
    
@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def promote_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user.role = 'admin'
        user.save()
        return Response({'message': 'User promoted successfully'})
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)
    
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BlogPostDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

class PreMedicalFormDeleteView(generics.DestroyAPIView):
    queryset = PreMedicalForm.objects.all()
    serializer_class = PreMedicalFormSerializer

class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
