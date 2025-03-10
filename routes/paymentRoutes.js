const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const Booking = require("../models/Booking"); // Import model Booking

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const { tourId, quantity, total } = req.body;
        const userId = req.user._id; // Lấy user từ middleware authenticate

        // Kiểm tra dữ liệu đầu vào
        if (!tourId || !quantity || !total) {
            return res.status(400).json({ error: "Thiếu thông tin đặt tour!" });
        }

        // Tạo booking mới
        const newBooking = new Booking({
            userId,
            tourId,
            total,
            status: "Pending"
        });

        // Lưu vào database
        await newBooking.save();

        res.status(201).json({ message: "Đặt tour thành công!", booking: newBooking });
    } catch (error) {
        console.error("🔥 Lỗi đặt tour:", error.message);
        res.status(500).json({ error: "Lỗi server khi đặt tour!" });
    }
});

module.exports = router;
