const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); 
const itineraryController = require("../controllers/itineraryController");
const authMiddleware = require("../middlewares/authMiddleware");
// API CRUD Itinerary
router.get("/", itineraryController.getAllItineraries);
router.get("/tours/:tourId", itineraryController.getAllItinerariesByTourId);
router.get("/:id", itineraryController.getItineraryById);
// API CRUD Itinerary(Admin/Employee)
router.post("/",authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, upload.single("image"), itineraryController.createItinerary); 
router.put("/:id",authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, upload.single("image"), itineraryController.updateItinerary);
router.delete("/:id",authMiddleware.authenticate, authMiddleware.isAdminOrEmployee, itineraryController.deleteItinerary);

module.exports = router;
