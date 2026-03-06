const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
    wardId: { type: String, required: true },
    name: String,
    location: { lat: Number, lng: Number },
    power: Number,
    water: Number,
    traffic: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorReading', SensorReadingSchema);
