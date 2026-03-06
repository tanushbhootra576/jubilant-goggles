const SensorReading = require('../models/SensorReading');
const Ward = require('../models/Ward');

let interval = null;
let disaster = { enabled: false, scenario: null };

const ZONES = ['North', 'South', 'East', 'West', 'Central'];
const ZONE_FACTOR = { North: 0.55, South: 0.70, East: 0.85, West: 0.45, Central: 0.95 };

function randomBetween(a, b) { return Math.random() * (b - a) + a; }
function clamp(v, max = 130) { return Math.max(0, Math.min(max, v)); }

function createWards(count = 10) {
    const wards = [];
    for (let i = 0; i < count; i++) {
        const zone = ZONES[i % ZONES.length];
        const f = ZONE_FACTOR[zone];
        const cap = () => Math.round(randomBetween(60, 100));
        const use = (c) => clamp(c * f + randomBetween(-10, 10));
        const pC = cap(), wC = cap(), tC = cap(), pkC = cap(), wsC = cap(), trC = cap();
        wards.push({
            wardId: `W-${i + 1}`,
            name: `Ward ${i + 1}`,
            zone,
            location: {
                lat: 12.88 + (i % 10) * 0.025 + randomBetween(-0.005, 0.005),
                lng: 77.48 + Math.floor(i / 10) * 0.025 + randomBetween(-0.005, 0.005)
            },
            powerCapacity: pC, waterCapacity: wC, trafficCapacity: tC,
            parkingCapacity: pkC, wasteCapacity: wsC, transitCapacity: trC,
            power: use(pC), water: use(wC), traffic: use(tC),
            parking: use(pkC), waste: use(wsC), transit: use(trC)
        });
    }
    return wards;
}

async function start({ io, PredictionService, AIService, Ward: WardModel, SensorReading: SensorModel }) {
    let wards = createWards(10);

    // Remove any wards beyond the current set (cleanup when count changes)
    const activeIds = wards.map(w => w.wardId);
    await WardModel.deleteMany({ wardId: { $nin: activeIds } });

    await Promise.all(wards.map(w =>
        WardModel.updateOne({ wardId: w.wardId }, { $set: { ...w, updatedAt: new Date() } }, { upsert: true })
    ));

    interval = setInterval(async () => {
        try {
            const timestamp = new Date();
            const hour = timestamp.getHours() + timestamp.getMinutes() / 60;
            // Time-of-day load curve: peaks at 18:00 (~0.9), troughs at 03:00 (~0.1)
            const dayLoad = 0.5 + 0.4 * Math.sin((hour - 6) * Math.PI / 12);

            for (const w of wards) {
                const drift = (v, noise, cap) => {
                    const target = cap * dayLoad;
                    const delta = (target - v) * 0.05 + randomBetween(-noise, noise);
                    return clamp(v + delta);
                };

                w.power = drift(w.power, 4, w.powerCapacity);
                w.water = drift(w.water, 3, w.waterCapacity);
                w.traffic = drift(w.traffic, 5, w.trafficCapacity);
                w.parking = drift(w.parking, 3, w.parkingCapacity);
                w.waste = drift(w.waste, 2, w.wasteCapacity);
                w.transit = drift(w.transit, 4, w.transitCapacity);

                if (disaster.enabled) {
                    const spike = randomBetween(25, 65);
                    switch (disaster.scenario) {
                        case 'power': w.power = clamp(w.power + spike); break;
                        case 'flood': w.water = clamp(w.water + spike); break;
                        case 'traffic': w.traffic = clamp(w.traffic + spike); break;
                        case 'pipeline': w.water = clamp(w.water + spike * 1.3); break;
                        default:
                            w.power = clamp(w.power + spike * 0.35);
                            w.water = clamp(w.water + spike * 0.35);
                            w.traffic = clamp(w.traffic + spike * 0.35);
                    }
                }
            }

            await SensorModel.insertMany(wards.map(w => ({
                wardId: w.wardId, name: w.name, zone: w.zone, location: w.location,
                power: w.power, water: w.water, traffic: w.traffic,
                parking: w.parking, waste: w.waste, transit: w.transit,
                powerCapacity: w.powerCapacity, waterCapacity: w.waterCapacity,
                trafficCapacity: w.trafficCapacity, parkingCapacity: w.parkingCapacity,
                wasteCapacity: w.wasteCapacity, transitCapacity: w.transitCapacity,
                timestamp
            })));

            await Promise.all(wards.map(w =>
                WardModel.updateOne({ wardId: w.wardId }, { $set: { ...w, updatedAt: new Date() } }, { upsert: true })
            ));

            io.emit('sensors:bulk', { timestamp, wards });

            for (const w of wards) {
                try {
                    const powerUtil = (w.power / w.powerCapacity) * 100;
                    const waterUtil = (w.water / w.waterCapacity) * 100;
                    const trafficUtil = (w.traffic / w.trafficCapacity) * 100;
                    if (Math.max(powerUtil, waterUtil, trafficUtil) > 90) {
                        const recent = await SensorModel.find({ wardId: w.wardId }).sort({ timestamp: -1 }).limit(60).lean();
                        const prediction = PredictionService.analyzeTrend(recent);
                        if (prediction && prediction.flagAI) {
                            const aiResp = await AIService.generateEmergencyPlan({ ward: w, prediction });
                            io.emit('ai:analysis', { wardId: w.wardId, ai: aiResp });
                        }
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
