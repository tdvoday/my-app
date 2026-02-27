# Admin Permissions Test Guide

## Setup

### Postman Environment Variables
```
BASE_URL: http://localhost:5000
ADMIN_EMAIL: admin@example.com
ADMIN_PASSWORD: admin123
ADMIN_TOKEN: (capture sau khi login)
PATIENT_EMAIL: patient1@example.com
PATIENT_PASSWORD: password123
DOCTOR_EMAIL: doctor1@example.com
DOCTOR_PASSWORD: password123
PATIENT_ID: (capture sau khi register patient)
DOCTOR_ID: (capture sau khi assign doctor role)
DEPARTMENT_ID: (capture sau khi create department)
SCHEDULE_ID: (capture sau khi create schedule)
PAYMENT_ID: (capture sau khi create payment)
```

---

## 1. Admin Login

```
POST {{BASE_URL}}/api/auth/login

Body:
{
  "email": "{{ADMIN_EMAIL}}",
  "password": "{{ADMIN_PASSWORD}}"
}

Expected: 200 OK
Response:
{
  "message": "Login successful",
  "token": "...",
  "user": {
    "id": "...",
    "role": "admin",
    "email": "admin@example.com"
  }
}

Postman Test:
var jsonData = pm.response.json();
pm.environment.set("ADMIN_TOKEN", jsonData.token);
pm.test("Admin login successful", function() {
    pm.expect(jsonData.user.role).to.equal("admin");
});
```

---

## 2. User Management

### 2.1. Get All Users (Admin Only)

```
GET {{BASE_URL}}/api/profile

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - Trả về danh sách tất cả users

Test:
pm.test("Can get all users", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().users).to.be.an('array');
});
```

### 2.2. Get User By ID (Admin Only)

```
GET {{BASE_URL}}/api/profile/{{PATIENT_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - Trả về thông tin user

Test:
pm.test("Can get user by ID", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 2.3. Update User (Admin Only)

```
PUT {{BASE_URL}}/api/profile/{{PATIENT_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "name": "Nguyễn Văn B",
  "phone": "0987654322",
  "status": "active"
}

Expected: 200 OK - Update thành công

Test:
pm.test("Admin can update user", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().user.name).to.equal("Nguyễn Văn B");
});
```

### 2.4. Deactivate User (Admin Only)

```
PATCH {{BASE_URL}}/api/profile/{{PATIENT_ID}}/deactivate

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - User deactivated

Test:
pm.test("Admin can deactivate user", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().user.status).to.equal("inactive");
});
```

### 2.5. Activate User (Admin Only)

```
PATCH {{BASE_URL}}/api/profile/{{PATIENT_ID}}/activate

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - User activated

