# College Appointment Booking System

## Project Overview
The College Appointment Booking System is designed to facilitate the scheduling of appointments between students and professors. Professors can specify their availability, manage their bookings, and cancel appointments if necessary. Students can authenticate themselves, view available slots, and book appointments with professors.

The system includes the following features:
- **Authentication**: Secure login and registration for both students and professors using JWT.
- **Availability Management**: Professors can create, manage and cancel time slots.
- **Booking Management**: Students can view available slots and book appointments with professors.

## Setup
1. Clone repository
2. Run `npm install`
3. Create a MongoDB database and configure the connection
4. Set environment variables

## Environment Variables
- MONGODB_URI
- JWT_SECRET
- PORT (Default: 5000)

## API Endpoints
### Authentication
- POST /api/auth/register {name, email, password, role}
- POST /api/auth/login {email, password}
- POST /api/auth/logout

### For students
- GET /api/students/listavailableprofessors {studentId, professorId(optional), date(optional)}
- POST /api/students/bookslot {studentId, professorId, date, timeSlot}
- GET /api/students/viewbookedslots {studentId}

### For professors
- POST /api/professors/createavailability {professorId, date, timeSlots}
- GET /api/professors/viewbookedslots {professorId}
- DELETE /api/professors/cancelappointment {professorId, appointmentId}

**Note**: All API endpoints return appropriate status codes: 200 or 201 for success, and 400, 404, or 500 for various errors.

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Postman
- Newman

## Security
- JWT authentication
- Password hashing with Bcrypt

## Testing Instructions
Run test using Newman
Command: npm test

## Test Flow Description
Student A1 authenticates by signing up to access the system.
Professor P1 authenticates by signing up to access the system.
Professor P1 specifies which time slots he is free for appointments.
Student A1 views available time slots for Professor P1.
Student A1 books an appointment with Professor P1 for time T1.
Student A2 authenticates by signing up to access the system.
Student A2 books an appointment with Professor P1 for time T2.
Professor P1 cancels the appointment with Student A1.
Student A1 checks their appointments and realizes they do not have any pending appointments.
