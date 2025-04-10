// exports.createReview (service logic)
exports.createReview = async (userId, tourId, bookingId, rating, reviewText) => {
  try {
      // In ra để kiểm tra dữ liệu nhận từ client
      console.log("📌 Booking ID nhận từ client:", bookingId);
      console.log("📌 User ID nhận từ client:", userId);
      console.log("📌 Tour ID nhận từ client:", tourId);

      // Kiểm tra xem booking có tồn tại không
      const booking = await Booking.findOne({ _id: bookingId, userId, tourId, status: "Paid" });

      if (!booking) {
          console.log("❌ Không tìm thấy booking hợp lệ trong DB:", { bookingId, userId, tourId });
          return { status: 400, data: { error: "Bạn chỉ có thể đánh giá sau khi thanh toán!" } };
      }

      // Kiểm tra xem người dùng đã đánh giá tour này chưa
      const existingReview = await Review.findOne({ userId, tourId });
      if (existingReview) {
          return { status: 400, data: { error: "Bạn đã đánh giá tour này rồi!" } };
      }

      // Tạo đánh giá mới
      const newReview = new Review({ userId, tourId, bookingId, rating, reviewText });
      await newReview.save();

      console.log("✅ Đánh giá thành công:", newReview);
      return { status: 201, data: { message: "Đánh giá thành công!", review: newReview } };
  } catch (error) {
      console.error("🔥 Lỗi trong service:", error); // Log lỗi chi tiết
      return { status: 500, data: { error: "Lỗi server khi tạo review!", details: error.message } };
  }
};

// Test file
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const ReviewService = require("../services/reviewService");
const Booking = require("../models/Booking");
const Review = require("../models/review");

jest.mock("../models/Booking");
jest.mock("../models/review");

describe("ReviewService - createReview", () => {
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

// Test 1: Tạo đánh giá thành công với dữ liệu hợp lệ
it("nên tạo đánh giá thành công với dữ liệu hợp lệ", async () => {
  Booking.findOne.mockResolvedValue({ _id: "booking789", userId: "user123", tourId: "tour456", status: "Paid" });
  Review.findOne.mockResolvedValue(null);
  const mockReview = { userId: "user123", tourId: "tour456", bookingId: "booking789", rating: 5, reviewText: "Tuyệt vời!", save: jest.fn().mockResolvedValue(true) };
  Review.mockImplementation(() => mockReview);

  const result = await ReviewService.createReview("user123", "tour456", "booking789", 5, "Tuyệt vời!");
  expect(result.status).toBe(201);
  expect(result.data.message).toBe("Đánh giá thành công!");
});

// Test 2: Thất bại khi booking không hợp lệ hoặc chưa thanh toán
it("nên thất bại khi booking không hợp lệ hoặc chưa thanh toán", async () => {
  Booking.findOne.mockResolvedValue(null);
  const result = await ReviewService.createReview("user123", "tour456", "booking999", 4, "Tốt");
  expect(result.status).toBe(400);
  expect(result.data.error).toBe("Bạn chỉ có thể đánh giá sau khi thanh toán!");
});

// Test 3: Thất bại khi người dùng đã đánh giá tour này rồi
it("nên thất bại khi người dùng đã đánh giá tour này rồi", async () => {
  Booking.findOne.mockResolvedValue({ _id: "booking789", userId: "user123", tourId: "tour456", status: "Paid" });
  Review.findOne.mockResolvedValue({ _id: "review123" });
  const result = await ReviewService.createReview("user123", "tour456", "booking789", 3, "Bình thường");
  expect(result.status).toBe(400);
  expect(result.data.error).toBe("Bạn đã đánh giá tour này rồi!");
});

// Test 4: Thất bại khi lưu đánh giá bị lỗi
it("nên thất bại khi lưu đánh giá bị lỗi", async () => {
  Booking.findOne.mockResolvedValue({ _id: "booking789", userId: "user123", tourId: "tour456", status: "Paid" });
  Review.findOne.mockResolvedValue(null);
  Review.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error("Lỗi lưu database")) }));
  const result = await ReviewService.createReview("user123", "tour456", "booking789", 5, "Rất tốt");
  expect(result.status).toBe(500);
  expect(result.data.error).toBe("Lỗi server khi tạo review!");
});

// Test 5: Thất bại khi kiểm tra booking bị lỗi
it("nên thất bại khi kiểm tra booking bị lỗi", async () => {
  Booking.findOne.mockRejectedValue(new Error("Lỗi truy vấn database"));
  const result = await ReviewService.createReview("user123", "tour456", "booking789", 4, "Khá ổn");
  expect(result.status).toBe(500);
  expect(result.data.error).toBe("Lỗi server khi tạo review!");
});

// Test 6: Thất bại khi dữ liệu đầu vào không đầy đủ (thiếu rating hoặc reviewText)
it("nên thất bại khi dữ liệu đầu vào không đầy đủ", async () => {
  Booking.findOne.mockResolvedValue({ _id: "booking789", userId: "user123", tourId: "tour456", status: "Paid" });
  Review.findOne.mockResolvedValue(null);

  // Giả lập trường hợp thiếu rating
  const result = await ReviewService.createReview("user123", "tour456", "booking789", undefined, "Tuyệt vời!");

  expect(result.status).toBe(500); // Có thể thay bằng 400 nếu thêm validation
  expect(result.data.error).toBe("Lỗi server khi tạo review!");
});

// Test 7: Thất bại khi tourId hoặc userId không khớp với booking
it("nên thất bại khi tourId hoặc userId không khớp với booking", async () => {
  // Booking trả về không khớp với tourId hoặc userId được cung cấp
  Booking.findOne.mockResolvedValue(null);

  const result = await ReviewService.createReview("user123", "tour456", "booking789", 5, "Tuyệt vời!");

  expect(result.status).toBe(400);
  expect(result.data.error).toBe("Bạn chỉ có thể đánh giá sau khi thanh toán!");
});
});