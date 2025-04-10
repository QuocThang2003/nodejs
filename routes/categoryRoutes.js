const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes CRUD cho Category
router.get("/", categoryController.getAllCategories); // Ai cũng có thể xem
router.get("/:id", categoryController.getCategoryById); // Ai cũng có thể xem

// Chỉ Admin hoặc Employee mới có quyền thêm/sửa/xóa category
router.post("/", 
    authMiddleware.authenticate, 
    authMiddleware.isAdminOrEmployee, 
    categoryController.createCategory
);
router.put("/:id", 
    authMiddleware.authenticate, 
    authMiddleware.isAdminOrEmployee, 
    categoryController.updateCategory
);
router.delete("/:id", 
    authMiddleware.authenticate, 
    authMiddleware.isAdminOrEmployee, 
    categoryController.deleteCategory
);

module.exports = router;