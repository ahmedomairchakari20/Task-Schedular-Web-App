from django.contrib.auth import authenticate
from .models import User, Task, Profile
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
import matplotlib.pyplot as plt
from datetime import date, timedelta, datetime, time
from django.db.models import Count
from django.db.models import Q
from django.db.models.functions import ExtractMonth
import datetime as dt
from .helper import send_forget_password_email
import uuid
import json
from bs4 import BeautifulSoup
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from .helper import send_

class DefaultView(APIView):
    def get(self, request):
        print(request.data)

        user = User.objects.filter(email='radcowboy@example.com')
        print(user)
        for u in user:
            print(type(u))
            print(type(u.is_active))
        return Response(f"heloww")

    def post(self, request):
        print(request.data)
        return Response({'token':'omw', 'msg':'Registration Successful'})


def auth(email, password):
    user = User.objects.get(email = email)
    if user:
        print("user exists")
        if user.check_password(password):
            return user
    return None

class UserLoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        print(email, password)

        user = auth(email=email, password=password)
        if user is not None:
            print(user)
            #  token = get_tokens_for_user(user)
            return Response({"email": user.email})
        else:
            return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}})

          
class SignupView(APIView):
    def get(self, request):
          print(request.data)
          return Response({"msg": "success"})
    
    def post(self, request):

        print(request.data)
        email = request.data['email']
        uname = request.data['username']
        password = request.data['password']
        print(email, uname, password)

        try:
            new_user = User.objects.create_user(
                email=email, password=password, username=uname
            )
            new_user.save()
        except:
            user = User.objects.get(email=email)
            
            print(user.email)
            print(type(user.email))
            user_info = {"email": user.email, "name": user.name}
            return Response(user_info)
        # print(new_user.email)
        return Response({"msg": "success bby"})
        # return Response({"email": new_user.email, "name": new_user.name})
        

class ProfileData(APIView):
    def get(self, request):
        # Retrieve the authenticated user
        email = request.GET.get("email")
        print(email)
        user = User.objects.get(email=email)
        print(user.notify)

        # Retrieve the user's profile data
        profile = Profile.objects.get(user=user)

        if profile:
            #Prepare the profile data to be returned
            profile_data = {
                "name": profile.name,
                "occupation": profile.occupation,
                "age": profile.age,
                "email": user.email,
                "notify":user.notify,
                "media": profile.media.url if profile.media else None,
            }

        return Response(profile_data)
    def post(self,request):
        print("media",request.data.get('media'))
        # Retrieve user information from the request (assuming the user is authenticated)
        email = request.data.get('email')
        user = User.objects.get(email=email)
       
        # Retrieve the data from the request
        name = request.data.get('name')
        occupation = request.data.get('occupation')
        age = request.data.get('age')
        notify=request.data.get('notify')
        media = request.data.get('media')  # Assuming media is sent as a file in the request
        # Check if a profile already exists for the user
        if notify=="false":
            notif=False
        else:
            notif=True
        print(notif)
        user.notify=notif
        user.save()
        profile, created = Profile.objects.get_or_create(user=user)
        

        # Update the profile data
        profile.name = name
        profile.occupation = occupation
        profile.age = age
        if media:
            profile.media = media

        # Save the profile object
        profile.save()

        return Response({'msg': "Profile data saved successfully."})
        


class ForgetPasswordView(APIView):
    def post(self, request):
        email = request.data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"msg": "User Not Found"})
        
        token = str(uuid.uuid4())
        
        try:
            profile_obj = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile_obj = Profile.objects.create(user=user, forget_password_token=token)

        profile_obj.forget_password_token = token
        profile_obj.save()

        send_forget_password_email(email, token)
        return Response({"email": user.email})

class changepassword(APIView):
    def post(self, request):
        token = request.data['token']
        print(token)
        try:
            profile_obj = Profile.objects.filter(forget_password_token = token).first()

            print("profile",profile_obj)
            return Response({"user_id":profile_obj.user.id})

        except Exception as e:
            print(e)
            return Response({"msg":"user_id doesnt exist"})

class newPassword(APIView):
    def post(self,request):
        user_id=request.data['user_id']
        password=request.data['password']
        print(user_id,password)
        try:
            user = User.objects.get(id=user_id)
            user.set_password(password)
            user.save()
            return Response({"msg":"password changed successfully"})
        except Exception as e:
            print(e)
            return Response({"msg":"user_id doesnt exist"})
        

def dateFormat(date_str):
    date_obj = datetime.strptime(str(date_str), "%Y-%m-%d")

    day = date_obj.day
    month = date_obj.strftime("%b")
    year = date_obj.year
    formatted_date = f"{day} {month} {year}"
    # print(formatted_date)  # Output: "12 April"
    return formatted_date

