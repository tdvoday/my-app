# 📋 Tài Liệu Yêu Cầu Dự Án

## 1. Tên Đề Tài

### Ứng dụng đặt lịch khám bệnh trên Mobile

| Thông tin          | Chi tiết          |
| ------------------ | ----------------- |
| **Frontend**       | React Native      |
| **Backend**        | Node.js (Express) |
| **Database**       | MongoDB           |
| **Thanh toán**     | VNPay             |
| **Authentication** | JWT Token         |

---

## 2. Mô Tả Tổng Quát Hệ Thống

### 2.1 Tổng Quan

Hệ thống là một **ứng dụng di động** cho phép người dùng đặt lịch khám bệnh trực tuyến. Người dùng có thể:

- Lựa chọn khoa khám bệnh
- Xem danh sách bác sĩ theo khoa
- Xem thông tin chi tiết của bác sĩ
- Lựa chọn lịch khám còn trống
- Tiến hành đặt lịch
- Thanh toán trực tuyến qua **VNPay**

### 2.2 Yêu Cầu Đăng Ký

- Người dùng **bắt buộc phải đăng ký tài khoản** để sử dụng hệ thống
- Tài khoản mới đăng ký mặc định sẽ có **vai trò là Patient (Bệnh nhân)**
- Chỉ **Admin** mới có thể nâng quyền từ Patient → Doctor

### 2.3 Hệ Thống Vai Trò (Role-Based System)

Hệ thống hỗ trợ **3 vai trò chính**:

1. **Patient (Bệnh nhân)** - Vai trò mặc định
2. **Doctor (Bác sĩ)** - Được Admin phân quyền
3. **Admin (Quản trị viên)** - Quản lý toàn hệ thống

---

## 3. Phân Tích Vai Trò Chi Tiết

### 3.1 Role Patient (Bệnh nhân)

#### Mô Tả

- Đây là vai trò **mặc định** khi người dùng đăng ký tài khoản trong hệ thống
- Người dùng có thể tự đăng ký tài khoản với role này

#### Chức Năng

**Quản lý tài khoản:**

- ✅ Đăng ký tài khoản
- ✅ Đăng nhập hệ thống
- ✅ Cập nhật thông tin cá nhân
- ✅ Quầnlý hồ sơ sức khỏe

**Xem danh sách:**

- ✅ Xem danh sách khoa khám bệnh
- ✅ Xem danh sách bác sĩ theo từng khoa
- ✅ Tìm kiếm bác sĩ

**Xem thông tin chi tiết bác sĩ:**

- ✅ Chuyên ngành
- ✅ Chứng chỉ / bằng cấp
- ✅ Số năm kinh nghiệm
- ✅ Thông tin bệnh viện/phòng khám
- ✅ Đánh giá từ bệnh nhân khác

**Quản lý lịch khám:**

- ✅ Xem lịch khám còn trống của bác sĩ
- ✅ Đặt lịch khám bệnh
- ✅ Xem lịch khám đã đặt
- ✅ Hủy lịch khám (nếu còn trong thời hạn cho phép)

**Thanh toán:**

- ✅ Thanh toán lịch khám qua VNPay
- ✅ Xem trạng thái thanh toán
- ✅ Xem lịch sử giao dịch

---

### 3.2 Role Doctor (Bác sĩ)

#### Mô Tả

- Người dùng **KHÔNG thể tự đăng ký** tài khoản với vai trò bác sĩ
- Tài khoản Doctor **chỉ được tạo hoặc phân quyền bởi Admin**

#### Chức Năng

**Quản lý thông tin:**

- ✅ Đăng nhập với role Doctor
- ✅ Cập nhật thông tin cá nhân
- ✅ Quản lý lịch làm việc

**Quản lý lịch khám:**

- ✅ Xem danh sách lịch khám đã được đặt của mình
- ✅ Xem lịch theo ngày/giờ
- ✅ Xem thông tin bệnh nhân chi tiết:
  - Họ tên bệnh nhân
  - Số điện thoại
  - Email
  - Thời gian đặt lịch
  - Trạng thái thanh toán

