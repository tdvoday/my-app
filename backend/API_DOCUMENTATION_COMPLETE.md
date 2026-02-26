# Online Doctor Appointment System - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/MMA301
JWT_SECRET=secret123
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://localhost:3000
```

---

## Authentication Endpoints

### 1. Register

**POST** `/auth/register`

- **Description**: Create a new patient account
- **Authentication**: No
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

- **Response**: User object with ID and email verification link sent

### 2. Login

**POST** `/auth/login`

- **Description**: Authenticate user and get JWT token
- **Authentication**: No
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**: JWT token and user object

### 3. Verify Email

**POST** `/auth/verify-email`

- **Description**: Verify email address using token from registration email
- **Authentication**: No
- **Request Body**:

```json
{
  "token": "verification-token-from-email"
}
```

- **Response**: Confirmation of email verification

### 4. Forgot Password

**POST** `/auth/forgot-password`

- **Description**: Request password reset email
- **Authentication**: No
- **Request Body**:

```json
{
  "email": "john@example.com"
}
```

- **Response**: Confirmation of reset email sent

### 5. Reset Password

**POST** `/auth/reset-password`

- **Description**: Reset password using token from email
- **Authentication**: No
- **Request Body**:

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

- **Response**: Confirmation of password reset

### 6. Assign Doctor Role

**POST** `/auth/assign-doctor`

- **Description**: Upgrade patient account to doctor (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "userId": "user-id",
  "specialty": "Cardiology",
  "hospital": "City Hospital",
  "phone": "0987654321",
  "certificate": "MD Certificate Number",
  "experience": 10,
  "bio": "Doctor biography"
}
```

- **Response**: Updated user object with doctor role

---

## Doctor Endpoints

### 1. Get All Doctors

**GET** `/doctors`

- **Description**: Get list of all active doctors with filtering
- **Authentication**: No
- **Query Parameters**:
  - `specialty` (optional): Filter by specialty
  - `departmentId` (optional): Filter by department
- **Response**: Array of doctor objects

### 2. Get Doctor by ID

**GET** `/doctors/:id`

- **Description**: Get detailed information about a specific doctor
- **Authentication**: No
- **Response**: Doctor object with full details

### 3. Update Doctor Info

**PUT** `/doctors/:id`

- **Description**: Update doctor information (Doctor or Admin only)
- **Authentication**: Yes
- **Request Body**:

```json
{
  "specialty": "Neurology",
  "hospital": "New Hospital",
  "bio": "Updated bio",
  "certificate": "New certificate",
  "experience": 12,
  "avatar": "avatar-url"
}
```

- **Response**: Updated doctor object

### 4. Rate Doctor

**POST** `/doctors/:id/rate`

- **Description**: Submit a rating for a doctor (Patient only)
- **Authentication**: Yes (Patient)
- **Request Body**:

```json
{
  "rating": 4.5
}
```

- **Response**: Confirmation of rating

### 5. Deactivate Doctor

**PATCH** `/doctors/:id/deactivate`

