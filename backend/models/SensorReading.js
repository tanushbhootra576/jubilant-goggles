const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
    wardId: { type: String, required: true },
    name: String,
    zone: String,
    location: { lat: Number, lng: Number },
    // Current usage
    power: Number, water: Number, traffic: Number,
    parking: Number, waste: Number, transit: Number,
    // Capacities
    powerCapacity: Number, waterCapacity: Number, trafficCapacity: Number,
    parkingCapacity: Number, wasteCapacity: Number, transitCapacity: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorReading', SensorReadingSchema);
