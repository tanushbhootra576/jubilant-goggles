import React from 'react';
import GlassCard from '../GlassCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ReferenceLine, ResponsiveContainer, Cell
} from 'recharts';

const RESOURCE_COLORS = {
    power: '#1e40af',
    water: '#0e7490',
    traffic: '#6d28d9',
    parking: '#0369a1',
    waste: '#065f46',
    transit: '#7c3aed'
};

function getColor(avg) {
    if (avg > 100) return '#b91c1c';
    if (avg > 80) return '#b45309';
    if (avg > 40) return '#15803d';
    return '#1e40af';
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ margin: '2px 0', color: p.fill }}>{p.name}: <strong>{p.value}%</strong></p>
            ))}
        </div>
    );
};

export default function CapacityStress({ cityAvg = {}, zoneSummaries = [] }) {
    const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
    const labels = { power: 'Power Grid', water: 'Water', traffic: 'Traffic', parking: 'Parking', waste: 'Waste', transit: 'Transit' };

    // City-wide bar data
    const cityData = resources.map(r => ({
        name: labels[r],
        utilization: cityAvg[r]?.avg || 0,
        status: cityAvg[r]?.status || 'Optimal'
    }));

    // Zone comparison data
    const zoneData = zoneSummaries.map(z => {
        const row = { zone: z.zone };
        resources.forEach(r => { row[labels[r]] = z.resources[r]?.avg || 0; });
        return row;
    });

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Capacity Stress Analysis
            </h3>

            {/* City-wide overview cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {resources.map(r => {
                    const avg = cityAvg[r]?.avg || 0;
                    const color = getColor(avg);
                    return (
                        <div key={r} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '0.75rem', textAlign: 'center', border: `2px solid ${color}33` }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'capitalize' }}>{labels[r]}</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{avg}%</div>
                            <div style={{ marginTop: 6, height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3 }}>
                                <div style={{ width: `${Math.min(100, avg)}%`, height: '100%', background: color, borderRadius: 3 }} />
                            </div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color, marginTop: 4 }}>{cityAvg[r]?.status}</div>
                        </div>
                    );
                })}
            </div>

            {/* City bar chart */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>City-Wide Utilization vs Capacity</div>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={cityData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 130]} tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Congested', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
                        <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Capacity', position: 'right', fontSize: 10, fill: '#ef4444' }} />
                        <Bar dataKey="utilization" radius={[4, 4, 0, 0]} name="Utilization %">
                            {cityData.map((entry, i) => <Cell key={i} fill={RESOURCE_COLORS[resources[i]]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Zone comparison */}
            {zoneData.length > 0 && (
                <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Zone-by-Zone Comparison</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={zoneData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 130]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 3" />
                            {resources.map(r => <Bar key={r} dataKey={labels[r]} fill={RESOURCE_COLORS[r]} radius={[2, 2, 0, 0]} />)}
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GlassCard>
    );
}
