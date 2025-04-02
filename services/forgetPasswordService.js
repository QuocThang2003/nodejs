const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../config/env");
const { sendResetPasswordEmail } = require("./emailService");

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    await sendResetPasswordEmail(email, token);

    return { 
        message: "Vui lòng kiểm tra email để đặt lại mật khẩu.", 
        token // ✅ Trả về token trong response
    };
};

const resetPassword = async (token, password, confirmPassword) => {
    console.log("📢 Token nhận được:", token); // ✅ Debug token

    if (!token) {
        console.log("❌ Lỗi: Token không tồn tại");
        throw new Error("Token không được cung cấp");
    }

    if (password !== confirmPassword) throw new Error("Mật khẩu xác nhận không khớp");

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token hợp lệ:", decoded);
    } catch (error) {
        console.log("❌ Token không hợp lệ:", error.message);
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return { message: "Mật khẩu đã được đặt lại thành công." };
};


module.exports = { forgotPassword, resetPassword };
