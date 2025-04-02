const { registerUser, loginUser, logoutUser } = require("../services/authService");

const register = async (req, res) => {
    try {
        const { fullName, phone, email, password, confirmPassword, address } = req.body;
        const response = await registerUser(fullName, phone, email, password, confirmPassword, address);
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await loginUser(email, password);

        // ✅ Lưu token vào cookie (nếu cần)
        res.cookie("token", response.token, { httpOnly: true, secure: false });

        // ✅ TRẢ TOKEN về JSON response để frontend nhận được
        res.json({ message: response.message, token: response.token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const logout = async (req, res) => {
    try {
        // Chỉ cần trả về thông báo thành công khi đăng xuất
        res.json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
};



module.exports = { register, login,logout };
