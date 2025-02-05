import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { appointments, medicalRecords, doctorSchedule, users } from "@db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendAppointmentEmail } from "./email";

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Medical Records API
  app.post("/api/records", ensureAuthenticated, async (req, res) => {
    const schema = z.object({
      patientId: z.number(),
      diagnosis: z.string(),
      prescription: z.string().optional(),
      notes: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: fromZodError(result.error).message });
    }

    const record = await db.insert(medicalRecords).values({
      ...result.data,
      doctorId: req.user!.id,
    }).returning();

    res.status(201).json(record[0]);
  });

  app.get("/api/records/:patientId", ensureAuthenticated, async (req, res) => {
    const records = await db.query.medicalRecords.findMany({
      where: eq(medicalRecords.patientId, parseInt(req.params.patientId)),
      with: {
        doctor: true,
      },
    });
    res.json(records);
  });

  // Appointments API
  app.post("/api/appointments", ensureAuthenticated, async (req, res) => {
    const schema = z.object({
      doctorId: z.number(),
      startTime: z.string(),
      endTime: z.string(),
      reason: z.string().optional(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: fromZodError(result.error).message });
    }

    const startTime = new Date(result.data.startTime);
    const endTime = new Date(result.data.endTime);

    try {
      const appointment = await db.insert(appointments).values({
        doctorId: result.data.doctorId,
        patientId: req.user!.id,
        startTime,
        endTime,
        reason: result.data.reason,
        status: "scheduled",
      }).returning();

      const [doctor] = await db.select().from(users).where(eq(users.id, result.data.doctorId));

      // Send email notification and handle the result
      const emailSent = await sendAppointmentEmail(req.user!, doctor, appointment[0]);

      res.status(201).json({ 
        ...appointment[0],
        emailStatus: emailSent ? 'sent' : 'failed'
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ error: "Failed to book appointment" });
    }
  });

  app.get("/api/appointments", ensureAuthenticated, async (req, res) => {
    const userAppointments = await db.query.appointments.findMany({
      where: req.user!.role === "doctor"
        ? eq(appointments.doctorId, req.user!.id)
        : eq(appointments.patientId, req.user!.id),
      with: {
        patient: true,
        doctor: true,
      },
    });
    res.json(userAppointments);
  });

  app.put("/api/appointments/:id", ensureAuthenticated, async (req, res) => {
    const schema = z.object({
      status: z.enum(["scheduled", "completed", "cancelled"]),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      reason: z.string().optional(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: fromZodError(result.error).message });
    }

    const updateData: any = { status: result.data.status };
    if (result.data.startTime) {
      updateData.startTime = new Date(result.data.startTime);
    }
    if (result.data.endTime) {
      updateData.endTime = new Date(result.data.endTime);
    }
    if (result.data.reason) {
      updateData.reason = result.data.reason;
    }

    const appointment = await db.update(appointments)
      .set(updateData)
      .where(eq(appointments.id, parseInt(req.params.id)))
      .returning();

    res.json(appointment[0]);
  });

  // Doctor Schedule API
  app.post("/api/schedule", ensureAuthenticated, async (req, res) => {
    if (req.user!.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can set schedules" });
    }

    const schema = z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
      isAvailable: z.boolean().optional(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: fromZodError(result.error).message });
    }

    const schedule = await db.insert(doctorSchedule).values({
      ...result.data,
      doctorId: req.user!.id,
    }).returning();

    res.status(201).json(schedule[0]);
  });

  app.get("/api/doctors", ensureAuthenticated, async (req, res) => {
    const doctors = await db.select().from(users).where(eq(users.role, "doctor"));
    res.json(doctors);
  });

  const httpServer = createServer(app);
  return httpServer;
}