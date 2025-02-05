import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["patient", "doctor"] }).notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  specialization: text("specialization"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  diagnosis: text("diagnosis").notNull(),
  prescription: text("prescription"),
  notes: text("notes"),
  attachments: json("attachments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["scheduled", "completed", "cancelled"] }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctorSchedule = pgTable("doctor_schedule", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  medicalRecords: many(medicalRecords),
  appointments: many(appointments),
  schedule: many(doctorSchedule),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(users, { fields: [medicalRecords.patientId], references: [users.id] }),
  doctor: one(users, { fields: [medicalRecords.doctorId], references: [users.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(users, { fields: [appointments.patientId], references: [users.id] }),
  doctor: one(users, { fields: [appointments.doctorId], references: [users.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords);
export const selectMedicalRecordSchema = createSelectSchema(medicalRecords);

export const insertAppointmentSchema = createInsertSchema(appointments);
export const selectAppointmentSchema = createSelectSchema(appointments);

export const insertDoctorScheduleSchema = createInsertSchema(doctorSchedule);
export const selectDoctorScheduleSchema = createSelectSchema(doctorSchedule);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type SelectMedicalRecord = z.infer<typeof selectMedicalRecordSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type SelectAppointment = z.infer<typeof selectAppointmentSchema>;
export type InsertDoctorSchedule = z.infer<typeof insertDoctorScheduleSchema>;
export type SelectDoctorSchedule = z.infer<typeof selectDoctorScheduleSchema>;
