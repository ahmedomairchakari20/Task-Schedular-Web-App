from .helper import send_
from django.contrib.auth import get_user_model
from celery import shared_task
import logging
from django.apps import apps
from django.conf import settings
from datetime import date,datetime, timedelta

logger = logging.getLogger(__name__)

@shared_task
def reminder(**kwargs):
    apps.populate(settings.INSTALLED_APPS)
    logger.info("reminder")
    print("reminder")
    message = "You Task is due in hour."
    mail_subject = 'Reminder Email'
    Task=apps.get_model('api','Task')
    User=get_user_model()
    print("printing")
    print(Task)
    current_time = datetime.now().replace(microsecond=0, second=0).time()
    two_hours_ago = (datetime.now() + timedelta(hours=2)).replace(microsecond=0, second=0).time()
    print(current_time)
    print(two_hours_ago)
    
    tasks = Task.objects.filter(date=date.today(),time__lte=two_hours_ago, time__gte=current_time,reminded=False)
    print(tasks)
    users = [task.created_by for task in tasks]
    print(users)
    emails=set(user.email for user in users)
    print(emails)
    for e in emails:
        print(e)
        user=User.objects.get(email=e)
        print(user)
        tasks = Task.objects.filter(created_by=user, date=date.today(), time__lte=two_hours_ago, time__gte=current_time)
        for task_obj in tasks:
            print(task_obj)
            print(task_obj.reminded)
            task_obj.reminded = True
            task_obj.save()
            send_(e, mail_subject, message+"\n"+"Task Title:"+task_obj.title+"\n"+"Task Description"+task_obj.description)

    return len(emails)

@shared_task
def schedule_mail(**kwargs):
    # Initialize Django app
    apps.populate(settings.INSTALLED_APPS)
    logger.info("schedule_mail")
    print("schedule_mail")

    message = "You have tasks to do today"
    mail_subject = 'Scheduled Email'
    # User = get_user_model()
    # users = User.objects.all()
    # Fetch tasks for today
    Task = apps.get_model('api', 'Task')
    print(Task)
    print(date.today())
    tasks = Task.objects.filter(date=date.today())     #for testing "2023-07-07"
    print(tasks)
    
    current_date = date.today().strftime("%Y-%m-%d")
    print(current_date)
    reminedmeTask=Task.objects.filter(remind_me_date=current_date)
    print(reminedmeTask)
    #check if reminedmeTask is not empty
    if reminedmeTask:
        reuser=[task.created_by for task in reminedmeTask]
        print(reuser)
        reto_email = [user.email for user in reuser]
        print(reto_email)
        for e in reto_email:
            print(e)
            send_(e, mail_subject, message)
    # Get the users associated with the tasks
    users = [task.created_by for task in tasks]

# Get the emails of the users
    to_email = [user.email for user in users if user.notify]
    print(to_email)
    for e in to_email:
        print(e)
        send_(e, mail_subject, message)
    return len(to_email)