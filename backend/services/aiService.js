const axios = require('axios');

const LLM_API_KEY = process.env.LLM_API_KEY || process.env.FEATHERLESS_API_KEY || null;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'https://api.featherless.ai/v1').replace(/\/$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'Qwen/Qwen3-VL-30B-A3B-Instruct';

function getStatusLabel(pct) {
    if (pct > 100) return 'Overloaded';
    if (pct > 80) return 'Congested';
    if (pct > 40) return 'Optimal';
    return 'Underutilized';
}

function localFallbackAnalysis(ward, prediction) {
    const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
    const overloaded = resources.filter(r => (ward[r] || 0) > 100).map(r => r);
    const congested = resources.filter(r => (ward[r] || 0) > 80 && (ward[r] || 0) <= 100).map(r => r);

    const maxVal = Math.max(...resources.map(r => ward[r] || 0));
    const severity = Math.round(Math.min(100, maxVal));
    const status_code = severity > 100 ? 'Critical' : severity > 80 ? 'Warning' : severity > 40 ? 'Normal' : 'Low';

    const actions = [];
    if (overloaded.length) actions.push(`Emergency load-shedding on: ${overloaded.join(', ')}`);
    if (congested.length) actions.push(`Pre-emptive demand management on: ${congested.join(', ')}`);
    actions.push('Alert city operations centre and dispatch response teams');
    actions.push('Monitor adjacent ward interconnects for cascade effect');

    const resourceSummary = resources.map(r => `${r}: ${Math.round(ward[r] || 0)}% (${getStatusLabel(ward[r] || 0)})`).join(', ');

    return {
        severity,
        status_code,
        prediction: overloaded.length
            ? `Ward ${ward.wardId} has ${overloaded.length} resource(s) exceeding rated capacity. Immediate intervention required.`
            : congested.length
                ? `Ward ${ward.wardId} approaching capacity limits. Proactive measures recommended within 30 minutes.`
                : `Ward ${ward.wardId} operating within normal parameters. Continue routine monitoring.`,
        tactical_action: actions,
        summary: `${ward.name} (${ward.zone || 'Central'} zone) â€” ${resourceSummary}`,
        reasoning: {
            ward: ward.wardId,
            resources: Object.fromEntries(resources.map(r => [r, { current: Math.round(ward[r] || 0), status: getStatusLabel(ward[r] || 0) }])),
            trend: prediction || {},
            conclusion: `System heuristic analysis. Peak resources: ${[...overloaded, ...congested].join(', ') || 'none above threshold'}.`
        },
        source: 'local-fallback'
    };
}

// Extract JSON from model output (may be wrapped in ```json ... ``` blocks)
function extractJson(raw) {
    if (typeof raw !== 'string') return null;
    // Try direct parse
    try { return JSON.parse(raw.trim()); } catch (_) { }
    // Try extracting from markdown code fence
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
        try { return JSON.parse(match[1].trim()); } catch (_) { }
    }
    // Try finding first { ... } block
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        try { return JSON.parse(raw.slice(start, end + 1)); } catch (_) { }
    }
    return null;
}

