# Generated by Django 2.2 on 2019-04-29 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_room_rounds'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='JSON',
            field=models.TextField(default=''),
        ),
    ]