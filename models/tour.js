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

module.exports = mongoose.model("Tour", TourSchema);
