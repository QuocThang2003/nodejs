
const Tour = require("../models/tour");
const reviewService = require("./reviewService");
class TourService {
    async getAllTours() {
        return await Tour.find();
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
        return await Tour.findById(id);
    }

    async createTour(data, file) {
        const img = file ? file.filename : null; // Nếu có file thì lấy filename
        const newTour = new Tour({ ...data, img });
        return await newTour.save();
    }

    async updateTour(id, data, file) {
        const img = file ? file.filename : data.img; // Nếu có ảnh mới thì cập nhật
        return await Tour.findByIdAndUpdate(id, { ...data, img }, { new: true });
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
