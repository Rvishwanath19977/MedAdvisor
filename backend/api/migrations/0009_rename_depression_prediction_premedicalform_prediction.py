# Generated by Django 4.2.7 on 2023-11-24 19:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_premedicalform_depression_prediction'),
    ]

    operations = [
        migrations.RenameField(
            model_name='premedicalform',
            old_name='depression_prediction',
            new_name='prediction',
        ),
    ]