async function generateEmergencyPlan({ ward, prediction }) {
    const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
    const resourceSummary = resources.map(r => `${r}: ${Math.round(ward[r] || 0)}%`).join(', ');

    const systemPrompt = `You are Kavach-City AI, an urban infrastructure emergency response system. Analyze smart city sensor data and provide actionable emergency plans. Always respond with valid JSON only â€” no markdown, no explanation outside JSON.`;

    const userPrompt = `Ward ID: ${ward.wardId}
Name: ${ward.name}
Zone: ${ward.zone || 'Central'}
Current resource utilisation: ${resourceSummary}
Trend prediction: ${JSON.stringify(prediction || {})}

Respond with this exact JSON structure:
{
  "severity": <0-100 integer>,
  "status_code": "<Critical|Warning|Normal|Low>",
  "prediction": "<one sentence predicting what will happen in the next 30-60 minutes>",
  "tactical_action": ["<action 1>", "<action 2>", "<action 3>"],
  "summary": "<one-line executive summary for city planners>",
  "reasoning": {
    "critical_resources": ["<resource names above 80%>"],
    "risk_assessment": "<brief risk analysis>",
    "conclusion": "<final recommendation>"
  }
}`;

    if (LLM_API_KEY) {
        try {
            const resp = await axios.post(
                `${LLM_BASE_URL}/chat/completions`,
                {
                    model: LLM_MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 600
                },
                {
                    headers: {
                        'Authorization': `Bearer ${LLM_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            const content = resp?.data?.choices?.[0]?.message?.content;
            if (content) {
                const parsed = extractJson(content);
                if (parsed && (parsed.severity !== undefined || parsed.status_code)) {
                    return { ...parsed, source: 'featherless-ai' };
                }
                // Model responded but not parseable as JSON â€” wrap the text
                return {
                    severity: 50,
                    status_code: 'Normal',
                    prediction: content.slice(0, 200),
                    tactical_action: ['Review raw AI output for further guidance'],
                    summary: `AI analysis for ${ward.name}`,
                    reasoning: { raw: content },
                    source: 'featherless-ai-raw'
                };
            }
        } catch (err) {
            console.error('Featherless AI call failed:', err?.response?.data || err.message);
        }
    }

    return localFallbackAnalysis(ward, prediction);
}

// Analyse analytics-level data (triggered from analytics endpoint)
async function analyseAnalytics({ cityAvg, hotspots, alerts }) {
    const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
    const summary = resources.map(r => `${r}: ${cityAvg[r]?.avg || 0}% (${cityAvg[r]?.status})`).join(', ');
    const hotspotNames = (hotspots || []).slice(0, 5).map(h => h.name).join(', ');
    const criticalAlerts = (alerts || []).filter(a => a.severity === 'critical').length;

    const userPrompt = `City-wide infrastructure status:
Resources: ${summary}
Critical alerts: ${criticalAlerts}
Top hotspot wards: ${hotspotNames || 'none'}

Respond with this JSON:
{
  "cityStatus": "<Critical|Warning|Stable>",
  "headline": "<one sentence city-wide assessment>",
  "top_actions": ["<action 1>", "<action 2>", "<action 3>"],
  "risk_score": <0-100>,
  "insight": "<strategic insight for city planners>"
}`;

    if (LLM_API_KEY) {
        try {
            const resp = await axios.post(
                `${LLM_BASE_URL}/chat/completions`,
                {
                    model: LLM_MODEL,
                    messages: [
                        { role: 'system', content: 'You are Kavach-City AI, an urban infrastructure analyst. Respond with valid JSON only.' },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 400
                },
                {
                    headers: { 'Authorization': `Bearer ${LLM_API_KEY}`, 'Content-Type': 'application/json' },
                    timeout: 15000
                }
            );
            const content = resp?.data?.choices?.[0]?.message?.content;
            if (content) {
                const parsed = extractJson(content);
                if (parsed) return { ...parsed, source: 'featherless-ai' };
            }
        } catch (err) {
            console.error('Featherless city analysis failed:', err?.response?.data || err.message);
        }
    }

    return {
        cityStatus: criticalAlerts > 0 ? 'Warning' : 'Stable',
        headline: `City infrastructure operating at normal parameters. ${criticalAlerts} critical alert(s) active.`,
        top_actions: ['Continue routine monitoring', 'Review hotspot wards', 'Check forecast trends'],
        risk_score: Math.min(100, criticalAlerts * 20 + 20),
        insight: 'No immediate systemic risk detected.',
        source: 'local-fallback'
    };
}

// Analyse ward budget allocation data with AI
async function analyseBudget({ wards, cityTotals, underfunded, topBudget, sectorTotals }) {
    const sectorSummary = Object.entries(sectorTotals || {})
        .map(([s, v]) => `${s}: â‚¹${v}Cr`)
        .join(', ');
    const underfundedNames = (underfunded || []).slice(0, 5).map(w => `${w.name} (gap: â‚¹${w.deficitCr}Cr)`).join(', ');
    const topNames = (topBudget || []).slice(0, 3).map(w => `${w.name}: â‚¹${w.totalBudget}Cr`).join(', ');

    const userPrompt = `City Infrastructure Budget Analysis:
Total city budget: â‚¹${cityTotals?.total || 0} Crore
Sector allocation: ${sectorSummary}
Top funded wards: ${topNames || 'none'}
Underfunded wards (demand > budget): ${underfundedNames || 'none'}
Total wards: ${(wards || []).length}

Provide a budget redistribution strategy. Respond with this JSON:
{
  "budgetStatus": "<Balanced|Surplus|Deficit>",
  "headline": "<one executive summary sentence>",
  "risk_score": <0-100 integer>,
  "top_sector": "<sector receiving most funding>",
  "underfunding_risk": "<brief assessment of underfunding risk>",
  "redistribution_plan": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"],
  "insight": "<strategic insight for finance committee>"
}`;

    if (LLM_API_KEY) {
        try {
            const resp = await axios.post(
                `${LLM_BASE_URL}/chat/completions`,
                {
                    model: LLM_MODEL,
                    messages: [
                        { role: 'system', content: 'You are Kavach-City AI, an urban infrastructure budget analyst. Respond with valid JSON only.' },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                },
                {
                    headers: { 'Authorization': `Bearer ${LLM_API_KEY}`, 'Content-Type': 'application/json' },
                    timeout: 15000
                }
            );
            const content = resp?.data?.choices?.[0]?.message?.content;
            if (content) {
                const parsed = extractJson(content);
                if (parsed) return { ...parsed, source: 'featherless-ai' };
            }
        } catch (err) {
            console.error('Featherless budget AI failed:', err?.response?.data || err.message);
        }
    }

    // Local fallback
    const deficit = (underfunded || []).length;
    return {
        budgetStatus: deficit > 3 ? 'Deficit' : deficit > 0 ? 'Surplus' : 'Balanced',
        headline: `City budget analysis complete. ${deficit} ward(s) identified as underfunded relative to infrastructure demand.`,
        risk_score: Math.min(100, deficit * 15 + 10),
        top_sector: Object.entries(sectorTotals || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'power',
        underfunding_risk: deficit > 0 ? `${deficit} wards show demand exceeding allocated budget â€” risk of deferred maintenance.` : 'No significant underfunding detected.',
        redistribution_plan: [
            'Reallocate 10-15% from surplus zones to underfunded wards',
            'Increase traffic and transit budgets in high-density East/Central zones',
            'Establish a contingency reserve fund (5% of city total)',
            'Conduct quarterly budget vs utilisation reviews per ward'
        ],
        insight: 'Budget distribution broadly follows zone demand, but granular realignment per sector will improve infrastructure resilience.',
        source: 'local-fallback'
    };
}

module.exports = { generateEmergencyPlan, analyseAnalytics, analyseBudget };
