const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // ✅ Import multerConfig
const itineraryController = require("../controllers/itineraryController");

// API CRUD Itinerary
router.get("/", itineraryController.getAllItineraries);
router.get("/tours/:tourId", itineraryController.getAllItineraries);
router.post("/", upload.single("image"), itineraryController.createItinerary); 
router.put("/:id", upload.single("image"), itineraryController.updateItinerary);
router.delete("/:id", itineraryController.deleteItinerary);

module.exports = router;
