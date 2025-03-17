const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Tạo đơn đặt tour (yêu cầu đăng nhập)
router.post("/", authenticate, bookingController.createBooking);

// Lấy tất cả đơn đặt tour
router.get("/all", bookingController.getAllBookings);

// Lấy thông tin đơn đặt tour theo ID
router.get("/:id", bookingController.getBookingById);

module.exports = router;
