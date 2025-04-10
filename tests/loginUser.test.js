const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { loginUser } = require("../services/authService"); // Điều chỉnh đường dẫn nếu cần
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService - loginUser", () => {
  let mongoServer;

  // Chuẩn bị trước khi chạy tất cả test
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Dọn dẹp sau khi chạy xong tất cả test
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // Xóa mock trước mỗi test để tránh ảnh hưởng lẫn nhau
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Đăng nhập thành công với thông tin hợp lệ
  it("nên đăng nhập thành công với thông tin hợp lệ", async () => {
    const mockUser = {
      _id: "user123",
      fullName: "Nguyen Van A",
      phone: "0123456789",
      email: "test@example.com",
      password: "hashedPassword123",
      address: "123 Street",
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    const result = await loginUser("test@example.com", "password123");

    expect(result.message).toBe("Đăng nhập thành công! Xin chào, Nguyen Van A");
    expect(result.token).toBe("mockToken");
    expect(result.user).toEqual({
      fullName: "Nguyen Van A",
      address: "123 Street",
      phone: "0123456789",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user123", fullName: "Nguyen Van A", address: "123 Street", phone: "0123456789" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  // Test 2: Thất bại nếu thiếu email hoặc mật khẩu
  it("nên thất bại nếu thiếu email hoặc mật khẩu", async () => {
    await expect(loginUser("", "password123"))
      .rejects.toThrow("Vui lòng nhập email và mật khẩu!");
  });

  // Test 3: Thất bại nếu email không hợp lệ
  it("nên thất bại nếu email không hợp lệ", async () => {
    await expect(loginUser("invalid-email", "password123"))
      .rejects.toThrow("Email không hợp lệ!");
  });

  // Test 4: Thất bại nếu mật khẩu quá ngắn
  it("nên thất bại nếu mật khẩu quá ngắn", async () => {
    await expect(loginUser("test@example.com", "pass"))
      .rejects.toThrow("Mật khẩu phải có ít nhất 6 ký tự!");
  });

  // Test 5: Thất bại nếu email không tồn tại
  it("nên thất bại nếu email không tồn tại", async () => {
    User.findOne.mockResolvedValue(null);
    await expect(loginUser("test@example.com", "password123"))
      .rejects.toThrow("Email hoặc mật khẩu không đúng!");
  });

  // Test 6: Thất bại nếu mật khẩu sai
  it("nên thất bại nếu mật khẩu sai", async () => {
    const mockUser = {
      email: "test@example.com",
      password: "hashedPassword123",
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    await expect(loginUser("test@example.com", "wrongpassword"))
      .rejects.toThrow("Email hoặc mật khẩu không đúng!");
  });

  // Test 7: Thất bại nếu có lỗi server khi truy vấn database
  it("nên thất bại nếu có lỗi server khi truy vấn database", async () => {
    User.findOne.mockRejectedValue(new Error("Lỗi kết nối database"));
    await expect(loginUser("test@example.com", "password123"))
      .rejects.toThrow("Lỗi kết nối database");
  });
});