# Generated by Django 2.2 on 2019-04-23 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='color',
            field=models.TextField(max_length=10, null=True),
        ),
    ]
