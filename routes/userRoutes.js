const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware"); // Import middleware

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/booktour", authenticate, userController.getUserBookings); // Xác thực token trước khi lấy lịch sử booking

module.exports = router;