def timeFormat(time_str):
    time_obj = datetime.strptime(str(time_str), "%H:%M:%S")

    formatted_time = time_obj.strftime("%I:%M %p")
    # print(formatted_time)  # Output: "11:00 AM"
    return formatted_time


def getForwardProgressTime(future_date):
    future_date = future_date.strftime('%Y-%m-%d %H:%M:%S')
    dt = datetime.strptime(future_date, '%Y-%m-%d %H:%M:%S')

    time_difference = datetime.now() - dt 
    minutes_difference = int(time_difference.total_seconds() / 60)
    hours_difference = int(time_difference.total_seconds() / 3600)
    days_difference = time_difference.days
    print(minutes_difference)
    print(hours_difference)
    print(days_difference)
    if abs(days_difference) >= 1:
        return f"{abs(days_difference)} Days"
    elif abs(hours_difference) >=1: 
        return  f"{abs(hours_difference)} Hours"
    else:
        return f"{abs(minutes_difference)} Minutes"

def getProgressTime(previous_date): # on complete calculate total time
    # print(previous_date)

    time_difference = datetime.now() - previous_date
    minutes_difference = int(time_difference.total_seconds() / 60)
    hours_difference = int(time_difference.total_seconds() / 3600)
    days_difference = time_difference.days
    
    if abs(days_difference) >= 1:
        return f"{abs(days_difference)} Days"
    elif abs(hours_difference) >=1: 
        return  f"{abs(hours_difference)} Hours"
    else:
        return f"{abs(minutes_difference)} Minutes"
    
def trimDescription(html_string):
    # Parse the HTML string
    soup = BeautifulSoup(html_string, "html.parser")

    # Get the text content from the HTML
    text_content = soup.get_text()

    # Truncate the text content to a maximum of 50 characters
    truncated_text = f'<br/><p>{text_content[:50]}</p><br/>'
    print(truncated_text)

    return truncated_text
