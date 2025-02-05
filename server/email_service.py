import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

def format_datetime(dt):
    return dt.strftime("%B %d, %Y at %I:%M %p")

def send_appointment_email(patient, doctor, appointment):
    try:
        msg = MIMEMultipart()
        msg['From'] = f'Clinic360 <{os.environ["EMAIL_USER"]}>'
        msg['To'] = patient.email
        msg['Subject'] = f'Appointment Confirmation with Dr. {doctor.full_name}'

        body = f"""
Dear {patient.full_name},

Your appointment has been scheduled with Dr. {doctor.full_name}.

Appointment Details:
- Date: {format_datetime(appointment.start_time)}
- Time: {format_datetime(appointment.start_time)} - {format_datetime(appointment.end_time)}
- Reason: {appointment.reason or "Not specified"}

Location: Clinic360 Medical Center

Please arrive 15 minutes before your scheduled time. If you need to reschedule or cancel your appointment, please contact us as soon as possible.

Best regards,
Clinic360 Team
        """

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(os.environ['EMAIL_USER'], os.environ['EMAIL_PASS'])
        server.send_message(msg)
        server.quit()

        print(f"Appointment confirmation email sent to {patient.email}")
        return True
    except Exception as e:
        print(f"Error sending appointment email: {e}")
        return False
