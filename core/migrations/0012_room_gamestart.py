# Generated by Django 2.2 on 2019-04-26 22:02

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_room_createdat'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='gameStart',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