class TaskView(APIView):
     
     def get(self, request, ):
        print(request.GET.get("email"))
        email = request.GET.get("email")
        user = User.objects.get(email=email)

        current_time = datetime.now()
        current_date = date.today()

        time_obj = current_time.time()

        print(time_obj)

        # future tasks
        upcoming_tasks = Task.objects.filter(created_by=user,is_complete=False, is_started=False).filter(date__gt=current_date)
        upcoming_tasks2 = Task.objects.filter(created_by=user,is_complete=False, is_started=False).filter(date=current_date).filter(time__gt=time_obj)
        upcoming_tasks = (upcoming_tasks | upcoming_tasks2 ).order_by('date')

        print(upcoming_tasks)
        previous_tasks = Task.objects.filter(created_by=user,is_complete=False, is_started=False).filter(date__lt=current_date)
        previous_tasks2 = Task.objects.filter(created_by=user,is_complete=False, is_started=False).filter(date=current_date).filter(time__lt=time_obj)
        previous_tasks = (previous_tasks | previous_tasks2 ).order_by('date')
        # upcoming_tasks = upcoming_tasks | previous_tasks
        print(upcoming_tasks)
        inprogress_tasks = Task.objects.filter(created_by=user,is_complete=False, is_started=True).order_by('date')

        completed_tasks = Task.objects.filter(created_by=user, is_complete= True).order_by('date')

        U_tasks = []
        P_tasks = []
        D_tasks = []
        for uc_task in upcoming_tasks:
            # get all t
            pdate = dateFormat(uc_task.date)
            ptime = timeFormat(uc_task.time)
            # print(uc_task.image.url)
            task ={
                'id': uc_task.id,
                'title': uc_task.title,
                'description': uc_task.description,
                "date": pdate,
                "time": ptime,
                'color': uc_task.color,
                "complete_percentage": uc_task.complete_percentage,
                "remind_me_date": uc_task.remind_me_date,
                "remind_me": uc_task.remind_me,
                "recurring_task": uc_task.recurring_task,
                "recurring_task_date": uc_task.recurring_task_date,
                # "image": uc_task.image.url or ''
                "image": uc_task.image.url if uc_task.image else None,

            }
            U_tasks.append(task)
            
        for uc_task in previous_tasks: # expired tasks
            pdate = dateFormat(uc_task.date)
            ptime = timeFormat(uc_task.time)
            task ={
                'id': uc_task.id,
                'title': uc_task.title,
                'description': uc_task.description,
                "date": pdate,
                "time": ptime,
                'color': uc_task.color,
                "complete_percentage": uc_task.complete_percentage,
                "remind_me_date": uc_task.remind_me_date,
                "remind_me": uc_task.remind_me,
                "recurring_task": uc_task.recurring_task,
                "recurring_task_date": uc_task.recurring_task_date,
                "image": uc_task.image.url if uc_task.image else None,

            }
            U_tasks.append(task)
        print(U_tasks)
        for ip_task in inprogress_tasks:
            if ip_task.is_complete:
                continue
            pdate = dateFormat(ip_task.date)
            ptime = timeFormat(ip_task.time)
            task ={
                'id': ip_task.id,
                'title': ip_task.title,
                'description': ip_task.description,
                "date": pdate,
                "time": ptime,
                'complete_percentage': ip_task.complete_percentage,
                "color": ip_task.color,
                "remind_me_date": ip_task.remind_me_date,
                "remind_me": ip_task.remind_me,
                "recurring_task": ip_task.recurring_task,
                "recurring_task_date": ip_task.recurring_task_date,
                "image": ip_task.image.url if ip_task.image else None,

            }
            P_tasks.append(task)

        for d_task in completed_tasks:
            pdate = dateFormat(d_task.date)
            ptime = timeFormat(d_task.time)

            task ={
                'id': d_task.id,
                'title': d_task.title,
                'description': d_task.description,
                "date": pdate,
                "time": ptime,
                'color': d_task.color,
                'complete_percentage': d_task.complete_percentage,
                "remind_me_date": d_task.remind_me_date,
                "remind_me": d_task.remind_me,
                "recurring_task": d_task.recurring_task,
                "recurring_task_date": d_task.recurring_task_date,
                "image": d_task.image.url if d_task.image else None,
            }
            D_tasks.append(task)    
        
        data= {
            "upcoming":U_tasks,
            "inprogress":P_tasks,
            "complete":D_tasks
        }
        return Response(data)
     
     def post(self, request):
        print(request.data)
        email = request.POST.get('email')
        title = request.POST.get('title')
        description = request.POST.get('description').rstrip()
        date = request.POST.get('date')
        time = request.POST.get('time')
        remindme = request.POST.get('remindMe')
        remindme = remindme.lower() == 'true'
        remindme_dates = json.loads(request.POST.get('remindMeDates'))
        remindme_dates = [datetime.strptime(date, '%Y-%m-%d').date().isoformat() for date in remindme_dates]
        recurringtask = request.POST.get('recurringTask')
        recurringtask = recurringtask.lower() == 'true'
        recurringtask_dates = json.loads(request.POST.get('recurringTaskDates'))
        recurringtask_dates = [datetime.strptime(date, '%Y-%m-%d').date().isoformat() for date in recurringtask_dates]
        color = request.POST.get('color')
        existing_task = request.POST.get('existing')  
        existing_task = existing_task.lower() == 'true'
        day_limit = request.POST.get('dayLimit')
        day_limit = day_limit.lower() == 'true'
        image_file = request.FILES.get('media')
        print("image file:", image_file)
        print(remindme_dates)
        print(recurringtask_dates)
        print("remind",remindme)
        print("recurring",recurringtask)
        print("existing",existing_task)
        print("day",day_limit)
        user = User.objects.get(email=email)
          #first we wil check if the task is existed on the same date and time
        if existing_task == False:
              
            try:
                sameTask = Task.objects.filter(created_by=user, date=date, time=time)
                # print("same:", sameTask)
                if sameTask:
                    return Response({'exist': 'Same Task Exist on the same date and time, Are you sure to add this Task?'})
            except Exception as e:
                print("An error occurred:", str(e))

        if day_limit== False:
              
            try:
                all_day_task = Task.objects.filter(created_by=user,date=date)
                print(all_day_task)
                print(dt.date.today())
                print("count", all_day_task.count())
                if all_day_task.count() >= 5:
                    return Response({'limit': 'You have exceeded the limit of 5 tasks per day. Are You sure you want add more task?'})
            except Exception as e:
                print("An error occurred:", str(e))
              
            
        
          

        new_task = Task(
              title=title, remind_me= remindme, recurring_task= recurringtask,
              description=description, date=date, time=time, color=color, created_by=user
              )
          
        new_task.save()
        
        if remindme == True:
              print("remind me true")
              new_task.remind_me_date = remindme_dates
              new_task.save()
              
              
        if recurringtask == True:
              print("recurring task true")
              new_task.recurring_task_date = recurringtask_dates
              new_task.save()
        if image_file:
                new_task.image.save(image_file.name, ContentFile(image_file.read()), save=False)
                new_task.save()

        for d in recurringtask_dates:
                # recurring_d = datetime.strptime(d, "%Y-%m-%d").date()
                print(d)
                recur_task = Task(
                    title=title, remind_me= False, recurring_task= False,
                    description=description, date= d, time=time, color=color, created_by=user,
                    parent_task = new_task.id
                )
                recur_task.save()
                if image_file:
                    recur_task.image.save(image_file.name, ContentFile(image_file.read()), save=False)
                    recur_task.save()


        #   print(new_task)
        #   print(new_task.created_by)
        send_(email,"New Task Added Title : "+title,"you have added a new task with description: '"+description+"'. And time details as follow\n Date: "+str(date)+"\n Time: "+str(time)+"\n")
        return Response({'msg':'Task Added Successfully'})
     
     def delete(self, request):
        email = request.GET.get("email")
        id = request.GET.get("id")
        print(email, id)
        user = User.objects.get(email=email)
        task = Task.objects.get(created_by=user, id=id)
        task.delete()
        return Response({"msg": "success"})
     
     def patch(self, request):
        # get all the attribute
        id=request.POST.get('id')
        email = request.POST.get('email')
        title = request.POST.get('title')
        description = request.POST.get('description').rstrip()
        date = request.POST.get('date')
        time = request.POST.get('time')
        remindme = request.POST.get('remindMe')
        remindme = remindme.lower() == 'true'
        remindme_dates = json.loads(request.POST.get('remindMeDates'))
        remindme_dates = [datetime.strptime(date, '%Y-%m-%d').date().isoformat() for date in remindme_dates]
        recurringtask = request.POST.get('recurringTask')
        recurringtask = recurringtask.lower() == 'true'
        recurringtask_dates = json.loads(request.POST.get('recurringTaskDates'))
        recurringtask_dates = [datetime.strptime(date, '%Y-%m-%d').date().isoformat() for date in recurringtask_dates]
        color = request.POST.get('color')
        image_file = request.FILES.get('media')
        print("image file:", image_file)
        


        user = User.objects.get(email=email)
        task = Task.objects.get(created_by=user, id=id)
        task.title = title
        task.description = description
        task.date = date
        task.time = time
        task.remind_me = remindme
        task.remind_me_date = remindme_dates
        task.recurring_task = recurringtask
        task.recurring_task_date = recurringtask_dates
        if image_file is not None:
            print("image file:", image_file)
            task.image= image_file
        # do something with those new dates like create a task on those dates & delete prevs
        # all those with same title description color time
        
        # create them tasks
        children_tasks = Task.objects.filter(parent_task = task.id) # [8, 10]
        child_task_dates = []
        for ct in children_tasks:
            child_task_dates.append(str(ct.date))


        for child_task_date in task.recurring_task_date:
            if child_task_date not in child_task_dates: # a new task, [8, 11, 15]
                new_task =  Task(
                    title=title, remind_me= False, recurring_task= False,
                    description=description, date= child_task_date, time=time, color=color, created_by=user,
                    parent_task = task.id
                )
                new_task.save()
                if image_file:
                    new_task.image.save(image_file.name, ContentFile(image_file.read()), save=False)
                    new_task.save()
                
        # I have 2 children of drip hard task
        # I remove 1 from there and added
        #     
        # get all child aka tasks where parent = task.id
        # check if task.date in task.recurring_task_date[]
        # if not then delete that child
        children_tasks = Task.objects.filter(parent_task = task.id)

        for child_task in children_tasks:
            if str(child_task.date) not in task.recurring_task_date:
                child_task.delete()

        task.color = color
        

        task.save()

        return Response({"msg": "updated"})

