const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true }, 
    dateTime: { type: Date, required: true }, 
    details: { type: String, required: true }, 
    image: { type: String }, 
    activity: { type: String, required: true }, 
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true } 
}, { timestamps: true });

// ⚡ Kiểm tra model trước khi khởi tạo
const Itinerary = mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);

module.exports = Itinerary;
