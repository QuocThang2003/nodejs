const reviewService = require("../services/reviewService");

exports.getAllReviews = async (req, res) => {
    try {
        const { tourId } = req.query; // Lấy tourId từ query params
        const reviews = await reviewService.getAllReviews(tourId);

        if (reviews.message) {
            // Nếu có thông báo (không có đánh giá)
            return res.status(200).json({ message: reviews.message });
        }

        res.status(200).json(reviews); // Nếu có đánh giá, trả về danh sách
    } catch (error) {
        console.error("🔥 Lỗi lấy danh sách đánh giá:", error.message);
        res.status(500).json({ error: "Lỗi server khi lấy danh sách đánh giá!" });
    }
};



exports.createReview = async (req, res) => {
    try {
        const { bookingId, rating, reviewText } = req.body;
        const { tourId } = req.params; // Lấy tourId từ params
        const userId = req.user?.id; // Lấy userId từ session

        if (!userId) {
            return res.status(401).json({ error: "Bạn cần đăng nhập để đánh giá!" });
        }

        // Gọi service để tạo review
        const response = await reviewService.createReview(userId, tourId, bookingId, rating, reviewText);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi đánh giá:", error.message);
        res.status(500).json({ error: "Lỗi server khi đánh giá tour!" });
    }
};

// ⚡ API tính rating trung bình
exports.getAverageRating = async (req, res) => {
    try {
        const { tourId } = req.params;
        const ratingData = await reviewService.getAverageRating(tourId);
        res.status(200).json(ratingData);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server khi tính rating trung bình!" });
    }
};
// Thêm endpoint để kiểm tra xem người dùng có thể đánh giá không (tùy chọn)
exports.checkUserCanReview = async (req, res) => {
    try {
        const { tourId } = req.params;
        const { bookingId } = req.query; // Lấy bookingId từ query
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Bạn cần đăng nhập để kiểm tra!" });
        }

        const result = await reviewService.checkUserCanReview(userId, tourId, bookingId);
        res.status(200).json(result);
    } catch (error) {
        console.error("🔥 Lỗi kiểm tra điều kiện đánh giá:", error.message);
        res.status(500).json({ error: "Lỗi server khi kiểm tra điều kiện đánh giá!" });
    }
};
exports.editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reviewText } = req.body;
        const userId = req.user?.id; // Lấy userId từ token (được gán bởi middleware authenticate)

        if (!userId) {
            return res.status(401).json({ error: "Bạn cần đăng nhập để chỉnh sửa!" });
        }

        const response = await reviewService.editReview(userId, reviewId, reviewText);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi chỉnh sửa bình luận:", error.message);
        res.status(500).json({ error: "Lỗi server khi chỉnh sửa bình luận!" });
    }
};