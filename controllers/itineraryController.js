const itineraryService = require("../services/itineraryService");

// 📌 Lấy tất cả lịch trình
exports.getAllItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryService.getAllItineraries();
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy tất cả lịch trình theo tourId
exports.getAllItineraries = async (req, res) => {
    const { tourId } = req.params; // Lấy tourId từ params

    try {
        if (!tourId) {
            return res.status(400).json({ message: "TourId không hợp lệ." });
        }

        const itineraries = await itineraryService.getAllItinerariesByTourId(tourId);

        // Kiểm tra nếu không có itineraries
        if (itineraries.length === 0) {
            return res.status(404).json({ message: "Chưa có danh sách lịch trình cho tour này." });
        }

        res.json(itineraries); // Trả về danh sách itineraries
    } catch (error) {
        console.error("Lỗi khi lấy itineraries:", error);
        res.status(500).json({ message: error.message });
    }
};

// 📌 Tạo mới lịch trình
exports.createItinerary = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        const newItinerary = await itineraryService.createItinerary(data);
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Cập nhật lịch trình
exports.updateItinerary = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        const updatedItinerary = await itineraryService.updateItinerary(req.params.id, data);
        if (!updatedItinerary) {
            return res.status(404).json({ message: "Lịch trình không tồn tại." });
        }
        res.json(updatedItinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Xóa lịch trình
exports.deleteItinerary = async (req, res) => {
    try {
        const deletedItinerary = await itineraryService.deleteItinerary(req.params.id);
        if (!deletedItinerary) {
            return res.status(404).json({ message: "Lịch trình không tồn tại." });
        }
        res.json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
