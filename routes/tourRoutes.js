const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const upload = require("../config/multerConfig");

// Routes CRUD cho Tour
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.post("/", upload.single("img"), tourController.createTour);
router.put("/:id", upload.single("img"), tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;
