# Generated by Django 4.2.7 on 2023-11-24 10:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_premedicalform_prediction'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='premedicalform',
            name='prediction',
        ),
    ]