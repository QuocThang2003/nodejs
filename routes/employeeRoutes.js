const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");


// Đăng ký nhân viên (Chỉ Admin)
router.post("/register", authenticate, isAdmin, employeeController.registerEmployee);

// Đăng nhập nhân viên
router.post("/login", employeeController.loginEmployee);
//Đăng xuất
router.post("/logout", employeeController.logoutEmployee);

// Lấy danh sách tất cả nhân viên (Chỉ Admin)
router.get("/", authenticate, isAdmin, employeeController.getAllEmployees);

// Xem thông tin tài khoản cá nhân (yêu cầu đăng nhập)
router.get("/:id", authenticate, isAdmin,employeeController.getEmployeeById);

// Khóa/Mở khóa tài khoản (Chỉ Admin)
router.put("/toggle-status/:id", authenticate, isAdmin, employeeController.toggleEmployeeStatus);

// Xóa nhân viên (Chỉ Admin)
router.delete("/:id", authenticate, isAdmin, employeeController.deleteEmployee);

module.exports = router;
