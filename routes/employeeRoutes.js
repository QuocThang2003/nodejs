const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

// Đăng ký nhân viên (Chỉ Admin)
router.post("/register", authenticate, isAdmin, employeeController.registerEmployee);

// Đăng nhập nhân viên
router.post("/login", employeeController.loginEmployee);

// Xem thông tin tài khoản cá nhân (yêu cầu đăng nhập)
router.get("/:id", authenticate, employeeController.getEmployeeById);

// Khóa/Mở khóa tài khoản (Chỉ Admin)
router.put("/toggle-status/:id", authenticate, isAdmin, employeeController.toggleEmployeeStatus);

module.exports = router;
