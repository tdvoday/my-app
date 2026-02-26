# 🏥 Medical Appointment Booking System

Ứng dụng đặt lịch khám bệnh trực tuyến được xây dựng với **React Native** (Frontend) và **Node.js + Express + MongoDB** (Backend).

---

## 📋 Mục Lục

- [Tính Năng Chính](#-tính-năng-chính)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [API Endpoints](#-api-endpoints)
- [Tài Liệu](#-tài-liệu)

---

## 🎯 Tính Năng Chính

### 👤 Cho Patient (Bệnh Nhân)

- ✅ Đăng ký & Đăng nhập
- ✅ Xem danh sách khoa và bác sĩ
- ✅ Xem chi tiết thông tin bác sĩ
- ✅ Đặt lịch khám
- ✅ Thanh toán qua VNPay
- ✅ Xem lịch khám của mình

### 👨‍⚕️ Cho Doctor (Bác Sĩ)

- ✅ Đăng nhập hệ thống
- ✅ Xem lịch khám của mình
- ✅ Xem thông tin bệnh nhân
- ✅ Cập nhật trạng thái lịch khám

### 🔧 Cho Admin (Quản Trị Viên)

- ✅ Quản lý tài khoản người dùng
- ✅ Phân quyền (Patient → Doctor)
- ✅ Quản lý khoa khám bệnh
- ✅ Quản lý thông tin bác sĩ
- ✅ Quản lý lịch khám

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần         | Công Nghệ           | Phiên Bản |
| ------------------ | ------------------- | --------- |
| **Frontend**       | React Native (Expo) | Latest    |
| **Backend**        | Node.js + Express   | v18+      |
| **Database**       | MongoDB             | v6+       |
| **Authentication** | JWT (jsonwebtoken)  | ^9.0.3    |
| **Password Hash**  | bcryptjs            | ^3.0.3    |
| **Server**         | Nodemon (Dev)       | ^3.1.14   |
| **Middleware**     | CORS                | ^2.8.6    |

---

## 📦 Yêu Cầu Hệ Thống

### Software Requirements

- Node.js v18 trở lên
- MongoDB v6 trở lên
- npm hoặc yarn
- Git

### Hardware Requirements

- RAM: Tối thiểu 4GB
- Disk: Tối thiểu 2GB cho dự án
- CPU: Dual core trở lên

---

## 🚀 Installation

### Step 1: Clone hoặc Download Repository

```bash
cd my-app
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

**Các package sẽ cài đặt:**

```
✓ express - Web framework
✓ mongoose - MongoDB ODM
✓ bcryptjs - Password hashing
✓ jsonwebtoken - JWT authentication
✓ cors - Cross-origin requests
✓ dotenv - Environment variables
✓ nodemon - Development server
```

### Step 3: Verify Installation

```bash
npm list
```

---

## ⚙️ Configuration

### File .env Hiện Tại (Backend)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medical_booking
JWT_SECRET=secret123
```

---

## 🏃 Chạy Ứng Dụng

### 1. Khởi Động MongoDB

**Windows:**

```bash
mongod
```

**Mac:**

```bash
brew services start mongodb-community
```

**Docker:**

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Khởi Động Backend Server

```bash
cd backend
npm run dev
```

**Output mong đợi:**

```
Server running on port 5000
MongoDB Connected
```

### 3. Kiểm Tra Server

```bash
curl http://localhost:5000/
```

**Response:**

```
Backend API is running...
```

---

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register              - Đăng ký
POST   /api/auth/login                 - Đăng nhập
POST   /api/auth/assign-doctor         - Cấp quyền Doctor (Admin)
```

### Appointments

```
POST   /api/appointments                - Tạo lịch hẹn (Patient)
GET    /api/appointments/my             - Xem lịch của mình (Patient)
GET    /api/appointments/doctor         - Xem lịch bệnh nhân (Doctor)
PUT    /api/appointments/:id/cancel     - Hủy lịch (Patient)
```

### Departments

```
GET    /api/departments                 - Danh sách khoa
POST   /api/departments                 - Thêm khoa (Admin)
PUT    /api/departments/:id             - Sửa khoa (Admin)
DELETE /api/departments/:id             - Xóa khoa (Admin)
```

---

## 📚 Tài Liệu Chi Tiết

| Tài Liệu                         | Mô Tả                                          |
| -------------------------------- | ---------------------------------------------- |
| **PROJECT_REQUIREMENTS.md**      | Yêu cầu dự án chi tiết (role, flow, chức năng) |
| **backend/API_DOCUMENTATION.md** | Hướng dẫn API endpoints & examples             |
| **Code Comments**                | Chi tiết trong source code                     |

---

## 📄 Project Structure

```
my-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── appointmentController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── model/
│   │   │   ├── User.js
│   │   │   └── Appointment.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── appointmentRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── PROJECT_REQUIREMENTS.md
└── README.md (this file)
```

---

## 🔒 Hệ Thống Vai Trò

### 3 Role Chính:

1. **Patient (Bệnh Nhân)**
   - Role mặc định khi đăng ký
   - Có thể đặt lịch khám
   - Thanh toán qua VNPay

2. **Doctor (Bác Sĩ)**
   - Được Admin cấp quyền
   - Xem lịch bệnh nhân
   - Cập nhật trạng thái lịch

3. **Admin (Quản Trị Viên)**
   - Toàn quyền quản lý hệ thống
   - Cấp quyền Patient → Doctor
   - Quản lý khoa, bác sĩ, lịch

---

## 📝 Luồng Đặt Lịch

```
1. Đăng ký (role: Patient)
   ↓
2. Đăng nhập
   ↓
3. Chọn khoa khám
   ↓
4. Chọn bác sĩ
   ↓
5. Chọn lịch khám
   ↓
6. Xác nhận đặt lịch
   ↓
7. Thanh toán VNPay
   ↓
8. Lịch được confirmed
   ↓
9. Doctor nhận thông báo
```

---

**For detailed documentation, see PROJECT_REQUIREMENTS.md**

**Last Updated: 26/02/2026**
