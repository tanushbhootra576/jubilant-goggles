const axios = require('axios');

const LLM_API_KEY = process.env.LLM_API_KEY || process.env.FEATHERLESS_API_KEY || null;
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.featherless.ai/v1';
const LLM_MODEL = process.env.LLM_MODEL || null;

function localFallbackAnalysis(ward, prediction) {
    const power = prediction.power;
    const severity = Math.round(((power.p30 || 0) + (power.p60 || power.p30 || 0)) / 2 || power.ma || 0);
    const status_code = severity > 90 ? 'Critical' : severity > 75 ? 'Warning' : 'Normal';
    const minutes = (power.p30 && power.p30 > 90) ? 30 : (power.p60 && power.p60 > 90) ? 60 : 45;

    return {
        severity,
        status_code,
        prediction: `Power demand likely to exceed 90% within ${minutes} minutes`,
        tactical_action: [
            'Initiate phased load balancing',
            'Notify regional grid operator',
            'Trigger local demand response'
        ],
        reasoning: {
            power: { current: ward.power, trendPerMinute: power.slopePerMinute, threshold: 90 },
            conclusion: `Projected exceedance in ~${minutes} minutes based on moving average trend.`
        }
    };
}

async function generateEmergencyPlan({ ward, prediction }) {
    const prompt = `Analyze infrastructure stress for ward ${ward.wardId} (${ward.name}). Current values: power=${ward.power}%, water=${ward.water}%, traffic=${ward.traffic}%. Prediction summary: ${JSON.stringify(prediction)}. Provide severity, status_code, short prediction sentence, tactical_action array, and explainability reasoning.`;

    // If API key is present, call Featherless LLM endpoint
    if (LLM_API_KEY && LLM_BASE_URL) {
        try {
            const url = `${LLM_BASE_URL.replace(/\/$/, '')}/responses`;
            const body = {
                model: LLM_MODEL || 'qwen',
                input: prompt,
                // include structured metadata for the model to use
                metadata: { wardId: ward.wardId }
            };

            const headers = { Authorization: `Bearer ${LLM_API_KEY}` };
            const resp = await axios.post(url, body, { headers, timeout: 10000 });

            // Expecting the model to return a structured JSON or text; try to normalize
            if (resp && resp.data) {
                // If the API returns structured fields, pass through
                if (resp.data.severity || resp.data.status_code) return resp.data;
                // Otherwise, attempt to parse text response
                if (typeof resp.data === 'string') {
                    try { return JSON.parse(resp.data); } catch (e) { return { raw: resp.data }; }
                }
                return resp.data;
            }
        } catch (err) {
            console.error('Featherless LLM call failed:', err.message || err);
            // fall through to local analysis
        }
    }

    return localFallbackAnalysis(ward, prediction);
}

module.exports = { generateEmergencyPlan };
