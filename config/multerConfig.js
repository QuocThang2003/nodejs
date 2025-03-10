const multer = require("multer");
const fs = require("fs"); // Thêm module fs
const path = require("path");

// Kiểm tra và tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
