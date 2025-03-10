const Booking = require("../models/Booking");
const Tour = require("../models/tour");

exports.createBooking = async (userId, tourId, quantity) => {
    if (!tourId || !quantity || quantity <= 0) {
        return { status: 400, data: { error: "Thông tin không hợp lệ!" } };
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
        return { status: 404, data: { error: "Tour không tồn tại!" } };
    }

    const total = tour.price * quantity;
    const newBooking = new Booking({
        userId,
        tourId,
        total,
        status: "Pending"
    });

    await newBooking.save();
    return { status: 201, data: { message: "Đặt tour thành công!", booking: newBooking } };
};
