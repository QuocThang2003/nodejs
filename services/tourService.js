
const Tour = require("../models/tour");

class TourService {
    async getAllTours() {
        return await Tour.find();
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
}

module.exports = new TourService();
