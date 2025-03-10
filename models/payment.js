const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