class TaskPercentage(APIView):
    def patch(self, request):
        email = request.data["email"]
        id = request.data["id"]
        percentage = request.data['percentage']
        print(email, id, percentage)
        user = User.objects.get(email=email)
        task = Task.objects.get(created_by=user, id=id)
        task_dt = datetime.combine(task.date, task.time)
        current_time = datetime.now()
        

        if percentage == 100:
            task.is_complete = True
            print(task.date)
            print(task.time)
            dt = datetime.combine(task.date, task.time)
            if task_dt > current_time:
                print(dt)
                if task.start_datetime == None:
                    task.complete_date = '0 Days'
                    task.complete_percentage = percentage
                    task.save()
                    return Response({"msg": "updated"})
                else:    
                    task.complete_date = getForwardProgressTime(task.start_datetime)
            else:    
                task.complete_date = getProgressTime(dt) # 380 days
            print("Task updated")

        task.complete_percentage = percentage
        task.save()

        if task_dt > current_time: # future
            if task.start_datetime == None:
                task.start_datetime = current_time                
            print('this executes for future tasks')
            print(current_time)

        return Response({"msg": "updated"})

class ProgressView(APIView): # all i have to do is shift
    def patch(self, request):
        email = request.data["email"]
        id = request.data["id"]

        user = User.objects.get(email=email)
        task = Task.objects.get(created_by=user, id=id)
        task.is_started = True # query the inprogress tasks if there is_started is true
        task.start_datetime = datetime.now() # Task starts only when this is called
        task.save()

        send_(email,"Your Task '"+task.title+"' has been moved to In progress",
              "Your Task has description: '"+task.description+"' . And time details as follow\n Date: "+str(task.date)+"\n Time: "+str(task.time)+"\n")
        return Response({"msg": "updated"})

