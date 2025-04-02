const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Tạo đơn đặt tour (yêu cầu đăng nhập)
router.post("/", authenticate, bookingController.createBooking);
// Xử lý callback từ VNPAY
router.get("/payment-return", bookingController.paymentCallback);

// Lấy tất cả đơn đặt tour
router.get("/all", bookingController.getAllBookings);

// Lấy tổng doanh thu theo tháng
router.get("/monthly-total", bookingController.getMonthlyTotal);

// Lấy thông tin đơn đặt tour theo ID (đặt sau /monthly-total)
router.get("/:id", bookingController.getBookingById);

// Hủy tour (yêu cầu đăng nhập)
router.put("/cancel/:id", authenticate, bookingController.cancelBooking);

module.exports = router;