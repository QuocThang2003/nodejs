const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Đăng nhập Google (chuyển hướng)
router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

// Xử lý phản hồi từ Google bằng phương thức GET
router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:3000/login?error=google_auth_failed" }),
  (req, res) => {
    console.log("User từ Google:", req.user); // Kiểm tra user trả về từ Google

    if (!req.user) {
      return res.redirect("http://localhost:3000/login?error=google_auth_failed");
    }

    const token = jwt.sign(
      { id: req.user._id, fullName: req.user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Token tạo thành công:", token); // Debug token

    // Chuyển hướng về frontend kèm token
    res.redirect(`http://localhost:3000/google-auth?token=${token}`);
  }
);

module.exports = router;
