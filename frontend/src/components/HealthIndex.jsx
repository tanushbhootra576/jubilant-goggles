import React, { useMemo } from 'react';
import GlassCard from './GlassCard';

export default function HealthIndex({ wards = [] }) {
    const score = useMemo(() => {
        if (!wards || wards.length === 0) return 100;
        const avgPower = wards.reduce((s, w) => s + w.power, 0) / wards.length;
        const avgWater = wards.reduce((s, w) => s + w.water, 0) / wards.length;
        const avgTraffic = wards.reduce((s, w) => s + w.traffic, 0) / wards.length;
        const cityHealth = (100 - avgPower + 100 - avgWater + 100 - avgTraffic) / 3;
        return Math.round(cityHealth);
    }, [wards]);

    const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--critical)';

    return (
        <GlassCard>
            <h3>City Health Index</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', border: `4px solid ${color}` }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color }}>{score}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Score</div>
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="var(--success)"><circle cx="12" cy="12" r="10"></circle></svg> Good: 80-100</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="var(--warning)"><circle cx="12" cy="12" r="10"></circle></svg> Fair: 60-79</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="var(--critical)"><circle cx="12" cy="12" r="10"></circle></svg> Poor: &lt;60</div>
                </div>
            </div>
        </GlassCard>
    );
}

