const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
    wardId: { type: String, required: true, unique: true },
    name: String,
    zone: { type: String, default: 'Central' },
    location: { lat: Number, lng: Number },
    // Current usage (0–100 base scale)
    power: Number,
    water: Number,
    traffic: Number,
    // Rated capacity (max allowable load per resource, MW / MLD / PCU)
    powerCapacity: { type: Number, default: 100 },
    waterCapacity: { type: Number, default: 100 },
    trafficCapacity: { type: Number, default: 100 },
    // Extra resources
    parking: { type: Number, default: 0 },           // % occupied
    parkingCapacity: { type: Number, default: 100 },
    waste: { type: Number, default: 0 },              // % fill level
    wasteCapacity: { type: Number, default: 100 },
    transit: { type: Number, default: 0 },            // % ridership
    transitCapacity: { type: Number, default: 100 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ward', WardSchema);
