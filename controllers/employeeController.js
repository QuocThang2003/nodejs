const employeeService = require("../services/employeeService");

exports.registerEmployee = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newEmployee = await employeeService.registerEmployee(username, password, role);
        res.status(201).json({ message: "Tài khoản được tạo thành công", employee: newEmployee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await employeeService.loginEmployee(username, password);

        // In ra terminal khi đăng nhập thành công
        console.log("🎉 Đăng nhập thành công:", result);

        res.json({ message: "Đăng nhập thành công", ...result });
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.logoutEmployee = async (req, res) => {
    try {
        // Chỉ cần trả về thông báo thành công khi đăng xuất
        res.json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        res.json(employee);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const result = await employeeService.toggleEmployeeStatus(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa nhân viên
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id; // ID của Admin từ token
        const result = await employeeService.deleteEmployee(id, adminId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};