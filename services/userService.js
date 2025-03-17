const User = require("../models/user");
const Booking = require("../models/Booking");

const userService = {
    getAllUsers: async () => {
        try {
            const users = await User.find({}, "-password"); // Loại bỏ trường password
            return users;
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách người dùng");
        }
    },

    getUserBookings: async (userId) => {
        try {
            const bookings = await Booking.find({ userId }).populate("tourId");
            return bookings;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
};

module.exports = userService;
