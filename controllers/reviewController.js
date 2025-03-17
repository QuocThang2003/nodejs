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

        // Kiểm tra xem tourId có tồn tại không
        if (!tourId) {
            return res.status(400).json({ error: "Thiếu tourId!" });
        }

        // Kiểm tra xem bookingId có tồn tại không
        if (!bookingId) {
            return res.status(400).json({ error: "Thiếu bookingId!" });
        }

        // Gọi service để tạo review
        const response = await reviewService.createReview(userId, tourId, bookingId, rating, reviewText);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("🔥 Lỗi đánh giá:", error); // In toàn bộ lỗi
        res.status(500).json({ error: "Lỗi server khi đánh giá tour!", details: error.message });
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