**Quản lý trạng thái:**

- ✅ Xác nhận lịch khám
- ✅ Hủy lịch khám (với lý do)
- ✅ Cập nhật ghi chú cho bệnh nhân

---

### 3.3 Role Admin (Quản trị viên)

#### Mô Tả

- Admin là người **quản lý toàn bộ hệ thống**
- Có quyền kiểm soát tất cả các features

#### Chức Năng Quản Trị

**Quản lý tài khoản người dùng:**

- ✅ Xem danh sách tất cả người dùng
- ✅ Xóa tài khoản
- ✅ Khóa tài khoản
- ✅ Mở khóa tài khoản
- ✅ Phân quyền (Patient → Doctor)
- ✅ Xem lịch sử hoạt động người dùng

**Quản lý khoa khám bệnh:**

- ✅ Xem danh sách các khoa
- ✅ Thêm khoa khám mới
- ✅ Sửa thông tin khoa
- ✅ Xóa khoa

**Quản lý bác sĩ:**

- ✅ Xem danh sách bác sĩ
- ✅ Thêm bác sĩ mới
- ✅ Cập nhật thông tin bác sĩ:
  - Tên
  - Chuyên ngành
  - Chứng chỉ
  - Số năm kinh nghiệm
  - Liên kết khoa
- ✅ Xóa bác sĩ
- ✅ Gán bác sĩ vào khoa/phòng khám

**Quản lý phòng khám:**

- ✅ Xem danh sách phòng khám
- ✅ Thêm phòng khám
- ✅ Sửa thông tin phòng khám:
  - Tên phòng
  - Địa chỉ
  - Số điện thoại
  - Giờ hoạt động
- ✅ Xóa phòng khám
- ✅ Gán bác sĩ vào phòng

**Quản lý lịch khám:**

- ✅ Xem tất cả lịch khám
- ✅ Xem thống kê lịch khám
- ✅ Xem tỷ lệ hủy lịch

**Quản lý thanh toán:**

- ✅ Xem lịch sử giao dịch
- ✅ Xem chi tiết giao dịch VNPay
- ✅ Hoàn tiền

**Báo cáo & Thống kê:**

- ✅ Xem báo cáo doanh thu
- ✅ Xem thống kê bệnh nhân
- ✅ Xem thống kê bác sĩ

---

## 4. Luồng Nghiệp Vụ Chính

### 4.1 Luồng Đặt Lịch Khám Bệnh (Patient Flow)

