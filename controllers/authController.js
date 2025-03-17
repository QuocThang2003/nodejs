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
        const response = await logoutUser();
        
        res.clearCookie("token"); // Xóa token khỏi cookie
        res.json(response); // Trả về thông báo JSON
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
};


module.exports = { register, login,logout };