class CompleteView(APIView): # all i have to do is shift
    def patch(self, request):
        email = request.data["email"]
        id = request.data["id"]
        print("in complete req")
        user = User.objects.get(email=email)
        task = Task.objects.get(created_by=user, id=id)
        task.is_complete = True # query the inprogress tasks if there is_started is true
        task.complete_percentage = 100
        
        task_dt = datetime.combine(task.date, task.time)
        current_time = datetime.now()

        if task_dt > current_time:
            if task.start_datetime == None:
                task.complete_date = '0 Days'
                task.save()
                return Response({"msg": "updated"})
            else:    
                task.complete_date = getForwardProgressTime(task.start_datetime)
        else:    
            task.complete_date = getProgressTime(task_dt) # 380 days
        
        
        task.save()
        send_(email,"Congratulations on Completing Your Task '"+task.title+"'.","Your Task has description: '"+task.description+"' .")

        return Response({"msg": "updated"})
    
    def delete(self, request):

        email = request.GET.get("email")
        # print(email, id)
        user = User.objects.get(email=email)
        # all the completed tasks of the current user
        
        tasks = Task.objects.filter(created_by=user).filter(created_by=user, is_complete= True).order_by('date')
        print(tasks)
        tasks.delete()
        return Response({"response": "Deleted"})

class UpdateProfileView(APIView):

    def post(self, request):
        print(request.data)
        email = request.data["email"]
        age = request.data["age"]
        occupation = request.data["occupation"]
        name = request.data["name"]

        user = User.objects.get(email=email)
        user.age = age
        user.occupation = occupation
        user.name = name

        user.save()
        return Response({"msg": "success"})  
    

class DashboardView(APIView):
    def get(self, request):
        email = request.GET.get("email")
        user = User.objects.get(email=email)
        # Tasks that have is_completed = True are complete
        # Tasks that have completed_percentage = zero are upcoming
        # Tasks that have completed_percentage > 0 are in-progress & whose date is past current
        # query for upcoming
        upcoming_tasks = Task.objects.filter(created_by=user, is_complete=False, is_started=False).order_by('date')
        
        # filter(created_by=user, date__gte=date.today(), time__gte= time_obj, complete_percentage=0).order_by('date') # 30 april, 2023 1pm
        inprogress_tasks = Task.objects.filter(created_by=user,is_complete=False, is_started=True).order_by('date')

        # query for completed
        completed_tasks = Task.objects.filter(created_by=user, is_complete= True)
        tasks = Task.objects.filter(created_by=user)

        data = {
            "upcoming_tasks": len(upcoming_tasks),
            "inprogress_tasks": len(inprogress_tasks),
            "completed_tasks": len(completed_tasks),
            "total": len(tasks)
        }
        print(tasks)
        
        return Response(data)    


    
