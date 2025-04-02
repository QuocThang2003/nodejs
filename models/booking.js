const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    total: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        required: true, 
        enum: ["Pending", "Cancelled", "Paid"], 
        default: "Pending" 
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);