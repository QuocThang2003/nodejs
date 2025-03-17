const express = require("express");
const { forgotPasswordHandler, resetPasswordHandler } = require("../controllers/forgetPasswordController");

const router = express.Router();

router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

module.exports = router;
