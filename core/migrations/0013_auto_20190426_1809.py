# Generated by Django 2.2 on 2019-04-26 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_room_gamestart'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='gameStart',
            field=models.DateTimeField(null=True),
        ),
    ]
