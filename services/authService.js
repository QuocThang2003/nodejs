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

const sendConfirmationEmail = async (email, fullName) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Xác nhận đăng ký tài khoản",
        html: `<h2>Chào ${fullName},</h2>
               <p>Bạn đã đăng ký tài khoản thành công!</p>
               <p>Chức mừng bạn đăng ký thành công.</p>`
    };

    await transporter.sendMail(mailOptions);
};

const registerUser = async (fullName, phone, email, password, confirmPassword, address) => {
    if (password !== confirmPassword) throw new Error("Mật khẩu xác nhận không khớp");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, phone, email, password: hashedPassword, address }); // Lưu address
    await newUser.save();

    await sendConfirmationEmail(email, fullName);

    return { message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận." };
};


const loginUser = async (email, password) => {
    console.log("📢 Đang đăng nhập với email:", email);

    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ Không tìm thấy user trong DB");
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    console.log("✅ Tìm thấy user:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("❌ Mật khẩu không đúng");
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ Đăng nhập thành công, token:", token);

    return { message: "Đăng nhập thành công", token };
};

module.exports = { registerUser, loginUser };
