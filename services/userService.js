const User = require("../models/user");

const userService = {
    getAllUsers: async () => {
        try {
            const users = await User.find({}, "-password"); // Loại bỏ trường password để bảo mật
            return users;
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách người dùng");
        }
    }
};

module.exports = userService;
