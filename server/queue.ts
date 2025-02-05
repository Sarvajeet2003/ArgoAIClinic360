import Queue from "bull";
import { sendAppointmentEmail } from "./email";
import type { SelectUser, SelectAppointment } from "@db/schema";

// Create a new Bull queue for email notifications
export const emailQueue = new Queue("email-notifications", {
  redis: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

// Process email jobs in the background
emailQueue.process("appointment-confirmation", async (job) => {
  const { patient, doctor, appointment } = job.data;
  await sendAppointmentEmail(patient, doctor, appointment);
});

// Handle failed jobs
emailQueue.on("failed", (job, err) => {
  console.error("Job failed:", job.id, err);
});

// Add an appointment notification job to the queue
export async function queueAppointmentEmail(
  patient: SelectUser,
  doctor: SelectUser,
  appointment: SelectAppointment
) {
  await emailQueue.add("appointment-confirmation", {
    patient,
    doctor,
    appointment,
  });
}
