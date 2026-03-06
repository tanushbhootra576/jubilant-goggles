import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';

const RESOURCE_COLORS = {
    power: '#f59e0b', water: '#3b82f6', traffic: '#8b5cf6',
    parking: '#06b6d4', waste: '#84cc16', transit: '#f97316'
};

const LABELS = {
    power: 'Power', water: 'Water', traffic: 'Traffic',
    parking: 'Parking', waste: 'Waste', transit: 'Transit'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>{label}</p>
            {payload.map(p => <p key={p.dataKey} style={{ margin: '2px 0', color: p.stroke || p.fill }}>{p.name}: <strong>{p.value}%</strong></p>)}
        </div>
    );
};

export default function ForecastChart({ forecast24h = [], forecast7d = [] }) {
    const [view, setView] = useState('24h');
    const resources = Object.keys(RESOURCE_COLORS);

    const data = view === '24h' ? forecast24h : forecast7d;
    const xKey = view === '24h' ? 'hour' : 'day';

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    Predictive Trends
                </h3>
                <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, overflow: 'hidden' }}>
                    {['24h', '7d'].map(opt => (
                        <button key={opt} onClick={() => setView(opt)}
                            style={{ padding: '4px 16px', border: 'none', background: view === opt ? 'var(--accent-primary)' : 'rgba(255,255,255,0.8)', color: view === opt ? '#fff' : '#555', cursor: 'pointer', fontSize: '0.82rem', fontWeight: view === opt ? 700 : 400, transition: 'all 0.15s' }}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {view === '24h'
                    ? 'Projected utilization for next 24 hours (time-of-day demand curve)'
                    : '7-day outlook based on weekly demand patterns'}
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey={xKey} tick={{ fontSize: 10 }} interval={view === '24h' ? 3 : 0} />
                    <YAxis domain={[0, 130]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 3" strokeOpacity={0.6} />
                    <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 3" strokeOpacity={0.6} />
                    {resources.map(r => (
                        <Line key={r} type="monotone" dataKey={r} name={LABELS[r]}
                            stroke={RESOURCE_COLORS[r]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                </LineChart>
            </ResponsiveContainer>

            {/* Peak hours label */}
            {view === '24h' && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Red dashes = 100% rated capacity</span>
                    <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Yellow dashes = 80% congestion threshold</span>
                </div>
            )}
        </GlassCard>
    );
}
