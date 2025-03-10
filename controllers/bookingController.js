const bookingService = require("../services/bookingService");

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
