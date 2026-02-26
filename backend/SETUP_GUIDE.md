# Online Doctor Appointment System - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Git

## Installation Steps

### 1. Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

This will install all required packages:

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemailer` - Email sending
- `joi` - Data validation
- `multer` - File uploads
- `pdfkit` - PDF generation
- `moment-timezone` - Date/time handling

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/MMA301

# JWT Configuration
JWT_SECRET=secret123

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SECURE=false

# Client URL for Email Links
CLIENT_URL=http://localhost:3000

# VNPay Configuration
VNPAY_MERCHANT=your-merchant-code
VNPAY_MERCHANT_PASSWORD=your-merchant-password
VNPAY_API_URL=https://sandbox.vnpayment.vn
```

**Important**:

- Replace `EMAIL_USER` and `EMAIL_PASSWORD` with your actual Gmail credentials
- For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833)
- Update VNPay credentials with your merchant information

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### 4. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server should start on `http://localhost:5000`

You should see:

```
MongoDB Connected
Server running on port 5000
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── appointmentController.js
│   │   ├── paymentController.js
│   │   ├── doctorController.js
│   │   ├── departmentController.js
│   │   ├── scheduleController.js
│   │   ├── profileController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access control
│   ├── model/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Payment.js
│   │   ├── Schedule.js
│   │   ├── Department.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── scheduleRoutes.js
│   │   ├── profileRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   ├── emailService.js        # Email utilities
│   │   └── pdfService.js          # PDF generation utilities
│   └── server.js                  # Main server file
├── uploads/
│   └── pdfs/                      # PDF storage directory
├── .env                           # Environment variables
├── package.json
└── package-lock.json
```

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/assign-doctor` - Assign doctor role (Admin)

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor info
- `PATCH /api/doctors/:id/deactivate` - Deactivate doctor (Admin)
- `PATCH /api/doctors/:id/activate` - Activate doctor (Admin)

### Departments

- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)
- `DELETE /api/departments/:id` - Delete department (Admin)

### Schedules

- `GET /api/schedules/available/:doctorId` - Get available slots
- `GET /api/schedules/doctor/:doctorId` - Get doctor schedules
- `POST /api/schedules` - Create schedule (Admin)
- `PUT /api/schedules/:id` - Update schedule (Admin)
- `DELETE /api/schedules/:id` - Delete schedule (Admin)

### Appointments

- `POST /api/appointments` - Book appointment (Patient)
- `GET /api/appointments/my` - Get my appointments (Patient)
- `GET /api/appointments/doctor` - Get doctor appointments (Doctor)
- `PUT /api/appointments/:id/status` - Update status (Doctor/Admin)
- `POST /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/:id/download-pdf` - Download PDF

### Payments

- `POST /api/payments/create-vnpay-url` - Create payment URL
- `GET /api/payments/vnpay-callback` - VNPay callback
- `GET /api/payments/:appointmentId/status` - Get payment status
- `GET /api/payments` - Payment history (Admin)
- `POST /api/payments/:paymentId/refund` - Refund payment (Admin)
- `GET /api/payments/:paymentId/download-invoice` - Download invoice

### Profile

- `GET /api/profile/me` - Get my profile
- `PUT /api/profile/me` - Update my profile
- `POST /api/profile/change-password` - Change password
- `GET /api/profile` - Get all users (Admin)
- `GET /api/profile/:userId` - Get user details (Admin)
- `PUT /api/profile/:userId` - Update user (Admin)

### Analytics (Admin Only)

- `GET /api/analytics/dashboard/statistics` - Dashboard stats
- `GET /api/analytics/appointments/statistics` - Appointment stats
- `GET /api/analytics/revenue/statistics` - Revenue stats
- `GET /api/analytics/doctors/performance` - Doctor performance
- `GET /api/analytics/patients/statistics` - Patient stats
- `GET /api/analytics/system/health` - System health

## Testing the API

You can use Postman or similar tools to test the API:

1. **Register a new user**

```
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

2. **Verify email** (use token from email or check database)

```
POST http://localhost:5000/api/auth/verify-email
{
  "token": "received-token"
}
```

3. **Login**

```
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

4. Use the returned token in Authorization header:

```
Authorization: Bearer <token>
```

## Database Setup

### Create Initial Admin Account

You can create an admin account directly in MongoDB:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "(bcryptjs hashed password)",
  role: "admin",
  phone: "0123456789",
  status: "active",
  isEmailVerified: true,
});
```

Or use the API and manually update the role in the database.

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB service is running
- Check MONGO_URI in .env file
- Verify MongoDB is listening on the correct port

### Email Not Sending

- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure App Password is used, not regular password
- Check email configuration in emailService.js
- Verify email account has "Less secure app access" enabled (if applicable)

### JWT Token Issues

- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired (expires in 7 days)

### Port Already in Use

- Change PORT in .env file
- Or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## Next Steps

1. Set up the frontend application
2. Connect frontend to backend API
3. Test all workflows end-to-end
4. Configure VNPay payment gateway with actual credentials
5. Set up email templates
6. Deploy to production server

## Additional Resources

- MongoDB Documentation: https://docs.mongodb.com
- Express.js Documentation: https://expressjs.com
- JWT Documentation: https://jwt.io
- VNPay Documentation: https://sandbox.vnpayment.vn

## Support

For issues or questions, please refer to:

- API Documentation: `API_DOCUMENTATION_COMPLETE.md`
- Project Requirements: `PROJECT_REQUIREMENTS.md`

---

**Last Updated**: February 26, 2024
**Version**: 1.0.0 - Complete Implementation
