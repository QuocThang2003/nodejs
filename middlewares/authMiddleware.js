const jwt = require("jsonwebtoken");

// Middleware xác thực JWT
exports.authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Truy cập bị từ chối. Không có token." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "secret_key");
        req.user = decoded; // Gán thông tin user vào request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token không hợp lệ." });
    }
};

// Middleware kiểm tra quyền Admin
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Truy cập bị từ chối. Chỉ Admin có quyền thực hiện thao tác này." });
    }
    next();
};
