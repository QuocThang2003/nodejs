const userService = require("../services/userService");

const userController = {
    getUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserBookings: async (req, res) => {
        try {
            const userId = req.user?.id; // Kiểm tra xem có userId không
    
            if (!userId) {
                return res.status(401).json({ message: "Bạn cần đăng nhập để xem lịch sử giao dịch." });
            }
    
            const bookings = await userService.getUserBookings(userId);
            
            if (!bookings.length) {
                return res.status(200).json({ message: "Bạn chưa có lịch sử đặt tour." });
            }
    
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server: " + error.message });
        }
    },
    editProfile: async (req, res) => {
        try {
            const userId = req.user?.id; // Lấy userId từ middleware authenticate
            if (!userId) {
                return res.status(401).json({ message: "Bạn cần đăng nhập để chỉnh sửa thông tin cá nhân." });
            }

            const { fullName, phone, address } = req.body;
            const result = await userService.editProfile(userId, fullName, phone, address);

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
};

module.exports = userController;
