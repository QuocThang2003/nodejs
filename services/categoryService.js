const Category = require("../models/category");
const Tour = require("../models/tour");

class CategoryService {
    async getAllCategories() {
        return await Category.find();
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async createCategory(data) {
        const { categoryName } = data;
        if (!categoryName) {
            throw new Error("Tên danh mục là bắt buộc!");
        }

        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            throw new Error("Danh mục đã tồn tại!");
        }

        const newCategory = new Category(data);
        return await newCategory.save();
    }

    async updateCategory(id, data) {
        return await Category.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteCategory(id) {
        // Kiểm tra xem category có đang được sử dụng trong tour nào không
        const tours = await Tour.find({ category: id });
        if (tours.length > 0) {
            throw new Error("Không thể xóa danh mục đang được sử dụng trong các tour!");
        }
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryService();