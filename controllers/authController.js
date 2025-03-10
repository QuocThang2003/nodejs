const { registerUser, loginUser } = require("../services/authService");

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
        res.cookie("token", response.token, { httpOnly: true, secure: false });
        res.json({ message: response.message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { register, login };
