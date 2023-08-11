import os
from celery import Celery





os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'web_project.settings')

app = Celery('web_project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

from django.conf import settings

# Access and print the CELERY_BEAT_SCHEDULE
# print(settings.CELERY_BEAT_SCHEDULE)


