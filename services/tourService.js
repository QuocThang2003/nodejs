
const Tour = require("../models/tour");
const reviewService = require("./reviewService");
const Category = require("../models/category");
class TourService {
    async getAllTours() {
        return await Tour.find().populate("category", "categoryName");
    }
    async searchTours({ tourName }) {
        if (!tourName) {
            throw new Error("Thiếu tham số tourName");
        }
    
        // Xóa khoảng trắng đầu/cuối và xuống dòng (\n, \r)
        tourName = tourName.trim();
    
        console.log("📩 Giá trị tourName sau khi xử lý:", tourName);
    
        const filter = {
            tourName: { $regex: tourName, $options: "i" }
        };
    
        console.log("🔍 Bộ lọc tìm kiếm:", JSON.stringify(filter, null, 2));
    
        const tours = await Tour.find(filter).collation({ locale: "vi", strength: 1 });
    
        console.log("📌 Kết quả tìm kiếm:", tours);
    
        return tours.length ? tours : null;
    }
    
    


    async getTourById(id) {
        return await Tour.findById(id).populate("category", "categoryName");
    }

    async createTour(data, file) {
        // Danh sách các trường bắt buộc theo schema
        const requiredFields = ["tourName", "price", "quantity", "startDate", "endDate", "category"];
        const missingFields = requiredFields.filter((field) => !data[field] && data[field] !== 0); // Cho phép giá trị 0
        if (missingFields.length > 0) {
            throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(", ")}`);
        }
    
        // Kiểm tra category có tồn tại không
        const categoryExists = await Category.findById(data.category);
        if (!categoryExists) {
            throw new Error("Danh mục không tồn tại!");
        }
    
        // Chuyển đổi price và quantity từ string sang number (vì form-data gửi string)
        const price = Number(data.price);
        const quantity = Number(data.quantity);
    
        // Kiểm tra kiểu dữ liệu sau khi chuyển đổi
        if (isNaN(price) || isNaN(quantity)) {
            throw new Error("Price và Quantity phải là số hợp lệ!");
        }
    
        // Kiểm tra giá trị âm
        if (price < 0 || quantity < 0) {
            throw new Error("Price và Quantity không được âm!");
        }
    
        // Chuyển đổi startDate và endDate sang Date
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
    
        // Kiểm tra ngày hợp lệ
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ!");
        }
        if (endDate <= startDate) {
            throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        }
    
        // Xử lý ảnh
        const img = file ? file.filename : null;
    
        // Tạo tour mới với dữ liệu đã xử lý
        const newTour = new Tour({
            tourName: data.tourName,
            description: data.description || "", // Trường không bắt buộc
            price: price,
            quantity: quantity,
            startDate: startDate,
            endDate: endDate,
            category: data.category,
            img: img
        });
    
        return await newTour.save();
    }

    async updateTour(id, data, file) {
        if (data.category) {
            const categoryExists = await Category.findById(data.category);
            if (!categoryExists) {
                throw new Error("Danh mục không tồn tại!");
            }
        }

        const img = file ? file.filename : data.img;
        return await Tour.findByIdAndUpdate(
            id, 
            { ...data, img }, 
            { new: true }
        ).populate("category", "categoryName");
    }

    async deleteTour(id) {
        return await Tour.findByIdAndDelete(id);
    }
    


// ⚡ Hàm lấy tất cả thông tin chi tiết của tour (bỏ description)
    async getAllTourDetail() {
    try {
        const tours = await Tour.find().select("-description");

        // Lấy đánh giá trung bình của từng tour
        const toursWithRating = await Promise.all(
            tours.map(async (tour) => {
                const ratingData = await reviewService.getAverageRating(tour._id);
                return {
                    ...tour.toObject(),
                    rating: ratingData || "Chưa có đánh giá", // Nếu chưa có đánh giá, hiển thị "Chưa có đánh giá"
                };
            })
        );

        return toursWithRating;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tour:", error);
        throw new Error("Lỗi server khi lấy danh sách tour!");
    }
}
}

module.exports = new TourService();