class AnalysisView(APIView):
    def get(self, request):
        email = request.GET.get("email")
        user = User.objects.get(email=email)

        now = datetime.now()

        last_week_start = now - timedelta(days=now.weekday() + 7)
        last_week_end = last_week_start + timedelta(days=6)


        last_month_start = datetime(now.year, now.month - 1, 1) if now.month > 1 else datetime(now.year - 1, 12, 1)
        last_month_end = datetime(now.year, now.month, 1, 23, 59, 59) - timedelta(seconds=1)

        
        last_year_start = datetime(now.year - 1, 1, 1)
        last_year_end = datetime(now.year - 1, 12, 31, 23, 59, 59)

        last_week_tasks = Task.objects.filter(created_by=user, date__range=(last_week_start, last_week_end))
        last_month_tasks = Task.objects.filter(created_by=user, date__range=(last_month_start, last_month_end))
        last_year_tasks = Task.objects.filter(created_by=user, date__range=(last_year_start, last_year_end))

        # serialize these objects
        lw_tasks = []
        lm_tasks = []
        ly_tasks = []

        for last_week_task in last_week_tasks:
            
            dt = datetime.combine(last_week_task.date, last_week_task.time)
            progress_time = getProgressTime(dt)
            task ={
                'id': last_week_task.id,
                'title': last_week_task.title,
                'is_complete': last_week_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_week_task.complete_percentage
            }
            if last_week_task.is_complete:
                task['in_progress_time'] = last_week_task.complete_date

            lw_tasks.append(task)

        for last_month_task in last_month_tasks:
            dt = datetime.combine(last_month_task.date, last_month_task.time)
            progress_time = getProgressTime(dt)
            task ={
                'id': last_month_task.id,
                'title': last_month_task.title,
                'is_complete': last_month_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_month_task.complete_percentage
            }
            if last_month_task.is_complete:
                task['in_progress_time'] = last_month_task.complete_date
            lm_tasks.append(task)

        
        for last_year_task in last_year_tasks:
            dt = datetime.combine(last_year_task.date, last_year_task.time)
            progress_time = getProgressTime(dt)
            task ={
                'id': last_year_task.id,
                'title': last_year_task.title,
                'is_complete': last_year_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_year_task.complete_percentage
            }
            if last_year_task.is_complete:
                task['in_progress_time'] = last_year_task.complete_date
            ly_tasks.append(task)    
        
        
        
        graph_data = [
            { 'month': "Jan", 'completed': 0, 'incomplete': 0 },
            { 'month': "Feb", 'completed': 0, 'incomplete': 0 },
            { 'month': "Mar", 'completed': 0, 'incomplete': 0 },
            { 'month': "Apr", 'completed': 0, 'incomplete': 0 },
            { 'month': "May", 'completed': 0, 'incomplete': 0 },
            { 'month': "June", 'completed': 0, 'incomplete': 0 },
            { 'month': "July", 'completed': 0, 'incomplete': 0 },
            { 'month': "Aug", 'completed': 0, 'incomplete': 0 },
            { 'month': "Sep", 'completed': 0, 'incomplete': 0 },
            { 'month': "Oct", 'completed': 0, 'incomplete': 0 },
            { 'month': "Nov", 'completed': 0, 'incomplete': 0 },
            { 'month': "Dec", 'completed': 0, 'incomplete': 0 },
        ]


        # get last year tasks
        now = datetime.now()
        last_year_start = datetime(now.year - 1, 1, 1)
        last_year_end = datetime(now.year - 1, 12, 31, 23, 59, 59)

        # Get the tasks for the previous year
        tasks = Task.objects.filter(created_by=user,date__range=(last_year_start, last_year_end))
        tasks_by_month = tasks.annotate(month=ExtractMonth('date')).values('month').annotate(
        complete_tasks=Count('id', filter=Q(is_complete=True)),
        incomplete_tasks=Count('id', filter=~Q(is_complete=True))
        )
        # month['month'], month['complete_tasks'], month['incomplete_tasks']
        # 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
        # 'jan': {
        #   'incomplete': 0, 'complete': 1
        # },
        for month in tasks_by_month: # 12 times
            # if month['month'] == 1:
            month_index = int(month['month']) - 1
            graph_data[month_index]['completed'] = month['complete_tasks']
            graph_data[month_index]['incomplete'] = month['incomplete_tasks']

            print(f"Month {month['month']}: Complete tasks: {month['complete_tasks']}, Incomplete tasks: {month['incomplete_tasks']}")
            print('\n\n\n')

        data = {
            "last_week_tasks": lw_tasks,
            "last_month_tasks": lm_tasks,
            "last_year_tasks": ly_tasks,
            'graph_data':graph_data
        }

        return Response(data)
