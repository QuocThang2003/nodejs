const tourService = require("../services/tourService");

exports.getAllTours = async (req, res) => {
    try {
        const tours = await tourService.getAllTours();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tour = await tourService.getTourById(req.params.id);
        if (!tour) return res.status(404).json({ message: "Tour không tồn tại" });
        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.createTour = async (req, res) => {
    try {
        console.log("📩 Dữ liệu nhận từ client:", req.body);
        console.log("📷 File upload:", req.file);

        const newTour = await tourService.createTour(req.body, req.file);
        res.status(201).json(newTour);
    } catch (error) {
        console.error("🔥 Lỗi chi tiết:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await tourService.updateTour(req.params.id, req.body, req.file);
        if (!updatedTour) {
            return res.status(404).json({ message: "Tour không tồn tại hoặc ID không hợp lệ" });
        }
        res.json(updatedTour);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await tourService.deleteTour(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: "Tour không tồn tại" });
        res.json({ message: "Tour đã được xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
