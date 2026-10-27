# HỆ THỐNG QUẢN LÝ NHÂN SỰ (HR MANAGEMENT SYSTEM)

## I. THÔNG TIN SINH VIÊN
- **Họ và tên:** Nguyễn Hoàng Khiêm
- **MSSV:** 237362
- **Lớp:** DH23TIN10

---

## II. MÔ TẢ HỆ THỐNG
Hệ thống quản lý nhân sự triển khai trên nền tảng đám mây (Cloud), hỗ trợ lưu trữ và thực hiện các thao tác quản lý hồ sơ nhân viên cơ bản bao gồm: xem danh sách, thêm mới, tìm kiếm, cập nhật và xóa hồ sơ nhân viên.

---

## III. CÔNG NGHỆ SỬ DỤNG
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Version Control:** Git, GitHub
- **Containerization:** Docker, Docker Hub
- **Deployment Platform:** Render

---

## IV. BẢNG TỔNG HỢP LINK NỘP BÀI (6 ĐƯỜNG LINK)

| STT | Hạng mục nộp bài | Đường link (URL) |
| :---: | :--- | :--- |
| **1** | **GitHub Repository** | https://github.com/hoangkhiem140405/237362_NguyenHoangKhiem |
| **2** | **Docker Hub - Backend Image** | https://hub.docker.com/r/hoangkhiem140405/backend |
| **3** | **Docker Hub - Frontend Image** | https://hub.docker.com/r/hoangkhiem140405/frontend |
| **4** | **Render - Backend API Base URL** | https://api-237362.onrender.com |
| **5** | **Render - Backend API Employees** | https://api-237362.onrender.com/api/employees |
| **6** | **Render - Frontend Web App** | https://web-237362.onrender.com |

---

## V. HƯỚNG DẪN CHẠY ỨNG DỤNG BẰNG DOCKER COMPOSE (LOCAL)

### 1. Yêu cầu môi trường
- Máy tính đã cài đặt **Docker** và **Docker Desktop**.

### 2. Khởi động toàn bộ ứng dụng
Chạy lệnh duy nhất tại thư mục gốc của dự án:
```bash
docker compose up -d