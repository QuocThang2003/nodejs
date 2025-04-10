const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Mock module ./emailService trước khi require authService
jest.mock("../services/emailService", () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(true),
}));

const { registerUser } = require("../services/authService"); // Require sau khi mock

jest.mock("../models/user");
jest.mock("bcryptjs");

describe("AuthService - registerUser", () => {
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

  // Test 1: Đăng ký thành công với dữ liệu hợp lệ
  it("nên đăng ký thành công với dữ liệu hợp lệ", async () => {
    User.findOne.mockResolvedValue(null); // Email chưa tồn tại
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    const mockUser = {
      fullName: "Nguyen Van A",
      phone: "0123456789",
      email: "test@example.com",
      password: "hashedPassword123",
      address: "123 Street",
      save: jest.fn().mockResolvedValue(true),
    };
    User.mockImplementation(() => mockUser);

    const result = await registerUser(
      "Nguyen Van A",
      "0123456789",
      "test@example.com",
      "password123",
      "password123",
      "123 Street"
    );

    expect(result.message).toBe("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
    expect(result.email).toBe("test@example.com");
    expect(mockUser.save).toHaveBeenCalled();
  });

  // Test 2: Thất bại nếu thiếu trường bắt buộc
  it("nên thất bại nếu thiếu trường bắt buộc", async () => {
    await expect(registerUser("", "0123456789", "test@example.com", "password123", "password123", "123 Street"))
      .rejects.toThrow("Vui lòng điền đầy đủ tất cả các trường!");
  });

  // Test 3: Thất bại nếu email không hợp lệ
  it("nên thất bại nếu email không hợp lệ", async () => {
    await expect(registerUser("Nguyen Van A", "0123456789", "invalid-email", "password123", "password123", "123 Street"))
      .rejects.toThrow("Email không hợp lệ!");
  });

  // Test 4: Thất bại nếu mật khẩu không khớp
  it("nên thất bại nếu mật khẩu không khớp", async () => {
    await expect(registerUser("Nguyen Van A", "0123456789", "test@example.com", "password123", "password456", "123 Street"))
      .rejects.toThrow("Mật khẩu xác nhận không khớp!");
  });

  // Test 5: Thất bại nếu mật khẩu quá ngắn
  it("nên thất bại nếu mật khẩu quá ngắn", async () => {
    await expect(registerUser("Nguyen Van A", "0123456789", "test@example.com", "pass", "pass", "123 Street"))
      .rejects.toThrow("Mật khẩu phải có ít nhất 6 ký tự!");
  });

  // Test 6: Thất bại nếu email đã tồn tại
  it("nên thất bại nếu email đã tồn tại", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" }); // Email đã tồn tại
    await expect(registerUser("Nguyen Van A", "0123456789", "test@example.com", "password123", "password123", "123 Street"))
      .rejects.toThrow("Email đã được sử dụng!");
  });

  // Test 7: Thất bại nếu số điện thoại không hợp lệ
  it("nên thất bại nếu số điện thoại không hợp lệ", async () => {
    User.findOne.mockResolvedValue(null); // Đảm bảo email chưa tồn tại để đến bước kiểm tra phone
    await expect(registerUser("Nguyen Van A", "123", "test@example.com", "password123", "password123", "123 Street"))
      .rejects.toThrow("Số điện thoại không hợp lệ! Phải là 10 số và bắt đầu bằng 0.");
  });

  // Test 8: Thất bại nếu mã hóa mật khẩu lỗi
  it("nên thất bại nếu mã hóa mật khẩu lỗi", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockRejectedValue(new Error("Lỗi mã hóa"));
    await expect(registerUser("Nguyen Van A", "0123456789", "test@example.com", "password123", "password123", "123 Street"))
      .rejects.toThrow("Có lỗi xảy ra khi mã hóa mật khẩu!");
  });
});