Test:
pm.test("Admin can activate user", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().user.status).to.equal("active");
});
```

### 2.6. Delete User (Admin Only)

```
DELETE {{BASE_URL}}/api/profile/{{PATIENT_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - User deleted

Test:
pm.test("Admin can delete user", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 3. Doctor Management

### 3.1. Assign Doctor Role (Admin Only)

```
POST {{BASE_URL}}/api/auth/assign-doctor

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "userId": "{{PATIENT_ID}}",
  "specialty": "Nội",
  "hospital": "Bệnh viện Đại học Y",
  "phone": "0987654321",
  "certificate": "BS.CKII",
  "experience": 5,
  "bio": "Bác sĩ chuyên khoa Nội"
}

Expected: 200 OK - Role assigned

Postman Test:
var jsonData = pm.response.json();
pm.environment.set("DOCTOR_ID", jsonData.user.id);
pm.test("Admin can assign doctor role", function() {
    pm.expect(jsonData.user.role).to.equal("doctor");
});
```

### 3.2. Deactivate Doctor (Admin Only)

```
PATCH {{BASE_URL}}/api/doctors/{{DOCTOR_ID}}/deactivate

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - Doctor deactivated

Test:
pm.test("Admin can deactivate doctor", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().user.status).to.equal("inactive");
});
```

### 3.3. Activate Doctor (Admin Only)

```
PATCH {{BASE_URL}}/api/doctors/{{DOCTOR_ID}}/activate

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - Doctor activated

Test:
pm.test("Admin can activate doctor", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().user.status).to.equal("active");
});
```

### 3.4. Update Doctor Info (Admin Only - or self)

```
PUT {{BASE_URL}}/api/doctors/{{DOCTOR_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "specialty": "Ngoại",
  "hospital": "Bệnh viện Trung Ương",
  "bio": "Updated bio"
}

Expected: 200 OK

Test:
pm.test("Admin can update doctor info", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 4. Department Management

### 4.1. Create Department (Admin Only)

```
POST {{BASE_URL}}/api/departments

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "code": "NOI",
  "name": "Khoa Nội",
  "description": "Khoa khám bệnh Nội"
}

Expected: 201 Created

Postman Test:
var jsonData = pm.response.json();
pm.environment.set("DEPARTMENT_ID", jsonData.department._id);
pm.test("Admin can create department", function() {
    pm.expect(pm.response.code).to.equal(201);
});
```

### 4.2. Update Department (Admin Only)

```
PUT {{BASE_URL}}/api/departments/{{DEPARTMENT_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "name": "Khoa Nội - Updated",
  "description": "Updated description"
}

Expected: 200 OK

Test:
pm.test("Admin can update department", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 4.3. Delete Department (Admin Only)

```
DELETE {{BASE_URL}}/api/departments/{{DEPARTMENT_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can delete department", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 5. Schedule Management

### 5.1. Create Schedule (Admin Only)

```
POST {{BASE_URL}}/api/schedules

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "doctorId": "{{DOCTOR_ID}}",
  "departmentId": "{{DEPARTMENT_ID}}",
  "date": "2026-03-15T00:00:00Z",
  "startTime": "08:00",
  "endTime": "12:00",
  "capacity": 10
}

Expected: 201 Created

Postman Test:
var jsonData = pm.response.json();
pm.environment.set("SCHEDULE_ID", jsonData.schedule._id);
pm.test("Admin can create schedule", function() {
    pm.expect(pm.response.code).to.equal(201);
});
```

### 5.2. Update Schedule (Admin Only)

```
PUT {{BASE_URL}}/api/schedules/{{SCHEDULE_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "capacity": 15,
  "status": "active"
}

Expected: 200 OK

Test:
pm.test("Admin can update schedule", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 5.3. Delete Schedule (Admin Only)

```
DELETE {{BASE_URL}}/api/schedules/{{SCHEDULE_ID}}

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can delete schedule", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 6. Payment Management

### 6.1. Get Payment History (Admin Only)

```
GET {{BASE_URL}}/api/payments

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK - Trả về danh sách thanh toán

Test:
pm.test("Admin can view payment history", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 6.2. Refund Payment (Admin Only)

```
POST {{BASE_URL}}/api/payments/{{PAYMENT_ID}}/refund

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "reason": "Customer request"
}

Expected: 200 OK

Test:
pm.test("Admin can refund payment", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 7. Analytics (Admin Only)

### 7.1. Dashboard Statistics

```
GET {{BASE_URL}}/api/analytics/dashboard/statistics

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Response:
{
  "totalPatients": 10,
  "totalDoctors": 5,
  "totalAdmins": 1,
  "pendingAppointments": 3,
  ...
}

Test:
pm.test("Admin can view dashboard statistics", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json()).to.have.property('totalPatients');
});
```

### 7.2. Appointment Statistics

```
GET {{BASE_URL}}/api/analytics/appointments/statistics

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can view appointment statistics", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 7.3. Revenue Statistics

```
GET {{BASE_URL}}/api/analytics/revenue/statistics

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can view revenue statistics", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 7.4. Doctor Performance

```
GET {{BASE_URL}}/api/analytics/doctors/performance

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can view doctor performance", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 7.5. Patient Statistics

```
GET {{BASE_URL}}/api/analytics/patients/statistics

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can view patient statistics", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 7.6. System Health

```
GET {{BASE_URL}}/api/analytics/system/health

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK

Test:
pm.test("Admin can view system health", function() {
    pm.expect(pm.response.code).to.equal(200);
});
```

---

## 8. Permission Denied Tests (Should Return 403)

### 8.1. Patient tries to access Admin endpoint

```
GET {{BASE_URL}}/api/profile

Headers:
Authorization: Bearer {{PATIENT_TOKEN}}

Expected: 403 Forbidden - Access Denied

Test:
pm.test("Patient cannot access admin endpoints", function() {
    pm.expect(pm.response.code).to.equal(403);
    pm.expect(pm.response.json().message).to.equal("Access denied");
});
```

### 8.2. Patient tries to assign doctor role

```
POST {{BASE_URL}}/api/auth/assign-doctor

Headers:
Authorization: Bearer {{PATIENT_TOKEN}}

Body:
{
  "userId": "...",
  "specialty": "...",
  "hospital": "..."
}

Expected: 403 Forbidden

Test:
pm.test("Patient cannot assign doctor role", function() {
    pm.expect(pm.response.code).to.equal(403);
});
```

### 8.3. Patient tries to view analytics

```
GET {{BASE_URL}}/api/analytics/dashboard/statistics

Headers:
Authorization: Bearer {{PATIENT_TOKEN}}

Expected: 403 Forbidden

Test:
pm.test("Patient cannot view analytics", function() {
    pm.expect(pm.response.code).to.equal(403);
});
```

---

## 9. cURL Commands

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get All Users
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Assign Doctor
```bash
curl -X POST http://localhost:5000/api/auth/assign-doctor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userId": "USER_ID",
    "specialty": "Nội",
    "hospital": "Bệnh viện Đại học Y",
    "phone": "0987654321",
    "certificate": "BS.CKII",
    "experience": 5,
    "bio": "Bác sĩ chuyên khoa"
  }'
```

### Create Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "code": "NOI",
    "name": "Khoa Nội",
    "description": "Khoa khám bệnh Nội"
  }'
```

### Create Schedule
```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "departmentId": "DEPARTMENT_ID",
    "date": "2026-03-15T00:00:00Z",
    "startTime": "08:00",
    "endTime": "12:00",
    "capacity": 10
  }'
```

### Deactivate User
```bash
curl -X PATCH http://localhost:5000/api/profile/USER_ID/deactivate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Activate User
```bash
curl -X PATCH http://localhost:5000/api/profile/USER_ID/activate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/profile/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### View Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/analytics/dashboard/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Summary: Admin Permissions

✅ **User Management:**
- Get all users
- Get user by ID
- Update user
- Deactivate user
- Activate user
- Delete user

✅ **Doctor Management:**
- Assign doctor role to user
- Update doctor info
- Deactivate doctor
- Activate doctor

✅ **Department Management:**
- Create department
- Update department
- Delete department

✅ **Schedule Management:**
- Create schedule
- Update schedule
- Delete schedule

✅ **Payment Management:**
- View payment history
- Refund payment

✅ **Analytics:**
- Dashboard statistics
- Appointment statistics
- Revenue statistics
- Doctor performance
- Patient statistics
- System health

❌ **Restrictions:**
- Cannot book appointments (patient only)
- Cannot rate doctors (patient only)
- Cannot create VNPay payment (patient only)

