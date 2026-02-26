# 📚 API Documentation

## Backend URL

```
Base URL: http://localhost:5000/api
```

---

## 1. Authentication API

### 1.1 Register (Đăng Ký)

**Endpoint:**

```
POST /api/auth/register
```

**Request:**

```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0912345678"
}
```

**Response (201 Created):**

```javascript
{
  "success": true,
  "message": "Register success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0912345678",
      "role": "patient",
      "status": "active",
      "createdAt": "2026-02-26T10:00:00Z"
    }
  }
}
```

**Error Response (400):**

```javascript
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 1.2 Login (Đăng Nhập)

**Endpoint:**

```
POST /api/auth/login
```

**Request:**

```javascript
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Login success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "phone": "0912345678"
    }
  }
}
```

**Error Response (400):**

```javascript
{
  "success": false,
  "message": "Email not found"
}
```

**How to use JWT Token:**

```
Header: Authorization: Bearer <token>
```

---

### 1.3 Assign Doctor Role (Cấp Quyền Doctor)

**Endpoint:**

```
POST /api/auth/assign-doctor
```

**Required:** Admin token in header

```
Authorization: Bearer <admin_token>
```

**Request:**

```javascript
{
  "userId": "507f1f77bcf86cd799439011",
  "specialty": "Cardiology",
  "certificate": "BS, MD",
  "experience": 5,
  "hospital": "City Hospital"
}
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Doctor role assigned successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Doe",
      "email": "john@example.com",
      "role": "doctor",
      "specialty": "Cardiology",
      "certificate": "BS, MD",
      "experience": 5,
      "hospital": "City Hospital"
    }
  }
}
```

---

## 2. Department API

### 2.1 Get All Departments (Xem Danh Sách Khoa)

**Endpoint:**

```
GET /api/departments
Authorization: Not required
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": {
    "departments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "code": "IC",
        "name": "Nội",
        "description": "Khám chữa bệnh nội khoa"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "code": "SG",
        "name": "Ngoại",
        "description": "Phẫu thuật"
      }
    ]
  }
}
```

---

### 2.2 Create Department (Thêm Khoa) - Admin Only

**Endpoint:**

```
POST /api/departments
Authorization: Bearer <admin_token>
```

**Request:**

```javascript
{
  "code": "IC",
  "name": "Nội",
  "description": "Khám chữa bệnh nội khoa"
}
```

**Response (201 Created):**

```javascript
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "department": {
      "_id": "507f1f77bcf86cd799439012",
      "code": "IC",
      "name": "Nội",
      "description": "Khám chữa bệnh nội khoa"
    }
  }
}
```

---

## 3. Appointment API

### 3.1 Create Appointment (Đặt Lịch) - Patient Only

**Endpoint:**

```
POST /api/appointments
Authorization: Bearer <patient_token>
```

**Request:**

```javascript
{
  "doctorId": "507f1f77bcf86cd799439014",
  "scheduleId": "507f1f77bcf86cd799439015",
  "date": "2026-03-15T00:00:00Z",
  "time": "09:00",
  "reason": "Khám tổng quát"
}
```

**Response (201 Created):**

```javascript
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "appointment": {
      "_id": "507f1f77bcf86cd799439016",
      "patientId": "507f1f77bcf86cd799439011",
      "doctorId": "507f1f77bcf86cd799439014",
      "date": "2026-03-15T00:00:00Z",
      "time": "09:00",
      "reason": "Khám tổng quát",
      "appointmentStatus": "pending",
      "paymentStatus": "pending",
      "fee": 500000,
      "createdAt": "2026-02-26T10:00:00Z"
    }
  }
}
```

---

### 3.2 Get My Appointments (Xem Lịch Của Mình) - Patient

**Endpoint:**

```
GET /api/appointments/my
Authorization: Bearer <patient_token>
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": {
    "appointments": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "doctorId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Dr. Jane Smith",
          "specialty": "Cardiology",
          "hospital": "City Hospital"
        },
        "date": "2026-03-15T00:00:00Z",
        "time": "09:00",
        "reason": "Khám tổng quát",
        "appointmentStatus": "confirmed",
        "paymentStatus": "paid",
        "fee": 500000
      }
    ]
  }
}
```

---

### 3.3 Get Doctor Appointments (Xem Lịch Bệnh Nhân) - Doctor

**Endpoint:**

```
GET /api/appointments/doctor
Authorization: Bearer <doctor_token>
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Doctor appointments retrieved successfully",
  "data": {
    "appointments": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "patientId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "0912345678"
        },
        "date": "2026-03-15T00:00:00Z",
        "time": "09:00",
        "reason": "Khám tổng quát",
        "appointmentStatus": "confirmed",
        "paymentStatus": "paid"
      }
    ]
  }
}
```

---

### 3.4 Cancel Appointment (Hủy Lịch) - Patient

**Endpoint:**

```
PUT /api/appointments/:appointmentId/cancel
Authorization: Bearer <patient_token>
```

**Request:**

```javascript
{
  "reason": "Lý do hủy"
}
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "appointment": {
      "_id": "507f1f77bcf86cd799439016",
      "appointmentStatus": "cancelled",
      "cancelReason": "Lý do hủy"
    }
  }
}
```

---

## 4. Payment API

### 4.1 Create VNPay Payment URL

**Endpoint:**

```
POST /api/payments/create-vnpay-url
Authorization: Bearer <patient_token>
```

**Request:**

```javascript
{
  "appointmentId": "507f1f77bcf86cd799439016",
  "amount": 500000,
  "orderInfo": "Thanh toán lịch khám bệnh"
}
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "message": "VNPay URL created successfully",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paygate?...",
    "transactionCode": "abcd1234"
  }
}
```

---

### 4.2 VNPay Callback (Xử Lý Kết Quả Thanh Toán)

**Endpoint:**

```
GET /api/payments/vnpay-callback?vnp_ResponseCode=00&vnp_TransactionNo=...&...
```

**Internal Processing:**

1. Verify chữ ký VNPay
2. Nếu thành công (vnp_ResponseCode = 00):
   - Cập nhật paymentStatus = "paid"
   - Cập nhật appointmentStatus = "confirmed"
   - Gửi thông báo cho patient & doctor
3. Nếu thất bại:
   - Cập nhật paymentStatus = "failed"
   - Appointment vẫn là "pending"

**Success Response:**

```
Redirect to: https://app.example.com/payment-success?appointmentId=507f1f77bcf86cd799439016
```

**Failure Response:**

```
Redirect to: https://app.example.com/payment-failed?appointmentId=507f1f77bcf86cd799439016
```

---

### 4.3 Get Payment Status (Xem Trạng Thái Thanh Toán)

**Endpoint:**

```
GET /api/payments/:appointmentId
Authorization: Bearer <patient_token> or <doctor_token>
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "data": {
    "payment": {
      "_id": "507f1f77bcf86cd799439017",
      "appointmentId": "507f1f77bcf86cd799439016",
      "amount": 500000,
      "status": "paid",
      "transactionCode": "abcd1234",
      "transactionDate": "2026-02-26T10:05:00Z",
      "method": "vnpay"
    }
  }
}
```

---

## 5. Schedule API

### 5.1 Get Available Schedules (Xem Lịch Còn Trống)

**Endpoint:**

```
GET /api/schedules/available/:doctorId?date=2026-03-15
Authorization: Not required
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "data": {
    "schedules": [
      {
        "_id": "507f1f77bcf86cd799439018",
        "date": "2026-03-15T00:00:00Z",
        "startTime": "08:00",
        "endTime": "09:00",
        "capacity": 1,
        "booked": 0,
        "available": true
      },
      {
        "_id": "507f1f77bcf86cd799439019",
        "date": "2026-03-15T00:00:00Z",
        "startTime": "09:00",
        "endTime": "10:00",
        "capacity": 1,
        "booked": 0,
        "available": true
      }
    ]
  }
}
```

---

### 5.2 Create Schedule (Tạo Lịch Khám) - Admin Only

**Endpoint:**

```
POST /api/schedules
Authorization: Bearer <admin_token>
```

**Request:**

```javascript
{
  "doctorId": "507f1f77bcf86cd799439014",
  "departmentId": "507f1f77bcf86cd799439012",
  "date": "2026-03-15T00:00:00Z",
  "startTime": "08:00",
  "endTime": "09:00",
  "capacity": 1
}
```

**Response (201 Created):**

```javascript
{
  "success": true,
  "message": "Schedule created successfully",
  "data": {
    "schedule": {
      "_id": "507f1f77bcf86cd799439018",
      "doctorId": "507f1f77bcf86cd799439014",
      "date": "2026-03-15T00:00:00Z",
      "startTime": "08:00",
      "endTime": "09:00",
      "capacity": 1,
      "booked": 0
    }
  }
}
```

---

## 6. Doctor API

### 6.1 Get All Doctors (Xem Danh Sách Bác Sĩ)

**Endpoint:**

```
GET /api/doctors?departmentId=507f1f77bcf86cd799439012&specialty=Cardiology
Authorization: Not required
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "data": {
    "doctors": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Dr. Jane Smith",
        "specialty": "Cardiology",
        "certificate": "BS, MD",
        "experience": 5,
        "hospital": "City Hospital",
        "rating": 4.8,
        "avatar": "https://...",
        "departmentId": "507f1f77bcf86cd799439012"
      }
    ]
  }
}
```

---

### 6.2 Get Doctor Detail (Xem Chi Tiết Bác Sĩ)

**Endpoint:**

```
GET /api/doctors/:doctorId
Authorization: Not required
```

**Response (200 OK):**

```javascript
{
  "success": true,
  "data": {
    "doctor": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Dr. Jane Smith",
      "email": "jane@hospital.com",
      "phone": "0987654321",
      "specialty": "Cardiology",
      "certificate": "BS, MD",
      "experience": 5,
      "hospital": "City Hospital",
      "bio": "Experienced cardiologist",
      "rating": 4.8,
      "avatar": "https://...",
      "status": "active"
    }
  }
}
```

---

## 7. Error Codes

| Status Code | Message               | Description               |
| ----------- | --------------------- | ------------------------- |
| **200**     | OK                    | Success                   |
| **201**     | Created               | Resource created          |
| **400**     | Bad Request           | Invalid input             |
| **401**     | Unauthorized          | No token or invalid token |
| **403**     | Forbidden             | Access denied (role)      |
| **404**     | Not Found             | Resource not found        |
| **500**     | Internal Server Error | Server error              |

---

## 8. Common Error Responses

### Authentication Error

```javascript
{
  "success": false,
  "message": "No token provided"
}
// Status: 401
```

### Authorization Error

```javascript
{
  "success": false,
  "message": "Access denied"
}
// Status: 403
```

### Validation Error

```javascript
{
  "success": false,
  "message": "Email already exists"
}
// Status: 400
```

### Not Found Error

```javascript
{
  "success": false,
  "message": "Doctor not found"
}
// Status: 404
```

---

## 9. Request Headers

**All requests (except public endpoints):**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 10. Example Flow

### Complete Appointment Booking Flow

```
1. REGISTER
   POST /api/auth/register
   └─> Nhận user với role "patient"

2. LOGIN
   POST /api/auth/login
   └─> Nhận JWT token

3. VIEW DEPARTMENTS
   GET /api/departments
   └─> Xem danh sách khoa

4. VIEW DOCTORS
   GET /api/doctors?departmentId=...
   └─> Xem bác sĩ theo khoa

5. VIEW DOCTOR DETAIL
   GET /api/doctors/:doctorId
   └─> Xem chi tiết bác sĩ

6. VIEW AVAILABLE SCHEDULES
   GET /api/schedules/available/:doctorId
   └─> Xem lịch khám còn trống

7. CREATE APPOINTMENT
   POST /api/appointments
   └─> Đặt lịch khám (status: "pending")

8. CREATE PAYMENT
   POST /api/payments/create-vnpay-url
   └─> Nhận URL thanh toán VNPay

9. REDIRECT TO VNPAY
   Frontend redirect user to VNPAY URL
   └─> User thực hiện thanh toán

10. VNPAY CALLBACK
    GET /api/payments/vnpay-callback
    └─> Hệ thống cập nhật appointment status

11. CHECK STATUS
    GET /api/appointments/my
    └─> Xem appointment đã được confirmed
```

---

**API Documentation - Version 1.0**
**Last Updated: 26/02/2026**
