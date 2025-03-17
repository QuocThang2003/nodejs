const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// Xử lý khi VNPay trả về kết quả
router.get("/payment-return", paymentController.paymentReturn);
module.exports = router;
