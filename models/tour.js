const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
    tourName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    img: { type: String }
}, { timestamps: true });

// ⚡ Kiểm tra model trước khi khởi tạo
const Tour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);

module.exports = Tour;
