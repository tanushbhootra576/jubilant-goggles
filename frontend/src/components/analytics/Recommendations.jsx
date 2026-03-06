import React from 'react';
import GlassCard from '../GlassCard';

const PRIORITY_STYLES = {
    Critical: {
        bg: '#fef2f2', border: '#ef4444', badge: '#ef4444', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )
    },
    High: {
        bg: '#fffbeb', border: '#f59e0b', badge: '#f59e0b', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        )
    },
    Low: {
        bg: '#f0f9ff', border: '#3b82f6', badge: '#3b82f6', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        )
    }
};

const RESOURCE_LABEL = {
    power: 'Power Grid', water: 'Water Supply', traffic: 'Traffic',
    parking: 'Parking', waste: 'Waste Mgmt', transit: 'Public Transit'
};

export default function Recommendations({ recommendations = [] }) {
    if (!recommendations.length) return null;

    const grouped = { Critical: [], High: [], Low: [] };
    recommendations.forEach(r => {
        if (grouped[r.priority]) grouped[r.priority].push(r);
    });

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                Actionable Recommendations
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>for City Planners</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(grouped).map(([priority, items]) => (
                    items.length > 0 && items.map((item, idx) => {
                        const s = PRIORITY_STYLES[priority];
                        return (
                            <div key={`${priority}-${idx}`} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem 1rem', background: s.bg, borderRadius: 10, borderLeft: `4px solid ${s.border}`, alignItems: 'flex-start' }}>
                                <div style={{ flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', background: s.badge, padding: '2px 8px', borderRadius: 10 }}>{priority}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                            {RESOURCE_LABEL[item.resource] || item.resource}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#334155', lineHeight: 1.5 }}>{item.action}</p>
                                </div>
                            </div>
                        );
                    })
                ))}
            </div>
        </GlassCard>
    );
}
