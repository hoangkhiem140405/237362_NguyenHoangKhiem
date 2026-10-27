import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, InputGroup, Row, Col, Badge, Card, Spinner, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: 'success', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: 'Kỹ thuật',
    position: 'Nhân viên',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Đang làm việc'
  });

  const showAlert = (message, variant = 'success') => {
    setAlertInfo({ show: true, variant, message });
    setTimeout(() => setAlertInfo({ show: false, variant: 'success', message: '' }), 3000);
  };

  const fetchEmployees = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      setEmployees(res.data);
    } catch (err) {
      showAlert('Không thể kết nối tới máy chủ API Backend!', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchEmployees(value);
  };

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingId(emp._id);
      setFormData({ ...emp });
    } else {
      setEditingId(null);
      setFormData({
        employeeId: '',
        fullName: '',
        gender: 'Nam',
        dateOfBirth: '',
        department: 'Kỹ thuật',
        position: 'Nhân viên',
        email: '',
        phone: '',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Đang làm việc'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showAlert('Cập nhật hồ sơ nhân viên thành công!');
      } else {
        await axios.post(API_URL, formData);
        showAlert('Thêm nhân viên mới thành công!');
      }
      setShowModal(false);
      fetchEmployees(search);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu!', 'danger');
    }
  };

  const handleDelete = async (id, fullName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên: ${fullName}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlert('Xóa hồ sơ nhân viên thành công!');
        fetchEmployees(search);
      } catch (err) {
        showAlert('Lỗi khi xóa nhân viên!', 'danger');
      }
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white p-3">
          <h3 className="m-0 text-center fw-bold">HỆ THỐNG QUẢN LÝ NHÂN SỰ (HR SYSTEM)</h3>
          <p className="m-0 text-center small mt-1">Sinh viên: Nguyễn Hoàng Khiêm - MSSV: 237362</p>
        </Card.Header>

        <Card.Body className="p-4">
          {alertInfo.show && (
            <Alert variant={alertInfo.variant} onClose={() => setAlertInfo({ ...alertInfo, show: false })} dismissible>
              {alertInfo.message}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo Mã nhân viên hoặc Họ tên..."
                  value={search}
                  onChange={handleSearch}
                />
                <Button variant="outline-secondary" onClick={() => fetchEmployees(search)}>Tìm kiếm</Button>
              </InputGroup>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="success" onClick={() => handleOpenModal()}>
                + Thêm Nhân Viên Mới
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải dữ liệu nhân viên...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive align="middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>Mã NV</th>
                  <th>Họ và Tên</th>
                  <th>Giới tính</th>
                  <th>Phòng ban</th>
                  <th>Chức vụ</th>
                  <th>Email / Số ĐT</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">Không tìm thấy nhân viên nào</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td className="fw-bold text-center">{emp.employeeId}</td>
                      <td>{emp.fullName}</td>
                      <td className="text-center">{emp.gender}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>
                        <div><small>{emp.email}</small></div>
                        <div><small className="text-muted">{emp.phone}</small></div>
                      </td>
                      <td className="text-center">
                        <Badge bg={emp.status === 'Đang làm việc' ? 'success' : 'danger'}>
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleOpenModal(emp)}>
                          Sửa
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(emp._id, emp.fullName)}>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Cập Nhật Hồ Sơ Nhân Viên' : 'Thêm Hồ Sơ Nhân Viên Mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã Nhân Viên (*)</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    disabled={!!editingId}
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và Tên (*)</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Ngày vào làm</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Chức vụ</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email (*)</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái làm việc</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu Thông Tin
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default App;