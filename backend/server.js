const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint kiểm tra trạng thái
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend REST API đang hoạt động bình thường' });
});

// Đăng ký API nhân viên
app.use('/api/employees', require('./routes/employeeRoutes'));

// Kết nối CSDL MongoDB Atlas từ biến môi trường
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Kết nối thành công tới MongoDB Atlas!');
    app.listen(PORT, () => {
      console.log(`Server Backend đang chạy tại port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB Atlas:', err);
  });