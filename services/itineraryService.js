const Itinerary = require("../models/itinerary");

exports.getAllItineraries = async () => {
    return await Itinerary.find().populate("tourId", "tourName"); // Lấy thông tin tourName
};

exports.getAllItinerariesByTourId = async (tourId) => {
    try {
        // Tìm tất cả itineraries theo tourId
        return await Itinerary.find({ tourId: tourId }).populate("tourId", "tourName");
    } catch (error) {
        console.error("Lỗi khi lấy itineraries theo tourId:", error);
        throw error;
    }
};

exports.createItinerary = async (data) => {
    return await Itinerary.create(data);
};

exports.updateItinerary = async (id, data) => {
    return await Itinerary.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteItinerary = async (id) => {
    return await Itinerary.findByIdAndDelete(id);
};
