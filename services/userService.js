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
    },
    editProfile: async (userId, fullName, phone, address) => {
        try {
            // Kiểm tra xem user có tồn tại không
            const existingUser = await User.findById(userId);
            if (!existingUser) throw new Error("Không tìm thấy người dùng");

            // Kiểm tra xem fullName có bị trùng không
            if (existingUser.fullName === fullName) {
                throw new Error("Tên mới trùng với tên cũ, vui lòng chọn tên khác!");
            }

            // Cập nhật thông tin
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, phone, address },
                { new: true, runValidators: true }
            );

            return { message: "Cập nhật thông tin thành công!", user: updatedUser };
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
    



module.exports = userService;
