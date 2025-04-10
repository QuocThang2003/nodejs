const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    isActive: { type: Boolean, default: true }, // Trạng thái khóa/mở khóa tài khoản
});

module.exports = mongoose.model("Employee", EmployeeSchema);
