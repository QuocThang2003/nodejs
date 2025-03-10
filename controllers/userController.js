const userService = require("../services/userService");

const userController = {
    getUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
