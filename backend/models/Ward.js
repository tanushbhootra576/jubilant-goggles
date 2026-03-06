const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
    wardId: { type: String, required: true, unique: true },
    name: String,
    location: {
        lat: Number,
        lng: Number
    },
    power: Number,
    water: Number,
    traffic: Number,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ward', WardSchema);