- **Description**: Deactivate a doctor account (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Updated doctor object with inactive status

### 6. Activate Doctor

**PATCH** `/doctors/:id/activate`

- **Description**: Activate a doctor account (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Updated doctor object with active status

---

## Department Endpoints

### 1. Get All Departments

**GET** `/departments`

- **Description**: Get list of all active departments
- **Authentication**: No
- **Response**: Array of department objects

### 2. Get Department by ID

**GET** `/departments/:id`

- **Description**: Get detailed information about a department
- **Authentication**: No
- **Response**: Department object

### 3. Create Department

**POST** `/departments`

- **Description**: Create a new department (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "code": "CARDIO",
  "name": "Cardiology",
  "description": "Heart and cardiovascular diseases"
}
```

- **Response**: Created department object

### 4. Update Department

**PUT** `/departments/:id`

- **Description**: Update department information (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

- **Response**: Updated department object

### 5. Delete Department

**DELETE** `/departments/:id`

- **Description**: Delete a department (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Deleted department object

---

## Schedule Endpoints

### 1. Get Available Schedules

**GET** `/schedules/available/:doctorId`

- **Description**: Get available appointment slots for a doctor
- **Authentication**: No
- **Query Parameters**:
  - `date` (optional): Filter by specific date
- **Response**: Array of available schedules with `available` field

### 2. Get Doctor Schedules

**GET** `/schedules/doctor/:doctorId`

- **Description**: Get all schedules for a specific doctor
- **Authentication**: No
- **Response**: Array of all doctor schedules

### 3. Create Schedule

**POST** `/schedules`

- **Description**: Create appointment schedule for a doctor (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "doctorId": "doctor-id",
  "departmentId": "department-id",
  "date": "2024-03-15",
  "startTime": "09:00",
  "endTime": "12:00",
  "capacity": 5
}
```

- **Response**: Created schedule object

### 4. Update Schedule

**PUT** `/schedules/:id`

- **Description**: Update schedule details (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "capacity": 8,
  "status": "inactive"
}
```

- **Response**: Updated schedule object

### 5. Delete Schedule

**DELETE** `/schedules/:id`

- **Description**: Delete a schedule (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Deleted schedule object

---

## Appointment Endpoints

### 1. Create Appointment

**POST** `/appointments`

- **Description**: Book appointment with a doctor (Patient only)
- **Authentication**: Yes (Patient)
- **Request Body**:

```json
{
  "scheduleId": "schedule-id",
  "reason": "Regular checkup",
  "departmentId": "department-id"
}
```

- **Response**: Created appointment object

### 2. Get My Appointments

**GET** `/appointments/my`

- **Description**: Get all appointments for logged-in patient
- **Authentication**: Yes (Patient)
- **Query Parameters**:
  - `status` (optional): Filter by status
- **Response**: Array of patient's appointments

### 3. Get Doctor Appointments

**GET** `/appointments/doctor`

- **Description**: Get all appointments for logged-in doctor
- **Authentication**: Yes (Doctor)
- **Query Parameters**:
  - `status` (optional): Filter by status
- **Response**: Array of doctor's appointments

### 4. Update Appointment Status

**PUT** `/appointments/:appointmentId/status`

- **Description**: Update appointment status (Doctor or Admin)
- **Authentication**: Yes
- **Request Body**:

```json
{
  "status": "completed",
  "notes": "Diagnosis notes"
}
```

- **Response**: Updated appointment object

### 5. Cancel Appointment

**POST** `/appointments/:appointmentId/cancel`

- **Description**: Cancel an appointment (Patient or Doctor)
- **Authentication**: Yes
- **Response**: Updated appointment object with cancelled status

### 6. Get Appointment by ID

**GET** `/appointments/:appointmentId`

- **Description**: Get details of a specific appointment
- **Authentication**: Yes
- **Response**: Appointment object

### 7. Download Appointment PDF

**GET** `/appointments/:appointmentId/download-pdf`

- **Description**: Download appointment details as PDF
- **Authentication**: Yes
- **Response**: PDF file

---

## Payment Endpoints

### 1. Create VNPay URL

**POST** `/payments/create-vnpay-url`

- **Description**: Create payment URL for appointment (Patient only)
- **Authentication**: Yes (Patient)
- **Request Body**:

```json
{
  "appointmentId": "appointment-id",
  "amount": 500000,
  "orderInfo": "Payment for appointment"
}
```

- **Response**: Payment URL and transaction details

### 2. VNPay Callback

**GET** `/payments/vnpay-callback`

- **Description**: VNPay payment callback endpoint
- **Authentication**: No
- **Query Parameters**: VNPay response parameters
- **Response**: Redirect to success or failure page

### 3. Get Payment Status

**GET** `/payments/:appointmentId/status`

- **Description**: Get payment status for an appointment
- **Authentication**: Yes
- **Response**: Payment object

### 4. Get Payment History

**GET** `/payments`

- **Description**: Get payment history (Admin only)
- **Authentication**: Yes (Admin)
- **Query Parameters**:
  - `status` (optional): Filter by status
  - `patientId` (optional): Filter by patient
  - `startDate` (optional): Start date filter
  - `endDate` (optional): End date filter
- **Response**: Array of payments with statistics

### 5. Refund Payment

**POST** `/payments/:paymentId/refund`

- **Description**: Refund a payment (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "reason": "Patient requested cancellation"
}
```

- **Response**: Refunded payment object

### 6. Download Payment Invoice

**GET** `/payments/:paymentId/download-invoice`

- **Description**: Download payment invoice as PDF
- **Authentication**: Yes
- **Response**: PDF file

---

## Profile Endpoints

### 1. Get My Profile

**GET** `/profile/me`

- **Description**: Get logged-in user's profile
- **Authentication**: Yes
- **Response**: User object

### 2. Update My Profile

**PUT** `/profile/me`

- **Description**: Update logged-in user's profile
- **Authentication**: Yes
- **Request Body**:

```json
{
  "name": "Updated Name",
  "phone": "0123456789",
  "avatar": "avatar-url",
  "specialty": "Cardiology",
  "hospital": "Hospital Name"
}
```

- **Response**: Updated user object

### 3. Change Password

**POST** `/profile/change-password`

- **Description**: Change user password
- **Authentication**: Yes
- **Request Body**:

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

- **Response**: Confirmation message

### 4. Get All Users

**GET** `/profile`

- **Description**: Get all users (Admin only)
- **Authentication**: Yes (Admin)
- **Query Parameters**:
  - `role` (optional): Filter by role
  - `status` (optional): Filter by status
  - `search` (optional): Search by name, email, or phone
- **Response**: Array of user objects

### 5. Get User by ID

**GET** `/profile/:userId`

- **Description**: Get specific user details (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: User object

### 6. Update User

**PUT** `/profile/:userId`

- **Description**: Update user information (Admin only)
- **Authentication**: Yes (Admin)
- **Request Body**:

```json
{
  "name": "New Name",
  "status": "active",
  "role": "doctor"
}
```

- **Response**: Updated user object

### 7. Deactivate User

**PATCH** `/profile/:userId/deactivate`

- **Description**: Deactivate user account (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Updated user object

### 8. Activate User

**PATCH** `/profile/:userId/activate`

- **Description**: Activate user account (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Updated user object

### 9. Delete User

**DELETE** `/profile/:userId`

- **Description**: Delete user account (Admin only)
- **Authentication**: Yes (Admin)
- **Response**: Deleted user object

---

## Analytics Endpoints (Admin Only)

### 1. Get Dashboard Statistics

**GET** `/analytics/dashboard/statistics`

- **Description**: Get overall dashboard statistics
- **Authentication**: Yes (Admin)
- **Response**: Statistics object with users, appointments, payments data

### 2. Get Appointment Statistics

**GET** `/analytics/appointments/statistics`

- **Description**: Get appointment analytics
- **Authentication**: Yes (Admin)
- **Query Parameters**:
  - `startDate` (optional): Start date filter
  - `endDate` (optional): End date filter
  - `department` (optional): Filter by department
- **Response**: Appointment statistics by status, department, doctor

### 3. Get Revenue Statistics

**GET** `/analytics/revenue/statistics`

- **Description**: Get revenue analytics
- **Authentication**: Yes (Admin)
- **Query Parameters**:
  - `startDate` (optional): Start date filter
  - `endDate` (optional): End date filter
  - `method` (optional): Filter by payment method
- **Response**: Revenue data and daily breakdown

### 4. Get Doctor Performance

**GET** `/analytics/doctors/performance`

- **Description**: Get doctor performance metrics
- **Authentication**: Yes (Admin)
- **Query Parameters**:
  - `departmentId` (optional): Filter by department
- **Response**: Array of doctors with performance data

### 5. Get Patient Statistics

**GET** `/analytics/patients/statistics`

- **Description**: Get patient statistics and metrics
- **Authentication**: Yes (Admin)
- **Response**: Patient count, active patients, top departments

### 6. Get System Health

**GET** `/analytics/system/health`

- **Description**: Get system health and database status
- **Authentication**: Yes (Admin)
- **Response**: System status and collection counts

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Authentication Header

For authenticated endpoints, include JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

---

## Response Format

All successful API responses follow this format:

```json
{
  "message": "Description of successful operation",
  "data": {...},
  "count": 10
}
```

---

## Features Implemented

✅ User Authentication (Register, Login, Verify Email, Password Reset)
✅ Doctor Management (Create, Read, Update, Deactivate, Activate)
✅ Department Management
✅ Schedule Management
✅ Appointment Booking and Management
✅ Payment Processing (VNPay Integration)
✅ Email Notifications
✅ PDF Generation (Appointments & Invoices)
✅ Admin Analytics Dashboard
✅ User Profile Management
✅ Role-based Access Control
✅ Email Verification for new accounts

---

## Security Notes

1. All passwords are hashed using bcryptjs
2. JWT tokens expire after 7 days
3. Email verification tokens expire after 24 hours
4. Password reset tokens expire after 1 hour
5. Role-based middleware ensures authorization
6. CORS is enabled for cross-origin requests
7. Sensitive data (passwords) is never returned in responses
