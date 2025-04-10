const CategoryService = require("../services/categoryService");

class CategoryController {
    // Lấy tất cả danh mục
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server khi lấy danh sách danh mục!"
            });
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục!"
                });
            }
            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server khi lấy thông tin danh mục!"
            });
        }
    }

    // Tạo danh mục mới
    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const newCategory = await CategoryService.createCategory(categoryData);
            res.status(201).json({
                success: true,
                data: newCategory,
                message: "Tạo danh mục thành công!"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi khi tạo danh mục!"
            });
        }
    }

    // Cập nhật danh mục
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            const updatedCategory = await CategoryService.updateCategory(id, categoryData);
            if (!updatedCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục để cập nhật!"
                });
            }
            res.status(200).json({
                success: true,
                data: updatedCategory,
                message: "Cập nhật danh mục thành công!"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi khi cập nhật danh mục!"
            });
        }
    }

    // Xóa danh mục
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const deletedCategory = await CategoryService.deleteCategory(id);
            if (!deletedCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục để xóa!"
                });
            }
            res.status(200).json({
                success: true,
                message: "Xóa danh mục thành công!"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi khi xóa danh mục!"
            });
        }
    }
}

module.exports = new CategoryController();