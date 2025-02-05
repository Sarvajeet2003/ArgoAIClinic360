# Clinic360 - Healthcare Management Platform

## Overview
Clinic360 is a comprehensive healthcare management platform designed to streamline patient-doctor interactions through an advanced Electronic Health Records (EHR) system and intelligent appointment booking capabilities. The platform offers distinct experiences for both patients and healthcare providers.

## Features
- **User Authentication**: Secure login and registration system for both patients and doctors
- **Role-Based Access**: Different interfaces and capabilities for patients and doctors
- **Appointment Management**: Easy scheduling and tracking of medical appointments
- **Medical Records**: Digital storage and access to patient medical history
- **Real-time Email Notifications**: Automated appointment confirmations and reminders

## User Guides

### For Patients
1. **Registration and Login**
   - Visit the authentication page
   - Choose "Register" and select the "Patient" role
   - Fill in your personal information
   - Use your credentials to log in

2. **Booking Appointments**
   - Navigate to "Appointments" in the sidebar
   - Click "Book Appointment"
   - Select your preferred doctor
   - Choose available date and time
   - Provide reason for visit
   - Receive email confirmation

3. **Viewing Medical Records**
   - Access your medical history through "Medical Records"
   - View diagnoses, prescriptions, and doctor's notes
   - Track your healthcare journey chronologically

### For Doctors
1. **Registration and Login**
   - Register as a doctor with specialization details
   - Login to access the doctor's dashboard

2. **Managing Schedule**
   - Set up available time slots
   - Mark specific times as unavailable
   - View upcoming appointments

3. **Patient Management**
   - Access patient records
   - Add medical records after consultations
   - Track patient history

## Technical Architecture

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Shadcn UI components
- Wouter for routing
- Tailwind CSS for styling

### Backend
- Python Flask server
- PostgreSQL database
- SQLAlchemy ORM
- Redis for background tasks
- Flask-Session for authentication

### Key Components
1. **Authentication System**
   - Session-based authentication
   - Role-based access control
   - Secure password hashing

2. **Database Schema**
   - Users (Patients/Doctors)
   - Appointments
   - Medical Records
   - Doctor Schedules

3. **Email System**
   - SMTP integration
   - Automated notifications
   - HTML email templates

## API Documentation

### Authentication Endpoints
```
POST /api/register
- Register new user (patient/doctor)
- Body: { username, password, email, fullName, role, specialization? }

POST /api/login
- Authenticate user
- Body: { username, password }

POST /api/logout
- End user session

GET /api/user
- Get current user details
```

### Appointments
```
GET /api/appointments
- Get user's appointments
- Returns different results based on role

POST /api/appointments
- Book new appointment
- Body: { doctorId, startTime, endTime, reason? }

PUT /api/appointments/:id
- Update appointment status
- Body: { status, startTime?, endTime?, reason? }
```

### Medical Records
```
POST /api/records
- Create medical record
- Body: { patientId, diagnosis, prescription?, notes? }

GET /api/records/:patientId
- Get patient's medical records
```

### Doctor Schedule
```
POST /api/schedule
- Set doctor's available times
- Body: { dayOfWeek, startTime, endTime, isAvailable }

GET /api/doctors
- Get list of available doctors
```

## Environment Setup

### Required Environment Variables
```
DATABASE_URL=postgresql://user:password@host:port/dbname
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
REDIS_URL=redis://localhost:6379
```

### Development Setup
1. Install dependencies:
   ```bash
   npm install  # Frontend dependencies
   pip install -r requirements.txt  # Backend dependencies
   ```

2. Set up the database:
   ```bash
   flask db upgrade
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Security Considerations
- Password hashing using bcrypt
- Session-based authentication
- CORS protection
- Input validation using Zod
- SQL injection prevention through ORM
- XSS protection

## Performance Optimizations
- React Query for efficient data fetching and caching
- Lazy loading of components
- Optimistic UI updates
- Background job processing with Redis
- Database indexing