```
┌─────────────────────────────────────────────────────────────┐
│         QUY TRÌNH ĐẶT LỊCH KHÁM BỆNH                       │
└─────────────────────────────────────────────────────────────┘

Step 1: Đăng Ký & Đăng Nhập
   ├── Người dùng đăng ký tài khoản
   │   └─ Role mặc định: Patient ✓
   └── Người dùng đăng nhập vào ứng dụng

Step 2: Chọn Khoa Khám Bệnh
   ├── Hệ thống hiển thị danh sách khoa
   │   ├─ Nội
   │   ├─ Ngoại
   │   ├─ Nhi
   │   └─ Tai Mũi Họng
   └── Người dùng chọn 1 khoa

Step 3: Xem Danh Sách Bác Sĩ
   ├── Hệ thống hiển thị bác sĩ theo khoa đã chọn
   ├── Hiển thị:
   │   ├─ Tên bác sĩ
   │   ├─ Chuyên ngành
   │   ├─ Số năm kinh nghiệm
   │   └─ Đánh giá trung bình
   └── Người dùng chọn bác sĩ

Step 4: Xem Chi Tiết Bác Sĩ
   ├── Hệ thống hiển thị:
   │   ├─ Thông tin bác sĩ đầy đủ
   │   ├─ Chuyên ngành
   │   ├─ Chứng chỉ
   │   ├─ Số năm kinh nghiệm
   │   ├─ Thông tin bệnh viện/phòng khám
   │   ├─ Lịch khám còn trống
   │   └─ Đánh giá từ bệnh nhân
   └── Người dùng kiểm tra lịch

Step 5: Chọn Khung Giờ Khám
   ├── Hệ thống hiển thị lịch còn trống (calendar view)
   ├── Chỉ hiển thị slot chưa được đặt
   └── Người dùng chọn ngày & giờ

Step 6: Xác Nhận Đặt Lịch
   ├── Hệ thống hiển thị:
   │   ├─ Bác sĩ: [Tên]
   │   ├─ Ngày khám: [DD/MM/YYYY]
   │   ├─ Giờ khám: [HH:mm]
   │   ├─ Lý do khám: [Input optional]
   │   ├─ Giá khám: [Số tiền]
   │   └─ Nút "Xác nhận"
   └── Người dùng xác nhận

Step 7: Thanh Toán VNPay
   ├── Hệ thống tạo đơn thanh toán
   ├── Chuyển hướng sang cổng VNPay
   ├── Người dùng nhập thông tin thanh toán
   └── Hoàn tất giao dịch

Step 8: Cập Nhật Trạng Thái
   ├── VNPay gửi callback về hệ thống
   ├── Hệ thống cập nhật:
   │   ├─ paymentStatus = "paid" ✓
   │   ├─ appointmentStatus = "confirmed" ✓
   │   └─ Gửi thông báo cho bác sĩ
   └── Lịch khám được lưu & hiển thị cho bác sĩ
```

### 4.2 Luồng Cấp Quyền Doctor (Admin Flow)

```
Admin muốn cấp quyền Doctor cho 1 Patient:

Step 1: Kiểm tra danh sách Patient
Step 2: Chọn Patient cần cấp quyền
Step 3: Nhập thông tin bác sĩ:
   ├─ Chuyên ngành
   ├─ Chứng chỉ
   ├─ Số năm kinh nghiệm
   ├─ Phòng khám
   └─ Giờ làm việc
Step 4: Xác nhận cấp quyền
Step 5: Patient được nâng cấp lên Doctor
Step 6: Doctor có thể đăng nhập với quyền mới
```

---

## 5. Chức Năng Thanh Toán VNPay

### 5.1 Mô Tả

Hệ thống tích hợp **cổng thanh toán VNPay** để xử lý thanh toán lịch khám trực tuyến.

### 5.2 Quy Trình Thanh Toán Chi Tiết

```
┌──────────────────────────────────────────┐
│       QUY TRÌNH THANH TOÁN VNPAY          │
└──────────────────────────────────────────┘

1. Patient đặt lịch & chọn "Thanh toán"
   │
2. Backend NodeJS nhận request
   ├─ Tạo đơn hàng
   ├─ Lưu thông tin appointment
   └─ Tạo URL thanh toán VNPay
   │
3. Frontend React Native nhận URL
   └─ Chuyển hướng sang cổng VNPay
   │
4. VNPay hiển thị form thanh toán
   │
5. Patient nhập thông tin thẻ/tài khoản
   │
6. VNPay xử lý giao dịch
   ├─ ✓ Thành công
   │   └─ Gửi callback về Backend
   ├─ ✗ Thất bại
   │   └─ Gửi callback về Backend
   └─ ! Chờ xử lý
       └─ Backend lắng nghe IPN
   │
7. Backend xử lý callback
   ├─ Verify chữ ký
   ├─ Cập nhật appointment:
   │   ├─ paymentStatus = "paid"
   │   ├─ appointmentStatus = "confirmed"
   │   └─ paymentDate = [timestamp]
   ├─ Gửi thông báo cho patient
   └─ Gửi thông báo cho doctor
   │
8. Frontend hiển thị kết quả
   ├─ ✓ Thanh toán thành công
   └─ ✗ Thanh toán thất bại
```

