export function summarizePrediction(prediction) {
    if (!prediction) return null;
    return {
        power: prediction.power,
        water: prediction.water,
        traffic: prediction.traffic,
        flagAI: prediction.flagAI
    };
}
