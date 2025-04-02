const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config/env");
const { sendConfirmationEmail } = require("./emailService");

// Hàm đăng ký
const registerUser = async (fullName, phone, email, password, confirmPassword, address) => {
    // 1. Kiểm tra các trường bắt buộc có bị thiếu không
    if (!fullName || !phone || !email || !password || !confirmPassword || !address) {
        throw new Error("Vui lòng điền đầy đủ tất cả các trường!");
    }

    // 2. Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Email không hợp lệ!");
    }

    // 3. Kiểm tra mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp!");
    }

    // 4. Kiểm tra độ dài mật khẩu (ví dụ: tối thiểu 6 ký tự)
    if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    // 5. Kiểm tra email đã tồn tại trong DB chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email đã được sử dụng!");
    }

    // 6. Kiểm tra số điện thoại có hợp lệ không (ví dụ: 10 số, bắt đầu bằng 0)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error("Số điện thoại không hợp lệ! Phải là 10 số và bắt đầu bằng 0.");
    }

    // 7. Lỗi khi hash mật khẩu thất bại (hiếm, nhưng có thể xảy ra)
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi mã hóa mật khẩu!");
    }

    const newUser = new User({ fullName, phone, email, password: hashedPassword, address });
    await newUser.save();

    console.log("✅ User đã được lưu vào DB:", newUser);

    await sendConfirmationEmail(email, fullName);

    return { 
        message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
        email: email 
    };
};

// Hàm đăng nhập
const loginUser = async (email, password) => {
    console.log("📢 Đang đăng nhập với email:", email);

    // 1. Kiểm tra email và password có được cung cấp không
    if (!email || !password) {
        throw new Error("Vui lòng nhập email và mật khẩu!");
    }

    // 2. Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Email không hợp lệ!");
    }

    // 3. Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    // 4. Kiểm tra email hoặc mật khẩu không đúng (gộp email không tồn tại và mật khẩu không khớp)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("❌ Email hoặc mật khẩu không đúng");
        throw new Error("Email hoặc mật khẩu không đúng!");
    }

    // Tạo token
    const token = jwt.sign(
        { id: user._id, fullName: user.fullName, address: user.address, phone: user.phone }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );

    console.log(`✅ Đăng nhập thành công! Token: ${token}`);

    // Trả về thông báo đăng nhập thành công
    return { 
        message: `Đăng nhập thành công! Xin chào, ${user.fullName}`, 
        token,
        user: { 
            fullName: user.fullName, 
            address: user.address, 
            phone: user.phone 
        }
    };
};


// Hàm đăng xuất
const logoutUser = async () => {
    return { message: "Đăng xuất thành công!" };
};

module.exports = { registerUser, loginUser, logoutUser };