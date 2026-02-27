# Postman Collection - Doctor Account Test

## Setup Postman Environment Variables

Tạo environment trong Postman với các variables sau:

```
BASE_URL: http://localhost:5000
PATIENT_EMAIL: doctor1@example.com
PATIENT_PASSWORD: password123
PATIENT_PHONE: 0987654321
ADMIN_EMAIL: admin@example.com
ADMIN_PASSWORD: admin123
ADMIN_TOKEN: (sẽ được set sau khi login)
PATIENT_ID: (sẽ được set sau khi register)
DOCTOR_TOKEN: (sẽ được set sau khi doctor login)
```

---

## Test Sequence

### 1. Register Patient Account

```
Request:
POST {{BASE_URL}}/api/auth/register

Body (raw JSON):
{
  "name": "Bác Sĩ Nguyễn",
  "email": "{{PATIENT_EMAIL}}",
  "password": "{{PATIENT_PASSWORD}}",
  "phone": "{{PATIENT_PHONE}}"
}

Tests (add this to capture userId):
var jsonData = pm.response.json();
pm.environment.set("PATIENT_ID", jsonData.user.id);
```

---

### 2. Admin Login

```
Request:
POST {{BASE_URL}}/api/auth/login

Body (raw JSON):
{
  "email": "{{ADMIN_EMAIL}}",
  "password": "{{ADMIN_PASSWORD}}"
}

Tests (add this to capture token):
var jsonData = pm.response.json();
pm.environment.set("ADMIN_TOKEN", jsonData.token);
```

---

### 3. Assign Doctor Role (Admin)

```
Request:
POST {{BASE_URL}}/api/auth/assign-doctor

Headers:
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

Body (raw JSON):
{
  "userId": "{{PATIENT_ID}}",
  "specialty": "Nội",
  "hospital": "Bệnh viện Đại học Y",
  "phone": "{{PATIENT_PHONE}}",
  "certificate": "BS.CKII",
  "experience": 5,
  "bio": "Bác sĩ chuyên khoa Nội giàu kinh nghiệm"
}
```

---

### 4. Doctor Login

```
Request:
POST {{BASE_URL}}/api/auth/login

Body (raw JSON):
{
  "email": "{{PATIENT_EMAIL}}",
  "password": "{{PATIENT_PASSWORD}}"
}

Tests (add this to capture token):
var jsonData = pm.response.json();
pm.environment.set("DOCTOR_TOKEN", jsonData.token);
pm.test("Doctor role verified", function () {
    pm.expect(jsonData.user.role).to.equal("doctor");
    pm.expect(jsonData.user.specialty).to.equal("Nội");
});
```

---

### 5. Get Doctor Profile (Verify)

```
Request:
GET {{BASE_URL}}/api/profile/me

Headers:
Authorization: Bearer {{DOCTOR_TOKEN}}

Expected Response:
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "...",
    "name": "Bác Sĩ Nguyễn",
    "email": "doctor1@example.com",
    "role": "doctor",
    "specialty": "Nội",
    "hospital": "Bệnh viện Đại học Y",
    "phone": "0987654321",
    "bio": "..."
  }
}
```

---

## cURL Commands (Alternative)

Nếu không dùng Postman, có thể dùng cURL:

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bác Sĩ Nguyễn",
    "email": "doctor1@example.com",
    "password": "password123",
    "phone": "0987654321"
  }'
```

### Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Assign Doctor

```bash
curl -X POST http://localhost:5000/api/auth/assign-doctor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "userId": "USER_ID_HERE",
    "specialty": "Nội",
    "hospital": "Bệnh viện Đại học Y",
    "phone": "0987654321",
    "certificate": "BS.CKII",
    "experience": 5,
    "bio": "Bác sĩ chuyên khoa Nội"
  }'
```

### Doctor Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor1@example.com",
    "password": "password123"
  }'
```

### Get Doctor Profile

```bash
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE"
```

---

## Expected Results

✅ Register: Status 201, user role = "patient"
✅ Admin Login: Status 200, token returned
✅ Assign Doctor: Status 200, user role = "doctor"
✅ Doctor Login: Status 200, token returned, role = "doctor"
✅ Get Profile: Status 200, user role = "doctor" + specialty info

---

## Common Issues & Solutions

### Issue: "Email already exists"

- Thay đổi email trong request

### Issue: "Invalid token" khi assign doctor

- Đảm bảo admin token được copy chính xác
- Token có thể hết hạn (7 days), login lại để lấy token mới

### Issue: "Please verify your email before logging in"

- Patient cần verify email trước, hoặc
- Cấu hình email service trong .env

### Issue: "Access denied" (403)

- Đảm bảo token là admin token, không phải patient
- Role của user trong token không đúng
