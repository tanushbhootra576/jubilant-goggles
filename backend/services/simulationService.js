const SensorReading = require('../models/SensorReading');
const Ward = require('../models/Ward');

let interval = null;
let disaster = { enabled: false, scenario: null };

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }

// create initial wards
function createWards(count = 50) {
    const wards = [];
    for (let i = 0; i < count; i++) {
        wards.push({
            wardId: `W-${i + 1}`,
            name: `Ward ${i + 1}`,
            location: { lat: 12.9 + Math.random() * 0.2, lng: 77.5 + Math.random() * 0.2 },
            power: randomBetween(10, 60),
            water: randomBetween(10, 60),
            traffic: randomBetween(10, 60)
        });
    }
    return wards;
}

async function start({ io, PredictionService, AIService, Ward: WardModel, SensorReading: SensorModel }) {
    // seed wards in DB if empty
    let wards = createWards(100);

    // upsert initial wards
    await Promise.all(wards.map(w => WardModel.updateOne({ wardId: w.wardId }, { $set: { ...w, updatedAt: new Date() } }, { upsert: true })));

    interval = setInterval(async () => {
        try {
            const timestamp = new Date();
            const frames = [];
            for (const w of wards) {
                // fluctuate
                let power = clamp(w.power + randomBetween(-3, 3));
                let water = clamp(w.water + randomBetween(-2, 2));
                let traffic = clamp(w.traffic + randomBetween(-4, 4));

                // disaster spikes
                if (disaster.enabled) {
                    const spike = randomBetween(20, 60);
                    switch (disaster.scenario) {
                        case 'power': power = clamp(power + spike); break;
                        case 'flood': water = clamp(water + spike); break;
                        case 'traffic': traffic = clamp(traffic + spike); break;
                        case 'pipeline': water = clamp(water + spike * 1.2); break;
                        default:
                            power = clamp(power + spike * 0.3);
                            water = clamp(water + spike * 0.3);
                            traffic = clamp(traffic + spike * 0.3);
                    }
                }

                // update local state
                w.power = power; w.water = water; w.traffic = traffic;

                const reading = new SensorModel({ wardId: w.wardId, name: w.name, location: w.location, power, water, traffic, timestamp });
                frames.push(reading);
            }

            // bulk save readings (but keep lightweight)
            await SensorModel.insertMany(frames.map(f => f.toObject()));

            // upsert latest ward states and emit
            await Promise.all(wards.map(w => WardModel.updateOne({ wardId: w.wardId }, { $set: { ...w, updatedAt: new Date() } }, { upsert: true })));

            io.emit('sensors:bulk', { timestamp: new Date(), wards });

            // run predictions per ward in background and trigger AI where needed
            for (const w of wards) {
                try {
                    const recent = await SensorModel.find({ wardId: w.wardId }).sort({ timestamp: -1 }).limit(60).lean();
                    const prediction = PredictionService.analyzeTrend(recent);
                    if (prediction && prediction.flagAI) {
                        const aiResp = await AIService.generateEmergencyPlan({ ward: w, prediction });
                        io.emit('ai:analysis', { wardId: w.wardId, ai: aiResp });
                    }
                } catch (e) {
                    console.error('prediction loop error', e.message);
                }
            }

        } catch (err) {
            console.error('simulation tick error', err);
        }
    }, 5000);
}

function setDisasterMode({ enabled, scenario }) {
    disaster.enabled = !!enabled;
    disaster.scenario = scenario || null;
}

module.exports = { start, setDisasterMode };