class DownloadReport(APIView):
    def get(self, request):
        print("download report")
        user_email = request.GET.get('email')  # Assuming email is passed as a query parameter

        # Retrieve the user object based on the email
        user = User.objects.get(email=user_email)
        now = datetime.now()

        last_week_start = now - timedelta(days=now.weekday() + 7)
        last_week_end = last_week_start + timedelta(days=6)

        last_month_start = datetime(now.year, now.month - 1, 1) if now.month > 1 else datetime(now.year - 1, 12, 1)
        last_month_end = datetime(now.year, now.month, 1, 23, 59, 59) - timedelta(seconds=1)

        last_year_start = datetime(now.year - 1, 1, 1)
        last_year_end = datetime(now.year - 1, 12, 31, 23, 59, 59)

        # Get tasks for the last week, last month, and last year
        last_week_tasks = Task.objects.filter(created_by=user, date__range=(last_week_start, last_week_end))
        last_month_tasks = Task.objects.filter(created_by=user, date__range=(last_month_start, last_month_end))
        last_year_tasks = Task.objects.filter(created_by=user, date__range=(last_year_start, last_year_end))

        # Serialize these tasks into lists
        lw_tasks = []
        lm_tasks = []
        ly_tasks = []

        for last_week_task in last_week_tasks:
            dt = datetime.combine(last_week_task.date, last_week_task.time)
            progress_time = getProgressTime(dt)
            task = {
                'id': last_week_task.id,
                'title': last_week_task.title,
                'is_complete': last_week_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_week_task.complete_percentage
            }
            if last_week_task.is_complete:
                task['in_progress_time'] = last_week_task.complete_date

            lw_tasks.append(task)

        for last_month_task in last_month_tasks:
            dt = datetime.combine(last_month_task.date, last_month_task.time)
            progress_time = getProgressTime(dt)
            task = {
                'id': last_month_task.id,
                'title': last_month_task.title,
                'is_complete': last_month_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_month_task.complete_percentage
            }
            if last_month_task.is_complete:
                task['in_progress_time'] = last_month_task.complete_date

            lm_tasks.append(task)

        for last_year_task in last_year_tasks:
            dt = datetime.combine(last_year_task.date, last_year_task.time)
            progress_time = getProgressTime(dt)
            task = {
                'id': last_year_task.id,
                'title': last_year_task.title,
                'is_complete': last_year_task.is_complete,
                'in_progress_time': progress_time,
                'complete_percentage': last_year_task.complete_percentage
            }
            if last_year_task.is_complete:
                task['in_progress_time'] = last_year_task.complete_date

            ly_tasks.append(task)

        # Create a PDF document
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="work_history_report.pdf"'
        p = canvas.Canvas(response, pagesize=letter)

        # Set the table headers
        table_headers = ["NO", "Title", "Done", "In Progress Time", "Completion Ratio"]

        # Write the last week tasks to the PDF (First page)
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, 750, "Last Week Tasks")
        p.setFont("Helvetica", 10)
        self.draw_table(p, 50, 720, lw_tasks, table_headers)

        # Add a new page for the last month tasks (Next page)
        p.showPage()
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, 750, "Last Month Tasks")
        p.setFont("Helvetica", 10)
        self.draw_table(p, 50, 720, lm_tasks, table_headers)

        # Add a new page for the last year tasks (Next page)
        p.showPage()
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, 750, "Last Year Tasks")
        p.setFont("Helvetica", 10)
        self.draw_table(p, 50, 720, ly_tasks, table_headers)

        # Generate the graph data for the last year tasks
        graph_data = [
            {'month': "Jan", 'completed': 0, 'incomplete': 0},
            {'month': "Feb", 'completed': 0, 'incomplete': 0},
            {'month': "Mar", 'completed': 0, 'incomplete': 0},
            {'month': "Apr", 'completed': 0, 'incomplete': 0},
            {'month': "May", 'completed': 0, 'incomplete': 0},
            {'month': "June", 'completed': 0, 'incomplete': 0},
            {'month': "July", 'completed': 0, 'incomplete': 0},
            {'month': "Aug", 'completed': 0, 'incomplete': 0},
            {'month': "Sep", 'completed': 0, 'incomplete': 0},
            {'month': "Oct", 'completed': 0, 'incomplete': 0},
            {'month': "Nov", 'completed': 0, 'incomplete': 0},
            {'month': "Dec", 'completed': 0, 'incomplete': 0},
        ]

        # Update the graph data based on the last year tasks
        tasks_by_month = last_year_tasks.annotate(month=ExtractMonth('date')).values('month').annotate(
            complete_tasks=Count('id', filter=Q(is_complete=True)),
            incomplete_tasks=Count('id', filter=~Q(is_complete=True))
        )
        for data in tasks_by_month:
            month = data['month'] - 1  # Month index starts from 0
            graph_data[month]['completed'] = data['complete_tasks']
            graph_data[month]['incomplete'] = data['incomplete_tasks']

        # Add a new page for the graph
        p.showPage()
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, 750, "Task Completion Graph")
        self.draw_graph(p, graph_data)

        # Save the PDF
        p.save()

        return response

    def draw_table(self, p, x, y, tasks, headers):
        row_height = 20
        column_width = 100
        table_width = len(headers) * column_width

        # Draw table headers
        p.setFont("Helvetica-Bold", 10)
        for i, header in enumerate(headers):
            p.drawString(x + i * column_width, y, header)

        # Draw table rows
        p.setFont("Helvetica", 10)
        for i, task in enumerate(tasks):
            task_values = [
                str(i + 1),
                task['title'],
                "Yes" if task['is_complete'] else "No",
                task['in_progress_time'],
                str(task['complete_percentage'])
            ]
            for j, value in enumerate(task_values):
                p.drawString(x + j * column_width, y - (i + 1) * row_height, value)

    def draw_graph(self,p, graph_data):
        # Generate the graph using Matplotlib
        months = [data['month'] for data in graph_data]
        completed = [data['completed'] for data in graph_data]
        incomplete = [data['incomplete'] for data in graph_data]

        plt.figure(figsize=(8, 6))

        # Calculate the bar width and gap
        bar_width = 0.4
        bar_gap = 0.2
        bar_positions = range(len(months))

        # Draw completed bars
        plt.bar(bar_positions, completed, width=bar_width, color='blue', label='Completed')

        # Draw incomplete bars slightly below completed bars
        plt.bar([pos + bar_gap for pos in bar_positions], incomplete, width=bar_width, color='red', label='Incomplete')

        plt.xlabel('Month')
        plt.ylabel('No. of Completions')
        plt.title('Task Completion Graph')

        plt.legend()
        plt.xticks(bar_positions, months)
        plt.tight_layout()

        # Save the graph as an image file
        graph_path = 'graph.png'
        plt.savefig(graph_path)
        plt.close()

        # Draw the graph image on the PDF canvas
        p.drawImage(graph_path, x=50, y=300, width=400, height=300)





