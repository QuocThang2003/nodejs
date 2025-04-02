const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

// 📩 Người dùng gửi liên hệ (không cần xác thực)
router.post("/send", contactController.sendContact);

// 🔍 Quản trị viên lấy danh sách tất cả liên hệ (cần xác thực + quyền admin)
router.get("/all", authenticate, isAdmin, contactController.getAllContacts);

// 🔍 Quản trị viên lấy chi tiết liên hệ theo ID (cần xác thực + quyền admin)
router.get("/:id", authenticate, isAdmin, contactController.getContactById);

module.exports = router;
