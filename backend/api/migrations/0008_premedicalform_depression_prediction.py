# Generated by Django 4.2.7 on 2023-11-24 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_premedicalform_prediction'),
    ]

    operations = [
        migrations.AddField(
            model_name='premedicalform',
            name='depression_prediction',
            field=models.FloatField(blank=True, null=True),
        ),
    ]