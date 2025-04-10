const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes CRUD cho Tour
router.get("/search", tourController.searchTours); // Ai cũng có thể xem
router.get("/all-details", tourController.getAllTourDetail);//Ai cũng có thể xem
router.get("/", tourController.getAllTours); // Ai cũng có thể xem
router.get("/:id", tourController.getTourById); // Ai cũng có thể xem   

// Chỉ Employee hoặc Admin mới có quyền thêm/sửa/xóa tour
router.post("/", authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, upload.single("img"), tourController.createTour);
router.put("/:id", authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, upload.single("img"), tourController.updateTour);
router.delete("/:id", authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, tourController.deleteTour);

module.exports = router;
