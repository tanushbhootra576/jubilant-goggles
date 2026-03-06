import React from 'react';
import GlassCard from '../GlassCard';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
    Overloaded: '#b91c1c',
    Congested: '#b45309',
    Optimal: '#15803d',
    Underutilized: '#1e40af'
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>{value}</text>;
};

export default function StatusDistribution({ distribution = {}, totalWards = 0 }) {
    const data = Object.entries(distribution)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }));

    if (!data.length) return null;

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Status Distribution
                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{totalWards} wards</span>
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={<CustomLabel />}>
                        {data.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} wards (${Math.round(value / totalWards * 100)}%)`, name]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>

            {/* Summary bar */}
            <div style={{ marginTop: '0.75rem', display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10 }}>
                {data.map(d => (
                    <div key={d.name} title={`${d.name}: ${d.value}`}
                        style={{ flex: d.value, background: STATUS_COLORS[d.name] }} />
                ))}
            </div>
        </GlassCard>
    );
}
