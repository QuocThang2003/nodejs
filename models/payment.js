const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    orderId: { type: String, required: true, unique: true },  // orderId của VNPAY
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ["Pending", "Failed", "Paid"], 
        default: "Pending" 
    },
    paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