class CalendarView(APIView):
    def get(self, request):
        email = request.GET.get("email")
        print(email)
        user = User.objects.get(email=email)
        
        print(user)
        
        # multiple_tasks = Task.objects.annotate(date_count=Count('date')).filter(date_count__gt=0, created_by=user)
        # single_tasks = Task.objects.annotate(date_count=Count('date')).filter(date_count=0, created_by=user)
        # tasks = Task.objects.values('date').annotate(date_count=Count('id')).exclude(Q(date_count__gt=1))
        dates = Task.objects.values('date').annotate(date_count=Count('id')).filter(date_count__gt=1, is_complete=False, created_by=user)
        clean_dates = []
        for date in dates:
            clean_dates.append(date['date'])
        singleTasks = Task.objects.exclude(date__in=clean_dates).filter(created_by=user, is_complete=False)

        multiple_task = []
        for date in dates:
            this_date_tasks = []
            tasks = Task.objects.filter(date=date['date'], created_by=user, is_complete=False)
            for task in tasks:
                time = timeFormat(task.time)
                # print(task.title)
                this_date_tasks.append({
                "date": task.date,
                "time": time,
                "title": task.title,
                "description": trimDescription(task.description),
                "color": task.color
            })
            multiple_task.append(this_date_tasks)

        # print('M',multiple_task)   

        single_task = []  # get all the dates that are not in 
        # print(len(singleTasks))
        for task in singleTasks:
            time = timeFormat(task.time)
            # print(task)
            single_task.append({
                "date": task.date,
                "time": time,
                "title": task.title,
                "description": trimDescription(task.description),
                "color": task.color
            })
        # print(multiple_task)

        return Response({"multiple_task": multiple_task, "single_task": single_task})      


class SearchView(APIView):
    def get(self, request):
        email = request.GET.get("email")
        user = User.objects.get(email=email)
        search = request.GET.get("search")
        print(f"search value is: {search}")
        current_time = datetime.now()
        time_obj = current_time.time()
        data = {
                "upcoming":[],
                "inprogress":[],
                "complete":[]
            }
        if search:
            tasks = Task.objects.filter(title__icontains=search, created_by=user)
            # do the same stuff you do for that
            upcoming_tasks = tasks.filter(is_complete=False, is_started=False)

            inprogress_tasks = tasks.filter(created_by=user, is_complete=False, is_started=True).order_by('date')

            completed_tasks = tasks.filter(created_by=user, is_complete= True).order_by('date')

            U_tasks = []
            P_tasks = []
            D_tasks = []
            for uc_task in upcoming_tasks:
                pdate = dateFormat(uc_task.date)
                ptime = timeFormat(uc_task.time)
                task ={
                    'id': uc_task.id,
                    'title': uc_task.title,
                    'description': uc_task.description,
                    "date": pdate,
                    "time": ptime,
                    "complete_percentage": uc_task.complete_percentage,
                    "color": uc_task.color,
                    "image": uc_task.image.url if uc_task.image else None,

                }
                U_tasks.append(task)

            for ip_task in inprogress_tasks:
                if ip_task.is_complete:
                    continue
                pdate = dateFormat(ip_task.date)
                ptime = timeFormat(ip_task.time)
                task ={
                    'id': ip_task.id,
                    'title': ip_task.title,
                    'description': ip_task.description,
                    "date": pdate,
                    "time": ptime,
                    'complete_percentage': ip_task.complete_percentage,
                    "color": ip_task.color,
                    "image": ip_task.image.url if ip_task.image else None,

                }
                P_tasks.append(task)

            for d_task in completed_tasks:
                pdate = dateFormat(d_task.date)
                ptime = timeFormat(d_task.time)

                task ={
                    'id': d_task.id,
                    'title': d_task.title,
                    'description': d_task.description,
                    "date": pdate,
                    "time": ptime,
                    'complete_percentage': d_task.complete_percentage,
                    'color': d_task.color,
                    "image": d_task.image.url if d_task.image else None,
                    
                }
                D_tasks.append(task)    
            
            data= {
                "upcoming":U_tasks,
                "inprogress":P_tasks,
                "complete":D_tasks
            }

        return Response(data)
    

class SettingView(APIView):
    def get(self, request):
        email = request.GET.get("email")
        user = User.objects.get(email=email)
        data = {
            "feedback": user.feedback,
        }
        return Response(data)
    def post(self,request):
        email=request.data['email']
        feedback=request.data['feedback']
        support=request.data['support']
        user = User.objects.get(email=email)
        user.feedback=feedback
        user.support=support
        user.save()
        # here email will be the admin email
        send_("ahmedomaid987@gmail.com","Support Needed","user email"+email+"\n"+"Support msg:"+support+"\n"+"Feedback:"+feedback+"\n")
        return Response({"msg": "feddback send to Admin"})