const bookingService = require("../services/bookingService");
const vnpayService = require("../services/vnpayService");
exports.getAllBookings = async (req, res) => {
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

        if (!userId) {
            return res.status(401).json({ error: "Bạn cần đăng nhập để đặt tour!" });
        }

        // Gọi service để tạo URL thanh toán VNPay
        const response = await bookingService.createPaymentUrl(userId, tourId, quantity, req);

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi đặt tour:", error.message);
        res.status(500).json({ error: "Lỗi server khi đặt tour!" });
    }
};