### 5.3 Trạng Thái Thanh Toán

| Trạng thái   | Mô tả               | Hành động              |
| ------------ | ------------------- | ---------------------- |
| **pending**  | Chờ thanh toán      | Patient cần thanh toán |
| **paid**     | Đã thanh toán       | Lịch được xác nhận     |
| **failed**   | Thanh toán thất bại | Patient có thể thử lại |
| **refunded** | Đã hoàn tiền        | Admin hoàn tiền        |

### 5.4 Trạng Thái Appointment Theo Thanh Toán

```
Appointment Status Flow:
pending (chờ thanh toán)
   │
   ├─→ confirmed (đã thanh toán & xác nhận)
   │   └─→ completed (bệnh nhân đã khám)
   │
   ├─→ cancelled (bệnh nhân hủy)
   │
   └─→ no-show (bệnh nhân không đến)
```

---

## 6. Các Chức Năng Chính Của Hệ Thống

### 6.1 Quản Lý Tài Khoản (Authentication & Authorization)

#### Chức Năng

- 🔐 **Đăng ký (Register)**
  - Nhập: name, email, password, phone
  - Role mặc định: Patient
- 🔐 **Đăng nhập (Login)**
  - Nhập: email, password
  - Trả về: JWT token, user info, role
- 🔐 **Xác thực JWT**
  - Kiểm tra token trong header Authorization
  - Format: `Bearer <token>`
- 🔐 **Phân quyền theo role**
  - Patient: Đặt lịch, xem lịch của mình
  - Doctor: Xem lịch bệnh nhân của mình
  - Admin: Quản lý toàn hệ thống

#### Endpoint

```
POST   /api/auth/register        - Đăng ký
POST   /api/auth/login           - Đăng nhập
POST   /api/auth/assign-doctor   - Cấp quyền Doctor (Admin only)
GET    /api/auth/profile         - Lấy thông tin người dùng
PUT    /api/auth/profile         - Cập nhật thông tin người dùng
```

---

### 6.2 Quản Lý Khoa Khám Bệnh

#### Thông Tin Khoa

- Mã khoa
- Tên khoa
- Mô tả
- Ký hiệu

#### Danh Sách Khoa Mẫu

| Mã  | Tên          | Mô tả                   |
| --- | ------------ | ----------------------- |
| IC  | Nội          | Khám chữa bệnh nội khoa |
| SG  | Ngoại        | Phẫu thuật              |
| PD  | Nhi          | Khám trẻ em             |
| ENT | Tai Mũi Họng | Khám tai mũi họng       |

#### Endpoint

```
GET    /api/departments             - Danh sách khoa (Public)
POST   /api/departments             - Thêm khoa (Admin only)
PUT    /api/departments/:id         - Sửa khoa (Admin only)
DELETE /api/departments/:id         - Xóa khoa (Admin only)
GET    /api/departments/:id/doctors - Bác sĩ theo khoa
```

---

### 6.3 Quản Lý Bác Sĩ

#### Thông Tin Bác Sĩ

```javascript
{
  _id: ObjectId,
  name: String,           // Họ tên
  email: String,          // Email
  phone: String,          // Số điện thoại
  specialty: String,      // Chuyên ngành
  certificate: String,    // Chứng chỉ/Bằng cấp
  experience: Number,     // Năm kinh nghiệm
  department: ObjectId,   // Khoa
  hospital: String,       // Bệnh viện/Phòng khám
  bio: String,            // Tiểu sử
  rating: Number,         // Đánh giá (1-5)
  avatar: String,         // Ảnh đại diện
  status: String,         // active/inactive
  createdAt: Date,
  updatedAt: Date
}
```

#### Endpoint

