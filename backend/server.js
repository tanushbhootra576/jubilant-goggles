const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const SimulationService = require('./services/simulationService');
const PredictionService = require('./services/predictionService');
const AIService = require('./services/aiService');
const SensorReading = require('./models/SensorReading');
const Ward = require('./models/Ward');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/kavach';

async function start() {
    try {
        await mongoose.connect(MONGO, { dbName: 'kavach' });
        console.log('MongoDB connected');

        // start simulation service
        SimulationService.start({ io, PredictionService, AIService, Ward, SensorReading });

        // socket handlers
        io.on('connection', (socket) => {
            console.log('client connected', socket.id);

            socket.on('disaster:set', (payload) => {
                SimulationService.setDisasterMode(payload);
            });

            socket.on('replay:start', async ({ minutes }) => {
                try {
                    const since = Date.now() - (minutes || 30) * 60 * 1000;
                    const frames = await SensorReading.find({ timestamp: { $gte: new Date(since) } }).sort({ timestamp: 1 }).lean();
                    socket.emit('replay:frames', frames);
                } catch (err) {
                    console.error('replay error', err);
                    socket.emit('error', { message: 'Replay failed' });
                }
            });
        });

        // API endpoints
        app.get('/api/history', async (req, res) => {
            try {
                const minutes = parseInt(req.query.minutes || '30', 10);
                const since = Date.now() - minutes * 60 * 1000;
                const rows = await SensorReading.find({ timestamp: { $gte: new Date(since) } }).sort({ timestamp: 1 }).lean();
                res.json({ ok: true, frames: rows });
            } catch (err) {
                console.error(err);
                res.status(500).json({ ok: false, message: 'Failed to fetch history' });
            }
        });

        app.get('/api/ai', async (req, res) => {
            try {
                const wardId = req.query.wardId;
                if (!wardId) return res.status(400).json({ ok: false, message: 'wardId required' });
                const ward = await Ward.findOne({ wardId }).lean();
                if (!ward) return res.status(404).json({ ok: false, message: 'ward not found' });

                const recent = await SensorReading.find({ wardId }).sort({ timestamp: -1 }).limit(60).lean();
                const prediction = PredictionService.analyzeTrend(recent);
                const aiResp = await AIService.generateEmergencyPlan({ ward, prediction });
                return res.json({ ok: true, ai: aiResp });
            } catch (err) {
                console.error('api/ai error', err);
                res.status(500).json({ ok: false, message: 'AI analysis failed' });
            }
        });

        app.get('/api/wards', async (req, res) => {
            try {
                const wards = await Ward.find().lean();
                res.json({ ok: true, wards });
            } catch (err) {
                res.status(500).json({ ok: false });
            }
        });

        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => console.log('Server listening on', PORT));
    } catch (err) {
        console.error('start error', err);
        process.exit(1);
    }
}

start();
