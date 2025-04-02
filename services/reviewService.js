const Booking = require("../models/Booking");
const Review = require("../models/review");
const mongoose = require("mongoose");
exports.getAllReviews = async (tourId) => {
    try {
        // Kiểm tra nếu không có `tourId`, trả về thông báo "Chưa có đánh giá"
        if (!tourId) {
            return { message: "Tour này chưa được đánh giá." };
        }

        // Lấy danh sách đánh giá theo tourId nếu có
        const reviews = await Review.find({ tourId }) // Lọc theo tourId
            .populate("userId", "fullName") // Chỉ lấy tên user
            .select("reviewText userId rating tourId") // Chỉ lấy reviewText, userId, rating, và tourId
            .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return { message: "Tour này chưa được đánh giá." }; // Nếu không có đánh giá cho tour này
        }

        return reviews; // Trả về danh sách đánh giá
    } catch (error) {
        throw new Error("Lỗi server khi lấy danh sách đánh giá!"); // Xử lý lỗi
    }
};


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


// ⚡ Thêm hàm tính rating trung bình của một tour
exports.getAverageRating = async (tourId) => {
    try {
        if (!tourId) {
            return { message: "Tour này chưa được đánh giá." };
        }

        console.log("Tour ID nhận được:", tourId);

        const objectIdTourId = new mongoose.Types.ObjectId(tourId); // Chuyển đổi sang ObjectId

        const result = await Review.aggregate([
            { $match: { tourId: objectIdTourId } }, // Lọc theo tourId
            {
                $group: {
                    _id: "$tourId",
                    averageRating: { $avg: "$rating" }, // Tính trung bình rating
                    totalReviews: { $sum: 1 } // Đếm số lượng đánh giá
                }
            }
        ]);

        if (result.length === 0) {
            return { message: "Chưa có đánh giá nào cho tour này." };
        }

        return {
            averageRating: result[0].averageRating.toFixed(1), // Làm tròn 1 chữ số
            totalReviews: result[0].totalReviews
        };
    } catch (error) {
        console.log("Lỗi khi tính toán rating trung bình:", error);
        return { error: "Lỗi server khi tính toán rating trung bình!" };
    }
};
// Hàm kiểm tra xem người dùng có thể đánh giá không
exports.checkUserCanReview = async (userId, tourId, bookingId) => {
    try {
        // Kiểm tra xem booking có tồn tại và hợp lệ không
        const booking = await Booking.findOne({
            _id: bookingId,
            userId,
            tourId,
            status: "Paid",
        });

        if (!booking) {
            return {
                canReview: false,
                message: "Bạn chỉ có thể đánh giá sau khi thanh toán!",
            };
        }

        // Kiểm tra xem người dùng đã đánh giá tour này chưa
        const existingReview = await Review.findOne({ userId, tourId });
        if (existingReview) {
            return {
                canReview: false,
                message: "Bạn đã đánh giá tour này rồi!",
            };
        }

        return {
            canReview: true,
            message: "Bạn có thể đánh giá tour này.",
        };
    } catch (error) {
        console.error("🔥 Lỗi khi kiểm tra điều kiện đánh giá:", error);
        return {
            canReview: false,
            message: "Lỗi server khi kiểm tra điều kiện đánh giá!",
        };
    }
};