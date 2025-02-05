# Clinic360 API Documentation

## Authentication

### Register New User
```http
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure_password",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "patient",
  "specialization": null  // Required only for doctors
}

Response 201:
{
  "id": 1,
  "username": "johndoe",
  "role": "patient",
  "email": "john@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-02-04T12:00:00Z"
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure_password"
}

Response 200:
{
  "id": 1,
  "username": "johndoe",
  "role": "patient",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

## Appointments

### Book Appointment
```http
POST /api/appointments
Content-Type: application/json

{
  "doctorId": 2,
  "startTime": "2025-02-10T09:00:00Z",
  "endTime": "2025-02-10T09:30:00Z",
  "reason": "Annual checkup"
}

Response 201:
{
  "id": 1,
  "doctorId": 2,
  "patientId": 1,
  "startTime": "2025-02-10T09:00:00Z",
  "endTime": "2025-02-10T09:30:00Z",
  "reason": "Annual checkup",
  "status": "scheduled",
  "emailStatus": "sent"
}
```

### Get User Appointments
```http
GET /api/appointments

Response 200:
[
  {
    "id": 1,
    "startTime": "2025-02-10T09:00:00Z",
    "endTime": "2025-02-10T09:30:00Z",
    "reason": "Annual checkup",
    "status": "scheduled",
    "doctor": {
      "id": 2,
      "fullName": "Dr. Jane Smith",
      "specialization": "General Practice"
    },
    "patient": {
      "id": 1,
      "fullName": "John Doe"
    }
  }
]
```

## Medical Records

### Create Medical Record
```http
POST /api/records
Content-Type: application/json

{
  "patientId": 1,
  "diagnosis": "Common cold",
  "prescription": "Rest and fluids",
  "notes": "Follow up in 1 week if symptoms persist"
}

Response 201:
{
  "id": 1,
  "patientId": 1,
  "doctorId": 2,
  "diagnosis": "Common cold",
  "prescription": "Rest and fluids",
  "notes": "Follow up in 1 week if symptoms persist",
  "createdAt": "2025-02-04T12:30:00Z"
}
```

### Get Patient Records
```http
GET /api/records/1

Response 200:
[
  {
    "id": 1,
    "diagnosis": "Common cold",
    "prescription": "Rest and fluids",
    "notes": "Follow up in 1 week if symptoms persist",
    "createdAt": "2025-02-04T12:30:00Z",
    "doctor": {
      "id": 2,
      "fullName": "Dr. Jane Smith",
      "specialization": "General Practice"
    }
  }
]
```

## Doctor Schedule

### Set Schedule
```http
POST /api/schedule
Content-Type: application/json

{
  "dayOfWeek": 1,  // Monday = 1
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true
}

Response 201:
{
  "id": 1,
  "doctorId": 2,
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true
}
```

### Get Available Doctors
```http
GET /api/doctors

Response 200:
[
  {
    "id": 2,
    "fullName": "Dr. Jane Smith",
    "specialization": "General Practice",
    "email": "jane.smith@clinic360.com"
  }
]
```

## Error Responses

### Validation Error
```http
Status: 400 Bad Request
{
  "error": "Invalid input: username is required"
}
```

### Authentication Error
```http
Status: 401 Unauthorized
{
  "message": "Unauthorized"
}
```

### Permission Error
```http
Status: 403 Forbidden
{
  "message": "Only doctors can set schedules"
}
```

### Not Found
```http
Status: 404 Not Found
{
  "message": "Resource not found"
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Versioning
Current API version: v1
All endpoints are prefixed with /api/

## Best Practices
1. Always include authentication token in headers
2. Use appropriate HTTP methods
3. Handle errors gracefully
4. Validate input before sending
5. Use appropriate content types
