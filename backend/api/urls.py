from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login_view'),
    path('user-details/', views.user_details, name='user_details'),
    path('fill-pre-medical-form/', views.fill_pre_medical_form, name='fill_pre_medical_form'),
    path('get-pre-medical-form/', views.get_pre_medical_form, name='get_pre_medical_form'),
    path('reply-to-pre-medical-form/<int:form_id>/', views.reply_to_pre_medical_form, name='reply_to_pre_medical_form'),
    path('create-blog-post/', views.create_blog_post, name='create_blog_post'),
    path('create-comment/', views.create_comment, name='create_comment'),
    path('api/blog-posts/', views.BlogPostListView.as_view(), name='blog-post-list'),
    path('get-comments/<int:blog_post_id>/', views.get_comments, name='get_comments'),
    path('admin-get-comments/', views.admin_get_comments, name='get_comments'),
    path('get-all-users/', views.get_all_users, name='get_all_users'),
    path('promote-user/<int:user_id>/', views.promote_user, name='promote_user'),
    path('delete-user/<int:pk>/', views.UserDeleteView.as_view(), name='delete-user'),
    path('delete-blogpost/<int:pk>/', views.BlogPostDeleteView.as_view(), name='delete-blogpost'),
    path('delete-premedicalform/<int:pk>/', views.PreMedicalFormDeleteView.as_view(), name='delete-premedicalform'),
    path('delete-comment/<int:pk>/', views.CommentDeleteView.as_view(), name='delete-comment'),
]
