// Simple moving-average based predictor
function movingAverage(values) {
    if (!values || values.length === 0) return null;
    const sum = values.reduce((s, v) => s + v, 0);
    return sum / values.length;
}

// analyzeTrend expects an array of readings sorted newest-first
function analyzeTrend(readings = []) {
    if (!readings || readings.length === 0) return null;

    // reverse for chronological order
    const seq = readings.slice().reverse();
    const n = seq.length;

    const powerSeries = seq.map(r => r.power || 0);
    const waterSeries = seq.map(r => r.water || 0);
    const trafficSeries = seq.map(r => r.traffic || 0);

    const powerMA = movingAverage(powerSeries.slice(-12));
    const waterMA = movingAverage(waterSeries.slice(-12));
    const trafficMA = movingAverage(trafficSeries.slice(-12));

    // simple slope per minute estimation: (last - first) / minutes
    const first = seq[0];
    const last = seq[seq.length - 1];
    const minutes = Math.max(1, (new Date(last.timestamp) - new Date(first.timestamp)) / 60000);

    const slopePerMinute = (valArr) => {
        if (valArr.length < 2) return 0;
        const firstV = valArr[0];
        const lastV = valArr[valArr.length - 1];
        return (lastV - firstV) / Math.max(1, minutes);
    };

    const pSlope = slopePerMinute(powerSeries);
    const wSlope = slopePerMinute(waterSeries);
    const tSlope = slopePerMinute(trafficSeries);

    // project to 30 and 60 minutes
    const project = (ma, slope, minutesAhead) => clamp(ma + slope * minutesAhead);

    function clamp(v) { return Math.max(0, Math.min(100, v)); }

    const p30 = project(powerMA || (powerSeries.slice(-1)[0] || 0), pSlope, 30);
    const p60 = project(powerMA || (powerSeries.slice(-1)[0] || 0), pSlope, 60);

    const w30 = project(waterMA || (waterSeries.slice(-1)[0] || 0), wSlope, 30);
    const t30 = project(trafficMA || (trafficSeries.slice(-1)[0] || 0), tSlope, 30);

    // flag AI if any projected > 90
    const flagAI = p30 > 90 || p60 > 90 || w30 > 90 || t30 > 90;

    const prediction = {
        power: { ma: powerMA, slopePerMinute: pSlope, p30, p60 },
        water: { ma: waterMA, slopePerMinute: wSlope, p30: w30 },
        traffic: { ma: trafficMA, slopePerMinute: tSlope, p30: t30 },
        flagAI
    };

    return prediction;
}

module.exports = { analyzeTrend };
