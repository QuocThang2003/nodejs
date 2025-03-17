const Booking = require("../models/Booking");
const Tour = require("../models/tour");
const vnpayService = require("../services/vnpayService");

exports.getAllBookings = async () => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "username") // Lấy thông tin username từ User
            .populate("tourId", "name price"); // Lấy tên và giá tour

        return { status: 200, data: { message: "Lấy danh sách đặt tour thành công!", bookings } };
    } catch (error) {
        return { status: 500, data: { error: "Lỗi khi lấy danh sách đặt tour!" } };
    }
};

exports.getBookingById = async (bookingId) => {
    try {
        const booking = await Booking.findById(bookingId)
            .populate("userId", "username")
            .populate("tourId", "name price");

        if (!booking) {
            return { status: 404, data: { error: "Không tìm thấy đơn đặt tour!" } };
        }

        return { status: 200, data: { message: "Lấy thông tin đơn đặt tour thành công!", booking } };
    } catch (error) {
        return { status: 500, data: { error: "Lỗi khi lấy đơn đặt tour!" } };
    }
};
exports.createPaymentUrl = async (userId, tourId, quantity, req) => {
    if (!tourId || !quantity || quantity <= 0) {
        return { status: 400, data: { error: "Thông tin không hợp lệ!" } };
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
        return { status: 404, data: { error: "Tour không tồn tại!" } };
    }

    const total = tour.price * quantity;

    // Gọi VNPay để tạo URL thanh toán
    const paymentUrl = await vnpayService.createPaymentUrl(total, req);

    return {
        status: 200,
        data: {
            message: "Tạo URL thanh toán thành công!",
            paymentUrl
        }
    };
};
