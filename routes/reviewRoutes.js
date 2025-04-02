const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/average-rating/:tourId", reviewController.getAverageRating);
router.get("/", reviewController.getAllReviews);
router.post("/:tourId", authenticate, reviewController.createReview);
router.get("/:tourId/check", authenticate, reviewController.checkUserCanReview);
module.exports = router;
