const Booking = require("../models/Booking");

exports.paymentReturn = async (req, res) => {
    const vnpParams = req.query;
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];

    // Kiểm tra tính hợp lệ của thanh toán
    if (vnpParams["vnp_ResponseCode"] === "00") {
        const newBooking = new Booking({
            userId: req.user.id,
            tourId: vnpParams["vnp_TxnRef"],
            total: vnpParams["vnp_Amount"] / 100, // Chia 100 để về VNĐ
            status: "Paid"
        });

        await newBooking.save();
        res.json({ message: "Thanh toán thành công! Đơn đặt tour đã được lưu." });
    } else {
        res.status(400).json({ error: "Thanh toán thất bại!" });
    }
};
