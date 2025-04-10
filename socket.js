const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config/env");

const initializeSocket = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Một người dùng đã kết nối:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded;
      } catch (error) {
        console.log("Xác thực thất bại:", error.message);
        socket.emit("error", { message: "Token không hợp lệ!" });
        socket.disconnect();
      }
    });

    socket.on("setRole", (role) => {
      if (!socket.user) {
        socket.emit("error", { message: "Chưa xác thực!" });
        return;
      }

      const userRole = socket.user.role;
      if (role === "admin" && userRole !== "admin") {
        socket.emit("error", { message: "Bạn không có quyền truy cập vai trò admin!" });
        return;
      }

      if (role === "admin") {
        socket.join("adminRoom");
        console.log("Admin đã kết nối:", socket.id);
        socket.emit("onlineUsers", Array.from(onlineUsers.entries()));
      } else if (role === "user") {
        const userId = socket.user.id;
        const fullName = socket.user.fullName;
        socket.join(userId);
        onlineUsers.set(userId, fullName);
        console.log(`User ${fullName} (${userId}) đã tham gia phòng riêng`);
        io.to("adminRoom").emit("onlineUsers", Array.from(onlineUsers.entries()));
      }
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineUsers.entries()));
    });

    socket.on("sendMessageToAdmin", ({ message }) => {
      if (!socket.user) {
        socket.emit("error", { message: "Chưa xác thực!" });
        return;
      }
      const { id: userId, fullName } = socket.user;
      io.to("adminRoom").emit("messageFromUser", {
        userId,
        fullName,
        message,
        timestamp: new Date().toLocaleTimeString(),
      });
      socket.emit("messageFromUser", {
        userId,
        fullName,
        message,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    socket.on("sendMessageToUser", ({ message, userId }) => {
      if (!socket.user || socket.user.role !== "admin") {
        socket.emit("error", { message: "Bạn không có quyền gửi tin nhắn!" });
        return;
      }
      const timestamp = new Date().toLocaleTimeString();
      io.to(userId).emit("messageFromAdmin", {
        message,
        timestamp,
      });
      // Gửi xác nhận cho admin
      socket.emit("messageSentConfirmation", {
        userId,
        message,
        timestamp,
      });
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        const { id: userId, fullName } = socket.user;
        console.log(`Người dùng ${fullName} (${userId}) đã ngắt kết nối`);
        onlineUsers.delete(userId);
        io.to("adminRoom").emit("onlineUsers", Array.from(onlineUsers.entries()));
      } else {
        console.log(`Người dùng chưa xác thực ${socket.id} đã ngắt kết nối`);
      }
    });
  });
};

module.exports = initializeSocket;