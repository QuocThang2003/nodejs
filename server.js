require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const tourRoutes = require("./routes/tourRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Kết nối database
connectDB()
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Dừng server nếu lỗi kết nối DB
  });

// Middleware
app.use(express.json()); // Đọc dữ liệu JSON từ request
const cors = require("cors");
app.use("/uploads", express.static("uploads")); // Hỗ trợ cung cấp ảnh từ thư mục uploads
app.use(cors());

// Debug log
app.use((req, res, next) => {
  console.log(`📩 [${req.method}] ${req.path}`, req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/booking", bookingRoutes);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
