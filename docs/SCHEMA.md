# Clinic360 Database Schema Documentation

## Overview
The Clinic360 platform uses PostgreSQL as its primary database. Below is a detailed documentation of all database tables, their relationships, and key constraints.

## Tables

### users
Stores both patient and doctor information with role-based differentiation.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
    specialization VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Indexes:
- PRIMARY KEY (id)
- UNIQUE INDEX username_idx (username)
- INDEX role_idx (role)
```

### medical_records
Stores patient medical history and doctor notes.

```sql
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    doctor_id INTEGER NOT NULL REFERENCES users(id),
    diagnosis VARCHAR NOT NULL,
    prescription VARCHAR,
    notes VARCHAR,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Indexes:
- PRIMARY KEY (id)
- INDEX patient_id_idx (patient_id)
- INDEX doctor_id_idx (doctor_id)
```

### appointments
Manages scheduling between doctors and patients.

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    doctor_id INTEGER NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR NOT NULL,
    reason VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Indexes:
- PRIMARY KEY (id)
- INDEX patient_appointments_idx (patient_id, start_time)
- INDEX doctor_appointments_idx (doctor_id, start_time)
```

### doctor_schedule
Manages doctor availability and working hours.

```sql
CREATE TABLE doctor_schedule (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES users(id),
    day_of_week INTEGER NOT NULL,
    start_time VARCHAR NOT NULL,
    end_time VARCHAR NOT NULL,
    is_available BOOLEAN DEFAULT true
);

Indexes:
- PRIMARY KEY (id)
- INDEX doctor_schedule_idx (doctor_id, day_of_week)
```

## Relationships

### Users and Medical Records
- One-to-Many: A user (patient) can have multiple medical records
- One-to-Many: A user (doctor) can create multiple medical records

### Users and Appointments
- One-to-Many: A user (patient) can have multiple appointments
- One-to-Many: A user (doctor) can have multiple appointments

### Users and Doctor Schedule
- One-to-Many: A user (doctor) can have multiple schedule entries

## Constraints

### Users
- Username must be unique
- Password must be hashed before storage
- Role must be either 'patient' or 'doctor'
- Email must be valid format
- Specialization only required for doctors

### Medical Records
- Both patient_id and doctor_id must reference valid users
- Diagnosis cannot be empty
- Updated_at automatically updates on record modification

### Appointments
- End time must be after start time
- Status must be one of: 'scheduled', 'completed', 'cancelled'
- Cannot schedule overlapping appointments for same doctor or patient

### Doctor Schedule
- Day of week must be between 0 and 6 (Sunday to Saturday)
- End time must be after start time
- Time format must be HH:MM in 24-hour format

## Data Types

### VARCHAR Fields
- Username: Max 50 characters
- Password: Max 255 characters (hashed)
- Email: Max 255 characters
- Full Name: Max 100 characters
- Specialization: Max 100 characters
- Diagnosis: Max 500 characters
- Prescription: Max 1000 characters
- Notes: Max 2000 characters

### TIMESTAMP Fields
All timestamp fields are stored in UTC

### JSONB Fields
Attachments in medical_records stores structured data for file references:
```json
{
  "files": [
    {
      "name": "xray.jpg",
      "type": "image/jpeg",
      "url": "path/to/file",
      "uploadedAt": "2025-02-04T12:00:00Z"
    }
  ]
}
```

## Migrations
Database migrations are handled through Flask-SQLAlchemy
