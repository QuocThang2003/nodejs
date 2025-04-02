const bookingService = require("../services/bookingService");
const { sendPaymentNotificationEmail } = require("../services/emailService");
const Payment = require("../models/payment");
const Booking = require("../models/Booking");
exports.getAllBookings = async (_req, res) => {
    try {
        const response = await bookingService.getAllBookings();
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi lấy danh sách đặt tour:", error.message);
        res.status(500).json({ error: "Lỗi server khi lấy danh sách đặt tour!" });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const response = await bookingService.getBookingById(bookingId);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi lấy đơn đặt tour:", error.message);
        res.status(500).json({ error: "Lỗi server khi lấy đơn đặt tour!" });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { tourId, quantity } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Bạn cần đăng nhập để đặt tour!" });

        const response = await bookingService.createBooking(userId, tourId, quantity);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi đặt tour:", error.message);
        res.status(500).json({ error: "Lỗi server khi đặt tour!" });
    }
};

exports.paymentCallback = async (req, res) => {
    try {
        const { vnp_TxnRef, vnp_ResponseCode } = req.query;

        if (!vnp_TxnRef) {
            return res.status(400).json({ error: "Thiếu orderId!" });
        }

        const payment = await Payment.findOne({ orderId: vnp_TxnRef }).populate("bookingId");

        if (!payment) {
            return res.status(404).json({ error: "Không tìm thấy thanh toán!" });
        }

        const booking = await Booking.findById(payment.bookingId).populate("userId");

        if (!booking) {
            return res.status(404).json({ error: "Không tìm thấy đơn đặt chỗ!" });
        }

        if (vnp_ResponseCode === "00") {
            payment.status = "Paid";
            await payment.save();
            booking.status = "Paid";
            await booking.save();

            // Gửi email thông báo thanh toán thành công
            await sendPaymentNotificationEmail(booking.userId.email, booking._id, booking.bookingDate, booking.total, "Paid");

            return res.redirect(`http://localhost:3000/booking-success?bookingId=${booking._id}`);
        } else {
            payment.status = "Pending";
            await payment.save();

            // Gửi email thông báo thanh toán thất bại
            await sendPaymentNotificationEmail(booking.userId.email, booking._id, booking.bookingDate, booking.total, "Pending");

            return res.redirect("http://localhost:3000/booking-failure");
        }
    } catch (error) {
        console.error("🔥 Lỗi xử lý thanh toán:", error.message);
        res.status(500).json({ error: "Lỗi server khi xử lý thanh toán!" });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để hủy đơn đặt tour." });
        }

        const result = await bookingService.cancelBooking(bookingId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server: " + error.message });
    }
};
exports.getMonthlyTotal = async (req, res) => {
    try {
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const response = await bookingService.getMonthlyTotal(year); // Gọi service
        res.status(response.status).json(response.data); // Trả về response.data
    } catch (error) {
        console.error("🔥 Lỗi tính tổng theo tháng:", error.message);
        res.status(500).json({ error: "Lỗi server khi tính tổng theo tháng!" });
    }
};
