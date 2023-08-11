
import uuid
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import requests




ANYMAIL = settings.ANYMAIL



# recipient_email = "ssaimsheikh863@gmail.com"
subject = "Hello"
# message = "Testing some Mailgun awesomeness!"






def send_(recipient_email, subject, message):
    print("send_")
    response = requests.post(
        "https://api.mailgun.net/v3/sandbox609fcd8ffa3a47d0a2b56e2d29b6ca56.mailgun.org/messages",
        auth=("api", 'd6d8aa10a1b6906133cd135e48d365cc-6d8d428c-5135e388'),
        data={"from": "Ahmed Omair <postmaster@sandbox609fcd8ffa3a47d0a2b56e2d29b6ca56.mailgun.org>",
              "to": recipient_email,
              "subject": subject,
              "text": message})
    try:
        response.raise_for_status()
        print("Email sent successfully.")
    except Exception as e:
        print("An error occurred: {}".format(str(e)))

def send_forget_password_email(email, token):
    print("token",token)
    recipient_email = email
    message=f'Hi, click on the link to reset your password http://127.0.0.1:3000/resetpassword/{token}'
    send_(recipient_email, subject, message)

