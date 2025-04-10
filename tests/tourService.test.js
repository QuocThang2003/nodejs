const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const TourService = require("../services/tourService"); // Điều chỉnh đường dẫn nếu cần
const Tour = require("../models/tour");

jest.mock("../models/tour");

describe("TourService - createTour", () => {
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

  // Test 1: Tạo tour thành công với dữ liệu hợp lệ và có ảnh
  it("nên tạo tour thành công với dữ liệu hợp lệ và có ảnh", async () => {
    const mockData = {
      tourName: "Tour Đà Lạt",
      price: 1000000,
      quantity: 20,
      startDate: "2025-05-01",
      endDate: "2025-05-05",
    };
    const mockFile = { filename: "dalat.jpg" };
    const mockTour = {
      ...mockData,
      img: "dalat.jpg",
      save: jest.fn().mockResolvedValue({
        _id: "tour123",
        ...mockData,
        img: "dalat.jpg",
      }),
    };

    Tour.mockImplementation(() => mockTour);

    const result = await TourService.createTour(mockData, mockFile);

    expect(result._id).toBe("tour123");
    expect(result.tourName).toBe("Tour Đà Lạt");
    expect(result.img).toBe("dalat.jpg");
    expect(mockTour.save).toHaveBeenCalled();
  });

  // Test 2: Tạo tour thành công mà không có ảnh
  it("nên tạo tour thành công khi không có ảnh", async () => {
    const mockData = {
      tourName: "Tour Nha Trang",
      price: 1500000,
      quantity: 15,
      startDate: "2025-06-01",
      endDate: "2025-06-04",
    };
    const mockTour = {
      ...mockData,
      img: null,
      save: jest.fn().mockResolvedValue({
        _id: "tour124",
        ...mockData,
        img: null,
      }),
    };

    Tour.mockImplementation(() => mockTour);

    const result = await TourService.createTour(mockData, null);

    expect(result._id).toBe("tour124");
    expect(result.tourName).toBe("Tour Nha Trang");
    expect(result.img).toBeNull();
    expect(mockTour.save).toHaveBeenCalled();
  });

  // Test 3: Thất bại nếu thiếu các trường bắt buộc
  it("nên thất bại nếu thiếu các trường bắt buộc", async () => {
    const mockData = {
      price: 1000000, // Thiếu tourName, quantity, startDate, endDate
    };

    await expect(TourService.createTour(mockData, null)).rejects.toThrow(
      "Thiếu các trường bắt buộc: tourName, quantity, startDate, endDate"
    );
  });

  // Test 4: Thất bại nếu lưu tour vào database bị lỗi
  it("nên thất bại nếu lưu tour vào database bị lỗi", async () => {
    const mockData = {
      tourName: "Tour Hà Nội",
      price: 2000000,
      quantity: 10,
      startDate: "2025-07-01",
      endDate: "2025-07-03",
    };
    const mockTour = {
      ...mockData,
      img: null,
      save: jest.fn().mockRejectedValue(new Error("Lỗi lưu database")),
    };

    Tour.mockImplementation(() => mockTour);

    await expect(TourService.createTour(mockData, null)).rejects.toThrow("Lỗi lưu database");
    expect(mockTour.save).toHaveBeenCalled();
  });

  // Test 5: Thất bại nếu dữ liệu có kiểu không hợp lệ
  it("nên thất bại nếu dữ liệu có kiểu không hợp lệ", async () => {
    const mockData = {
      tourName: "Tour Sài Gòn",
      price: "invalid_price", // Giá phải là số
      quantity: 5,
      startDate: "2025-08-01",
      endDate: "2025-08-03",
    };

    await expect(TourService.createTour(mockData, null)).rejects.toThrow("Price và Quantity phải là số!");
  });

  // Test 6: Thất bại nếu ngày kết thúc nhỏ hơn ngày bắt đầu
  it("nên thất bại nếu ngày kết thúc nhỏ hơn ngày bắt đầu", async () => {
    const mockData = {
      tourName: "Tour Huế",
      price: 1200000,
      quantity: 8,
      startDate: "2025-09-05",
      endDate: "2025-09-01", // endDate < startDate
    };

    await expect(TourService.createTour(mockData, null)).rejects.toThrow(
      "Ngày kết thúc phải lớn hơn ngày bắt đầu!"
    );
  });

  // Test 7: Thất bại nếu file ảnh không có thuộc tính filename
  it("nên thất bại nếu file ảnh không có thuộc tính filename", async () => {
    const mockData = {
      tourName: "Tour Đà Nẵng",
      price: 1800000,
      quantity: 12,
      startDate: "2025-10-01",
      endDate: "2025-10-05",
    };
    const mockFile = {}; // File không có filename

    await expect(TourService.createTour(mockData, mockFile)).rejects.toThrow(
      "File ảnh không hợp lệ!"
    );
  });
});