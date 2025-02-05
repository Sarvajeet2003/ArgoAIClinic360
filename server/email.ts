import type { SelectUser, SelectAppointment } from "@db/schema";
import { format } from "date-fns";
import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Email credentials not found in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendAppointmentEmail(
  patient: SelectUser,
  doctor: SelectUser,
  appointment: SelectAppointment
) {
  const emailContent = `
Dear ${patient.fullName},

Your appointment has been scheduled with Dr. ${doctor.fullName}.

Appointment Details:
- Date: ${format(new Date(appointment.startTime), "PPP")}
- Time: ${format(new Date(appointment.startTime), "p")} - ${format(new Date(appointment.endTime), "p")}
- Reason: ${appointment.reason || "Not specified"}

Location: Clinic360 Medical Center

Please arrive 15 minutes before your scheduled time. If you need to reschedule or cancel your appointment, please contact us as soon as possible.

Best regards,
Clinic360 Team
  `;

  try {
    await transporter.sendMail({
      from: `"Clinic360" <${process.env.EMAIL_USER}>`,
      to: patient.email,
      subject: `Appointment Confirmation with Dr. ${doctor.fullName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    });
    console.log(`Appointment confirmation email sent to ${patient.email}`);
    return true;
  } catch (error) {
    console.error("Error sending appointment email:", error);
    // Don't throw the error, just log it and return false
    return false;
  }
}