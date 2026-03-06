import React from 'react';
import GlassCard from './GlassCard';

const RESOURCES = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];

const RESOURCE_ICONS = {
    power: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    water: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>,
    traffic: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><circle cx="12" cy="7" r="1" fill="currentColor"></circle><circle cx="12" cy="12" r="1" fill="currentColor"></circle><circle cx="12" cy="17" r="1" fill="currentColor"></circle></svg>,
    parking: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>,
    waste: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>,
    transit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="9" cy="16" r="1" fill="currentColor"></circle><circle cx="15" cy="16" r="1" fill="currentColor"></circle></svg>
};

function statusColor(pct) {
    if (pct > 100) return '#b91c1c';
    if (pct > 80) return '#b45309';
    if (pct > 40) return '#15803d';
    return '#1e40af';
}

function statusLabel(pct) {
    if (pct > 100) return 'Overloaded';
    if (pct > 80) return 'Congested';
    if (pct > 40) return 'Optimal';
    return 'Underutilized';
}

// Normalize a ward from either "live socket" format or "analytics" format
function normalizeWard(w) {
    if (!w) return null;
    // Analytics format has w.util = { power: { pct, status }, ... }
    if (w.util) {
        return {
            wardId: w.wardId,
            name: w.name,
            zone: w.zone,
            overallStatus: w.overallStatus,
            avgPct: w.avgPct,
            resources: Object.fromEntries(
                RESOURCES.map(r => [r, w.util[r]?.pct ?? 0])
            )
        };
    }
    // Live socket format has flat numbers
    const resources = Object.fromEntries(RESOURCES.map(r => [r, Math.round(w[r] ?? 0)]));
    const avg = Math.round(RESOURCES.reduce((s, r) => s + resources[r], 0) / RESOURCES.length);
    return {
        wardId: w.wardId,
        name: w.name,
        zone: w.zone || '—',
        overallStatus: statusLabel(avg),
        avgPct: avg,
        resources
    };
}

function SelectedWardDetail({ ward, onClose }) {
    const norm = normalizeWard(ward);
    if (!norm) return null;
    const sc = statusColor(norm.avgPct);
    return (
        <div style={{
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)',
            border: `2px solid ${sc}33`, borderTop: `4px solid ${sc}`,
            borderRadius: 12, padding: '1rem', marginBottom: '0.75rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path></svg>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{norm.name}</span>
                        <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#fff', background: sc, padding: '2px 8px', borderRadius: 20 }}>{norm.overallStatus}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 3 }}>
                        {norm.zone} Zone &nbsp;&bull;&nbsp; Avg load: <strong style={{ color: sc }}>{norm.avgPct}%</strong>
                    </div>
                </div>
                <button onClick={onClose} title="Dismiss"
                    style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {/* Resource bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {RESOURCES.map(r => {
                    const pct = norm.resources[r];
                    const col = statusColor(pct);
                    return (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: col, width: 13, flexShrink: 0 }}>{RESOURCE_ICONS[r]}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', width: 46, textTransform: 'capitalize', flexShrink: 0 }}>{r}</span>
                            <div style={{ flex: 1, height: 7, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 0.5s ease' }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: col, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.68rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                From Analytics — live data updates below
            </div>
        </div>
    );
}

export default function WardPanel({ wards = [], onSelect, selectedWard }) {
    const liveSelected = selectedWard
        ? wards.find(w => w.wardId === selectedWard.wardId) || selectedWard
        : null;

    return (
        <GlassCard>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                Wards Monitor
            </h3>

            {/* Selected ward detail banner */}
            {liveSelected && (
                <SelectedWardDetail
                    ward={liveSelected}
                    onClose={() => onSelect && onSelect(null)}
                />
            )}

            <div style={{ maxHeight: selectedWard ? 280 : 380, overflow: 'auto', paddingRight: 6 }}>
                {wards.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        Waiting for live data...
                    </div>
                )}
                {wards.map(w => {
                    const isActive = selectedWard?.wardId === w.wardId;
                    const avg = Math.round(RESOURCES.reduce((s, r) => s + (w[r] ?? 0), 0) / RESOURCES.length);
                    const col = statusColor(avg);
                    return (
                        <div key={w.wardId}
                            className="ward-row"
                            onClick={() => onSelect && onSelect(isActive ? null : w)}
                            style={{
                                background: isActive ? `${col}12` : 'transparent',
                                border: `1.5px solid ${isActive ? col : 'transparent'}`,
                                borderRadius: 8, padding: '6px 8px', marginBottom: 4, cursor: 'pointer',
                                transition: 'background 0.15s, border 0.15s'
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '0.85rem', color: isActive ? col : 'var(--text-primary)' }}>{w.name}</strong>
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: col }}>{avg}%</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                Power {Math.round(w.power ?? 0)}% &bull; Water {Math.round(w.water ?? 0)}% &bull; Traffic {Math.round(w.traffic ?? 0)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
