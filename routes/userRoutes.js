const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, userController.getUsers);
router.get("/booktour", authMiddleware.authenticate, userController.getUserBookings);
router.put("/profile", authMiddleware.authenticate, userController.editProfile); // Cập nhật thông tin cá nhân

module.exports = router;
