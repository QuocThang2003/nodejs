const Payment = require("../models/payment");
const Booking = require("../models/Booking");
const Tour = require("../models/tour");
const paymentService = require("../services/paymentService");

const paymentController = {
    createBooking: async (req, res) => {
        try {
            const { tourId, quantity } = req.body;
            const userId = req.user.id;

            // ✅ Gọi service xử lý đặt tour
            const booking = await paymentService.processBooking(userId, tourId, quantity);

            // ✅ Tạo URL thanh toán VNPay
            const vnpUrl = await paymentService.createVNPayUrl(booking);

            res.status(200).json({ message: "Chuyển đến VNPay để thanh toán", paymentUrl: vnpUrl });
        } catch (error) {
            res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
        }
    }
};


module.exports = paymentController;
