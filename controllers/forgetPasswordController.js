const { forgotPassword, resetPassword } = require("../services/forgetPasswordService");

const forgotPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await forgotPassword(email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const resetPasswordHandler = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body; // 👈 Kiểm tra nếu req.body không có token
        console.log("📢 Token nhận được từ body:", token);

        if (!token) return res.status(400).json({ error: "Token không được cung cấp" });

        const response = await resetPassword(token, password, confirmPassword);
        res.json(response);
    } catch (error) {
        console.error("❌ Lỗi reset password:", error.message);
        res.status(400).json({ error: error.message });
    }
};
;

module.exports = { forgotPasswordHandler, resetPasswordHandler };
