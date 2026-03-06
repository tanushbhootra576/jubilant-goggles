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

        // ── Analytics Engine ─────────────────────────────────────────
        app.get('/api/analytics', async (req, res) => {
            try {
                const wards = await Ward.find().lean();
                if (!wards.length) return res.json({ ok: true, analytics: null });

                const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
                const capKey = {
                    power: 'powerCapacity', water: 'waterCapacity', traffic: 'trafficCapacity',
                    parking: 'parkingCapacity', waste: 'wasteCapacity', transit: 'transitCapacity'
                };

                function classify(pct) {
                    if (pct < 40) return 'Underutilized';
                    if (pct <= 80) return 'Optimal';
                    if (pct <= 100) return 'Congested';
                    return 'Overloaded';
                }

                // Per-ward utilisation
                const wardAnalytics = wards.map(w => {
                    const util = {};
                    resources.forEach(r => {
                        const cap = w[capKey[r]] || 100;
                        const pct = Math.round((w[r] / cap) * 100);
                        util[r] = { value: w[r], capacity: cap, pct, status: classify(pct) };
                    });
                    const avgPct = Math.round(resources.reduce((s, r) => s + util[r].pct, 0) / resources.length);
                    return { wardId: w.wardId, name: w.name, zone: w.zone || 'Central', location: w.location, util, avgPct, overallStatus: classify(avgPct) };
                });

                // Zone summaries
                const zones = {};
                wardAnalytics.forEach(w => {
                    if (!zones[w.zone]) zones[w.zone] = { zone: w.zone, wardCount: 0, resources: {} };
                    zones[w.zone].wardCount++;
                    resources.forEach(r => {
                        if (!zones[w.zone].resources[r]) zones[w.zone].resources[r] = [];
                        zones[w.zone].resources[r].push(w.util[r].pct);
                    });
                });
                const zoneSummaries = Object.values(zones).map(z => {
                    const resAvg = {};
                    resources.forEach(r => {
                        const avg = Math.round(z.resources[r].reduce((a, b) => a + b, 0) / z.resources[r].length);
                        resAvg[r] = { avg, status: classify(avg) };
                    });
                    return { zone: z.zone, wardCount: z.wardCount, resources: resAvg };
                });

                // City-wide averages
                const cityAvg = {};
                resources.forEach(r => {
                    const avg = Math.round(wardAnalytics.reduce((s, w) => s + w.util[r].pct, 0) / wardAnalytics.length);
                    cityAvg[r] = { avg, status: classify(avg) };
                });

                // Hotspots: wards with any resource overloaded or congested
                const hotspots = wardAnalytics
                    .filter(w => resources.some(r => w.util[r].status === 'Overloaded' || w.util[r].status === 'Congested'))
                    .sort((a, b) => b.avgPct - a.avgPct)
                    .slice(0, 15);

                // Underutilized zones
                const underutilized = wardAnalytics
                    .filter(w => w.avgPct < 40)
                    .sort((a, b) => a.avgPct - b.avgPct)
                    .slice(0, 10);

                // Status distribution
                const distribution = { Underutilized: 0, Optimal: 0, Congested: 0, Overloaded: 0 };
                wardAnalytics.forEach(w => { distribution[w.overallStatus]++; });

                // Congestion alerts (resource-level)
                const alerts = [];
                wardAnalytics.forEach(w => {
                    resources.forEach(r => {
                        const u = w.util[r];
                        if (u.status === 'Overloaded' || u.status === 'Congested') {
                            alerts.push({
                                wardId: w.wardId, name: w.name, zone: w.zone,
                                resource: r, pct: u.pct, status: u.status,
                                severity: u.status === 'Overloaded' ? 'critical' : 'warning'
                            });
                        }
                    });
                });
                alerts.sort((a, b) => b.pct - a.pct);

                // 24h forecast: use current utilisation + sinusoidal hour projection
                const now = new Date();
                const forecast24h = Array.from({ length: 24 }, (_, i) => {
                    const hour = (now.getHours() + i) % 24;
                    const load = 0.5 + 0.4 * Math.sin((hour - 6) * Math.PI / 12);
                    const f = {};
                    resources.forEach(r => {
                        f[r] = Math.round(cityAvg[r].avg * (load / (0.5 + 0.4 * Math.sin((now.getHours() - 6) * Math.PI / 12) || 0.5)));
                    });
                    return { hour: `${String(hour).padStart(2, '0')}:00`, ...f };
                });

                // 7-day forecast: apply weekly seasonality
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayFactors = [0.70, 0.85, 0.90, 0.92, 0.88, 0.95, 0.75];
                const forecast7d = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(now); d.setDate(d.getDate() + i);
                    const factor = dayFactors[d.getDay()];
                    const f = {};
                    resources.forEach(r => {
                        f[r] = Math.min(130, Math.round(cityAvg[r].avg * factor));
                    });
                    return { day: dayNames[d.getDay()], ...f };
                });

                // Recommendations
                const recommendations = [];
                resources.forEach(r => {
                    const avg = cityAvg[r].avg;
                    if (avg > 100) recommendations.push({ priority: 'Critical', resource: r, action: `Immediate capacity expansion needed for ${r}. Current city-wide utilisation at ${avg}% — above rated capacity.` });
                    else if (avg > 80) recommendations.push({ priority: 'High', resource: r, action: `${r.charAt(0).toUpperCase() + r.slice(1)} grid approaching capacity (${avg}%). Pre-emptive load-balancing and demand-side management recommended.` });
                    else if (avg < 30) recommendations.push({ priority: 'Low', resource: r, action: `${r.charAt(0).toUpperCase() + r.slice(1)} infrastructure is severely underutilised (${avg}%). Consider consolidation or decommissioning idle assets.` });
                });

                // Zone imbalance recommendation
                zoneSummaries.forEach(z => {
                    resources.forEach(r => {
                        if (z.resources[r].avg > 90) {
                            recommendations.push({ priority: 'High', resource: r, action: `Zone ${z.zone}: ${r} overloaded at ${z.resources[r].avg}%. Redistribute load from adjacent zones.` });
                        }
                    });
                });

                return res.json({
                    ok: true,
                    analytics: {
                        wardAnalytics,
                        zoneSummaries,
                        cityAvg,
                        hotspots,
                        underutilized,
                        distribution,
                        alerts: alerts.slice(0, 30),
                        forecast24h,
                        forecast7d,
                        recommendations: recommendations.slice(0, 20),
                        generatedAt: new Date()
                    }
                });
            } catch (err) {
                console.error('analytics error', err);
                res.status(500).json({ ok: false, message: 'Analytics computation failed' });
            }
        });

        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => console.log('Server listening on', PORT)).on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is in use, retrying...`);
                setTimeout(() => {
                    server.close();
                    server.listen(PORT);
                }, 1000);
            }
        });
    } catch (err) {
        console.error('start error', err);
        process.exit(1);
    }
}

start();