```
GET    /api/doctors                    - Danh sách bác sĩ
GET    /api/doctors/:id                - Chi tiết bác sĩ
POST   /api/doctors                    - Thêm bác sĩ (Admin)
PUT    /api/doctors/:id                - Sửa bác sĩ (Admin)
DELETE /api/doctors/:id                - Xóa bác sĩ (Admin)
GET    /api/doctors/:id/schedule       - Lịch khám của bác sĩ
GET    /api/doctors/:id/appointments   - Lịch hẹn của bác sĩ (Doctor/Admin)
PUT    /api/doctors/:id/rating         - Đánh giá bác sĩ (Patient)
```

---

### 6.4 Quản Lý Lịch Khám (Schedule System)

#### Cấu Trúc Lịch Khám

```javascript
{
  _id: ObjectId,
  doctorId: ObjectId,     // Bác sĩ
  departmentId: ObjectId, // Khoa
  date: Date,             // Ngày
  startTime: String,      // Giờ bắt đầu (HH:mm)
  endTime: String,        // Giờ kết thúc (HH:mm)
  capacity: Number,       // Số người tối đa
  booked: Number,         // Số người đã đặt
  status: String,         // active/inactive
  createdAt: Date,
  updatedAt: Date
}
```

#### Quy Tắc Hệ Thống

- ✅ Bác sĩ có thể có nhiều khung giờ khám
- ✅ Chỉ hiển thị lịch còn trống (booked < capacity)
- ✅ Không cho phép đặt trùng lịch (1 slot = 1 bệnh nhân)
- ✅ Mỗi khung giờ chỉ được đặt 1 lần

#### Endpoint

```
GET    /api/schedules                          - Danh sách lịch
GET    /api/schedules/doctor/:doctorId         - Lịch của bác sĩ
GET    /api/schedules/available/:doctorId      - Lịch còn trống
POST   /api/schedules                          - Tạo lịch (Admin)
PUT    /api/schedules/:id                      - Cập nhật lịch (Admin)
DELETE /api/schedules/:id                      - Xóa lịch (Admin)
```

---

### 6.5 Quản Lý Lịch Hẹn (Appointment)

#### Thông Tin Lịch Hẹn

```javascript
{
  _id: ObjectId,
  patientId: ObjectId,           // Bệnh nhân
  doctorId: ObjectId,            // Bác sĩ
  departmentId: ObjectId,        // Khoa
  scheduleId: ObjectId,          // Slot thời gian
  date: Date,                    // Ngày khám
  time: String,                  // Giờ khám (HH:mm)
  reason: String,                // Lý do khám
  appointmentStatus: String,     // pending/confirmed/completed/cancelled
  paymentStatus: String,         // pending/paid/failed/refunded
  paymentMethod: String,         // vnpay/cash
  paymentDate: Date,             // Ngày thanh toán
  fee: Number,                   // Giá khám
  notes: String,                 // Ghi chú từ doctor
  createdAt: Date,
  updatedAt: Date
}
```

#### Trạng Thái Appointment

| Status        | Mô tả                    |
| ------------- | ------------------------ |
| **pending**   | Chờ thanh toán           |
| **confirmed** | Đã thanh toán & xác nhận |
| **completed** | Khám xong                |
| **cancelled** | Đã hủy                   |
| **no-show**   | Không đến                |

#### Endpoint

```
# Patient
POST   /api/appointments                    - Tạo lịch hẹn
GET    /api/appointments/my                 - Xem lịch của mình
PUT    /api/appointments/:id/cancel         - Hủy lịch
GET    /api/appointments/:id/payment-status - Xem trạng thái thanh toán

# Doctor
GET    /api/appointments/doctor             - Xem lịch bệnh nhân
PUT    /api/appointments/:id/status         - Cập nhật trạng thái
PUT    /api/appointments/:id/notes          - Thêm ghi chú

# Payment
POST   /api/payments/create-vnpay-url       - Tạo URL thanh toán
GET    /api/payments/vnpay-callback         - Callback từ VNPay
GET    /api/payments/:appointmentId         - Chi tiết thanh toán
```

---

## 7. Database Schema

### 7.1 User Collection

