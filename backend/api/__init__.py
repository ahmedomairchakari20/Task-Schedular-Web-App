from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'web_project.settings')

# Create the Celery app
app = Celery('web_project')

# Load task modules from all registered Django app configs
app.autodiscover_tasks()