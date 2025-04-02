const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
        phone: { type: String, required: true, match: /^0\d{9}$/ },
        address: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ["unread", "read"], default: "unread" } // Thêm trạng thái
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
