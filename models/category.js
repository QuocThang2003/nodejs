const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categoryName: { 
        type: String, 
        required: true,
        unique: true 
    },
    description: { 
        type: String 
    }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
module.exports = Category;