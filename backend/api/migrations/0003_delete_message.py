# Generated by Django 4.2.6 on 2023-11-15 09:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_blogpost_content_blogpost_pre_medical_form_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Message',
        ),
    ]
