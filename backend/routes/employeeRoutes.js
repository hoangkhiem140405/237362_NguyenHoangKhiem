const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 1. GET /api/employees (Lấy danh sách & Tìm kiếm theo mã nhân viên hoặc họ tên)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// 2. GET /api/employees/:id (Xem chi tiết 1 nhân viên)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ nhân viên' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// 3. POST /api/employees (Thêm nhân viên mới - Kiểm tra bắt buộc & Trùng mã)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (Mã NV, Họ tên, Email)' 
      });
    }

    // Kiểm tra trùng mã nhân viên
    const existingEmp = await Employee.findOne({ employeeId });
    if (existingEmp) {
      return res.status(400).json({ message: 'Mã nhân viên đã tồn tại trên hệ thống!' });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
});

// 4. PUT /api/employees/:id (Cập nhật thông tin nhân viên)
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ nhân viên để cập nhật' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: error.message });
  }
});

// 5. DELETE /api/employees/:id (Xóa nhân viên)
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ nhân viên để xóa' });
    }
    res.json({ message: 'Xóa hồ sơ nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error: error.message });
  }
});

module.exports = router;