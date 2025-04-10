const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BookingService = require("../services/bookingService"); // Điều chỉnh đường dẫn nếu cần
const Tour = require("../models/tour");
const Booking = require("../models/Booking");
const Payment = require("../models/payment");
const vnPayService = require("../services/vnpayService"); // Điều chỉnh đường dẫn nếu cần

jest.mock("../models/Tour");
jest.mock("../models/Booking");
jest.mock("../models/Payment");
jest.mock("../services/vnPayService");

describe("BookingService - createBooking", () => {
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

  // Test 1: Tạo booking thành công với dữ liệu hợp lệ
  it("nên tạo booking thành công với dữ liệu hợp lệ", async () => {
    const mockTour = { _id: "tour123", price: 100 };
    const mockBooking = { 
      _id: "booking123", 
      userId: "user123", 
      tourId: "tour123", 
      total: 200, 
      save: jest.fn().mockResolvedValue({ _id: "booking123", userId: "user123", tourId: "tour123", total: 200 })
    };
    const mockPayment = { 
      bookingId: "booking123", 
      orderId: expect.any(String), 
      amount: 200, 
      save: jest.fn().mockResolvedValue(true) 
    };
  
    Tour.findById.mockResolvedValue(mockTour);
    Booking.mockImplementation(() => mockBooking);
    Payment.mockImplementation(() => mockPayment);
    vnPayService.createPaymentUrl.mockResolvedValue("http://payment.url");
  
    const result = await BookingService.createBooking("user123", "tour123", 2);
    expect(result.status).toBe(201);
    expect(result.data.message).toBe("Vui lòng thanh toán!");
    expect(result.data.paymentUrl).toBe("http://payment.url");
    expect(result.data.bookingId).toBe("booking123");
  });

  // Test 2: Thất bại khi tourId hoặc quantity không hợp lệ
  it("nên thất bại khi tourId hoặc quantity không hợp lệ", async () => {
    const result = await BookingService.createBooking("user123", null, 0);
    expect(result.status).toBe(400);
    expect(result.data.error).toBe("Thông tin không hợp lệ!");
  });

  // Test 3: Thất bại khi tour không tồn tại
  it("nên thất bại khi tour không tồn tại", async () => {
    Tour.findById.mockResolvedValue(null);
    const result = await BookingService.createBooking("user123", "tour999", 1);
    expect(result.status).toBe(404);
    expect(result.data.error).toBe("Tour không tồn tại!");
  });

  // Test 4: Thất bại khi lưu booking bị lỗi
  it("nên thất bại khi lưu booking bị lỗi", async () => {
    const mockTour = { _id: "tour123", price: 100 };
    Tour.findById.mockResolvedValue(mockTour);
    Booking.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Lỗi lưu database")),
    }));

    const result = await BookingService.createBooking("user123", "tour123", 2);
    expect(result.status).toBe(500);
    expect(result.data.error).toBe("Lỗi server khi đặt tour!");
  });

  // Test 5: Thất bại khi tạo payment hoặc URL thanh toán bị lỗi
  it("nên thất bại khi tạo payment hoặc URL thanh toán bị lỗi", async () => {
    const mockTour = { _id: "tour123", price: 100 };
    const mockBooking = { 
      _id: "booking123", 
      userId: "user123", 
      tourId: "tour123", 
      total: 200, 
      save: jest.fn().mockResolvedValue(true) 
    };

    Tour.findById.mockResolvedValue(mockTour);
    Booking.mockImplementation(() => mockBooking);
    Payment.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Lỗi lưu payment")),
    }));

    const result = await BookingService.createBooking("user123", "tour123", 2);
    expect(result.status).toBe(500);
    expect(result.data.error).toBe("Lỗi server khi đặt tour!");
  });

  // Test 6: Thất bại khi userId không được cung cấp
  it("nên thất bại khi userId không được cung cấp", async () => {
    const mockTour = { _id: "tour123", price: 100 };
    Tour.findById.mockResolvedValue(mockTour);

    const result = await BookingService.createBooking(null, "tour123", 1);
    expect(result.status).toBe(400);
    expect(result.data.error).toBe("Thông tin không hợp lệ!");
  });

  // Test 7: Thất bại khi vnPayService trả về lỗi
  it("nên thất bại khi vnPayService trả về lỗi", async () => {
    const mockTour = { _id: "tour123", price: 100 };
    const mockBooking = { 
      _id: "booking123", 
      userId: "user123", 
      tourId: "tour123", 
      total: 200, 
      save: jest.fn().mockResolvedValue(true) 
    };
    const mockPayment = { 
      bookingId: "booking123", 
      orderId: expect.any(String), 
      amount: 200, 
      save: jest.fn().mockResolvedValue(true) 
    };

    Tour.findById.mockResolvedValue(mockTour);
    Booking.mockImplementation(() => mockBooking);
    Payment.mockImplementation(() => mockPayment);
    vnPayService.createPaymentUrl.mockRejectedValue(new Error("Lỗi từ VNPay"));

    const result = await BookingService.createBooking("user123", "tour123", 2);
    expect(result.status).toBe(500);
    expect(result.data.error).toBe("Lỗi server khi đặt tour!");
  });
});