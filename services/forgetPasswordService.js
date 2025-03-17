const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config/env");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<h2>Yêu cầu đặt lại mật khẩu</h2>
               <p>Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu:</p>
               <a href="${resetLink}">${resetLink}</a>`
    };
    await transporter.sendMail(mailOptions);
};

const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Email không tồn tại");
        }

        // Tạo token để đặt lại mật khẩu (dùng _id của user)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });

        // Gửi email reset mật khẩu
        await sendResetPasswordEmail(email, token);

        return { message: "Vui lòng kiểm tra email để đặt lại mật khẩu." };
    } catch (error) {
        console.error("Lỗi forgotPassword:", error.message);
        throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
    }
};


const resetPassword = async (token, password, confirmPassword) => {
    if (password !== confirmPassword) throw new Error("Mật khẩu xác nhận không khớp");

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return { message: "Mật khẩu đã được đặt lại thành công." };
};

module.exports = { forgotPassword, resetPassword };
