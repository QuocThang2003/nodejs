require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { connectDB } = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const initializeSocket = require("./socket"); // Import logic Socket.IO

// Import Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const tourRoutes = require("./routes/tourRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const forgetPasswordRoutes = require("./routes/forgetPasswordRoutes");
const googleloginRoutes = require("./routes/googleloginRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// 🚀 Kết nối Database
connectDB()
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 📌 Cấu hình session (CẦN CHO PASSPORT)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);

// 🛠 Import Passport và cấu hình chiến lược Google
require("./config/passport");

// 📌 Middleware CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 📌 Middleware khác
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🚀 Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// 🛠 Debug log (In ra request để kiểm tra)
app.use((req, res, next) => {
  console.log(`📩 [${req.method}] ${req.path}`, req.body);
  next();
});

// 🔗 Định tuyến API
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/forgetpass", forgetPasswordRoutes);
app.use("/auth/google", googleloginRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/categories", categoryRoutes);

// 🛠 Khởi tạo Socket.IO
initializeSocket(io);

// 🛠 Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Chạy server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));