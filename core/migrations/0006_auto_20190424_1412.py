# Generated by Django 2.2 on 2019-04-24 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_merge_20190423_1139'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='name',
            field=models.CharField(default='Room', max_length=50),
        ),
    ]
