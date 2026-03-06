import React, { useState } from 'react';
import GlassCard from '../GlassCard';

const SEVERITY_STYLES = {
    critical: { bg: 'rgba(185,28,28,0.06)', border: '#b91c1c', badge: '#b91c1c', label: 'Overloaded' },
    warning: { bg: 'rgba(180,83,9,0.06)', border: '#b45309', badge: '#b45309', label: 'Congested' }
};

const RESOURCE_LABEL = {
    power: 'Power Grid', water: 'Water Supply', traffic: 'Traffic',
    parking: 'Parking', waste: 'Waste Mgmt', transit: 'Public Transit'
};

export default function CongestionAlerts({ alerts = [] }) {
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter);

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    Congestion Alerts
                </h3>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(185,28,28,0.1)', color: '#b91c1c', padding: '2px 8px', borderRadius: 12 }}>{criticalCount} Overloaded</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(180,83,9,0.1)', color: '#b45309', padding: '2px 8px', borderRadius: 12 }}>{warningCount} Congested</span>
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', cursor: 'pointer' }}>
                        <option value="All">All</option>
                        <option value="critical">Overloaded</option>
                        <option value="warning">Congested</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>
                    <p style={{ margin: 0, fontWeight: 600, color: '#22c55e' }}>All systems nominal</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
                    {filtered.map((alert, idx) => {
                        const s = SEVERITY_STYLES[alert.severity];
                        return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', background: s.bg, borderRadius: 8, borderLeft: `4px solid ${s.border}` }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                                        {alert.name}
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: 6 }}>({alert.zone})</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                        {RESOURCE_LABEL[alert.resource] || alert.resource}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.border }}>{alert.pct}%</div>
                                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', background: s.badge, padding: '1px 6px', borderRadius: 10, marginTop: 2 }}>{s.label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </GlassCard>
    );
}