```javascript
db.users.insertOne({
  name: String,
  email: String (unique),
  password: String (hash),
  phone: String,
  role: String (enum: ["patient", "doctor", "admin"]),

  // Thông tin bác sĩ (nếu role = doctor)
  specialty: String,
  certificate: String,
  experience: Number,
  hospital: String,

  // Thông tin khác
  avatar: String,
  status: String (enum: ["active", "inactive", "locked"]),
  createdAt: Date,
  updatedAt: Date
})
```

### 7.2 Department Collection

```javascript
db.departments.insertOne({
  code: String,
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
});
```

### 7.3 Schedule Collection

```javascript
db.schedules.insertOne({
  doctorId: ObjectId,
  departmentId: ObjectId,
  date: Date,
  startTime: String,
  endTime: String,
  capacity: Number,
  booked: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});
```

### 7.4 Appointment Collection

```javascript
db.appointments.insertOne({
  patientId: ObjectId,
  doctorId: ObjectId,
  departmentId: ObjectId,
  scheduleId: ObjectId,
  date: Date,
  time: String,
  reason: String,
  appointmentStatus: String,
  paymentStatus: String,
  paymentMethod: String,
  paymentDate: Date,
  fee: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date,
});
```

### 7.5 Payment Collection

```javascript
db.payments.insertOne({
  appointmentId: ObjectId,
  patientId: ObjectId,
  amount: Number,
  currency: String,
  method: String(vnpay),
  status: String(pending / paid / failed / refunded),
  transactionCode: String,
  transactionDate: Date,
  responseCode: String,
  message: String,
  createdAt: Date,
  updatedAt: Date,
});
```

---

## 8. API Response Format

### 8.1 Success Response

```javascript
{
  success: true,
  message: "Operation successful",
  data: {
    // Dữ liệu trả về
  }
}
```

### 8.2 Error Response

```javascript
{
  success: false,
  message: "Error message",
  error: "Error details"
}
```

---

## 9. Security & Best Practices

### 9.1 Authentication

- ✅ Sử dụng JWT token (7 ngày)
- ✅ Hash password với bcrypt
- ✅ Bearer token trong header Authorization
- ✅ Xác thực tại mỗi protected route

### 9.2 Authorization

- ✅ Kiểm tra role trước mỗi action
- ✅ Patient chỉ xem lịch của chính mình
- ✅ Doctor chỉ xem bệnh nhân của mình
- ✅ Admin có toàn quyền

### 9.3 Data Validation

- ✅ Validate input từ client
- ✅ Kiểm tra email format
- ✅ Kiểm tra phone format
- ✅ Kiểm tra password strength

### 9.4 Error Handling

- ✅ Xử lý lỗi database
- ✅ Xử lý lỗi VNPay
- ✅ Xử lý lỗi token
- ✅ Log lỗi chi tiết

---

## 10. Roadmap Phát Triển

### Phase 1: MVP (Hiện tại)

- ✅ Authentication (Register/Login)
- ✅ Appointment booking
- ⏳ VNPay integration
- ⏳ Doctor dashboard
- ⏳ Admin panel

### Phase 2: Features Nâng Cao

- 📋 Medical history tracking
- 📋 Prescription management
- 📋 Feedback/Rating system
- 📋 Appointment reminders (SMS/Push)
- 📋 Search & Filter advanced

### Phase 3: Enhancement

- 📋 Telemedicine (video call)
- 📋 Online consultation
- 📋 Analytics dashboard
- 📋 Multi-language support
- 📋 Mobile app optimization

---

## 11. Thông Tin Liên Hệ

| Thông tin     | Chi tiết                    |
| ------------- | --------------------------- |
| **Dự án**     | Medical Appointment Booking |
| **Giai đoạn** | Development                 |
| **Status**    | Active                      |
| **Database**  | MongoDB                     |
| **API Port**  | 5000                        |

---

**Tài liệu được cập nhật lần cuối: 26/02/2026**
