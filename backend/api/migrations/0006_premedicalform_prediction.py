# Generated by Django 4.2.7 on 2023-11-23 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_premedicalform_disorders_diagnosed'),
    ]

    operations = [
        migrations.AddField(
            model_name='premedicalform',
            name='prediction',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
