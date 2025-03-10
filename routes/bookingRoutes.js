const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.post("/", authenticate, bookingController.createBooking);

module.exports = router;
