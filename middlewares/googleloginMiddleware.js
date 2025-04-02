const jwt = require("jsonwebtoken");

const googleloginMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu user vào request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { googleloginMiddleware }; // Xuất middleware với tên mới
