const Employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class EmployeeService {
    // Đăng ký tài khoản (Chỉ Admin có thể tạo Employee)
    async registerEmployee(username, password, role) {
        if (!["admin", "employee"].includes(role)) {
            throw new Error("Vai trò không hợp lệ");
        }

        const existingEmployee = await Employee.findOne({ username });
        if (existingEmployee) {
            throw new Error("Tên tài khoản đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({ username, password: hashedPassword, role });
        return await newEmployee.save();
    }

    // Đăng nhập
    async loginEmployee(username, password) {
        const employee = await Employee.findOne({ username });
        if (!employee) throw new Error("Tài khoản không tồn tại");

        if (!employee.isActive) throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ Admin");

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) throw new Error("Mật khẩu không chính xác");

        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET, // Lấy từ biến môi trường
            { expiresIn: "1d" }
        );
        

        return { token, role: employee.role };
    }

    // Lấy thông tin tài khoản
    async getEmployeeById(id) {
        const employee = await Employee.findById(id).select("-password");
        if (!employee) throw new Error("Tài khoản không tồn tại");
        return employee;
    }

    // Khóa/Mở khóa tài khoản Employee (Chỉ Admin)
    async toggleEmployeeStatus(id, adminId) {
        const employee = await Employee.findById(id);
        if (!employee) throw new Error("Tài khoản không tồn tại");

        if (adminId === id) throw new Error("Bạn không thể tự khóa tài khoản của mình");

        employee.isActive = !employee.isActive;
        await employee.save();

        return { message: employee.isActive ? "Tài khoản đã được mở khóa" : "Tài khoản đã bị khóa", employee };
    }
}

module.exports = new EmployeeService();

