from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, BlogPost, Comment, PreMedicalForm

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role']
    list_filter = ['role']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role')}
        ),
    )
    search_fields = ['username', 'email']
    ordering = ['username']
    filter_horizontal = ()

admin.site.register(User, CustomUserAdmin)

class BlogPostAdmin(admin.ModelAdmin):  # Corrected inheritance to admin.ModelAdmin
    list_display = ('title', 'author')
    list_filter = ('author',)
    search_fields = ('title', 'author__username')

admin.site.register(BlogPost, BlogPostAdmin)

class CommentAdmin(admin.ModelAdmin):  # Corrected inheritance to admin.ModelAdmin
    list_display = ('content', 'author', 'blog_post', 'commenter_role')
    list_filter = ('commenter_role', 'blog_post__author')
    search_fields = ('content', 'author__username', 'blog_post__title')

admin.site.register(Comment, CommentAdmin)

class PreMedicalFormAdmin(admin.ModelAdmin):
    list_display = ('patient', 'symptoms', 'form_filled_by_doctor')
    list_filter = ('form_filled_by_doctor',)
    search_fields = ('patient__username',)

admin.site.register(PreMedicalForm, PreMedicalFormAdmin)
