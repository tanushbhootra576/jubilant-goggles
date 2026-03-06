const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
    wardId: { type: String, required: true, unique: true },
    name: String,
    zone: { type: String, default: 'Central' },
    location: { lat: Number, lng: Number },
    // Current usage (0-100 base scale)
    power: Number,
    water: Number,
    traffic: Number,
    // Rated capacity (max allowable load per resource, MW / MLD / PCU)
    powerCapacity: { type: Number, default: 100 },
    waterCapacity: { type: Number, default: 100 },
    trafficCapacity: { type: Number, default: 100 },
    // Extra resources
    parking: { type: Number, default: 0 },
    parkingCapacity: { type: Number, default: 100 },
    waste: { type: Number, default: 0 },
    wasteCapacity: { type: Number, default: 100 },
    transit: { type: Number, default: 0 },
    transitCapacity: { type: Number, default: 100 },
    // Budget allocation (in Crore INR)
    totalBudget: { type: Number, default: 0 },
    budgetPower: { type: Number, default: 0 },
    budgetWater: { type: Number, default: 0 },
    budgetTraffic: { type: Number, default: 0 },
    budgetParking: { type: Number, default: 0 },
    budgetWaste: { type: Number, default: 0 },
    budgetTransit: { type: Number, default: 0 },
    // Actual spend (as % of sector budget consumed)
    spendPower: { type: Number, default: 0 },
    spendWater: { type: Number, default: 0 },
    spendTraffic: { type: Number, default: 0 },
    spendParking: { type: Number, default: 0 },
    spendWaste: { type: Number, default: 0 },
    spendTransit: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ward', WardSchema);
