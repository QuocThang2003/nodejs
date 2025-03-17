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
        const { token, password, confirmPassword } = req.body;
        const response = await resetPassword(token, password, confirmPassword);
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { forgotPasswordHandler, resetPasswordHandler };
