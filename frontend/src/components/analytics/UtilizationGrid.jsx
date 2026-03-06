import React, { useState } from 'react';
import GlassCard from '../GlassCard';

const STATUS_COLOR = {
    Underutilized: '#3b82f6',
    Optimal: '#22c55e',
    Congested: '#f59e0b',
    Overloaded: '#ef4444'
};

const RESOURCE_ICONS = {
    power: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    water: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>,
    traffic: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><circle cx="12" cy="7" r="1" fill="currentColor"></circle><circle cx="12" cy="12" r="1" fill="currentColor"></circle><circle cx="12" cy="17" r="1" fill="currentColor"></circle></svg>,
    parking: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>,
    waste: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>,
    transit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="9" cy="16" r="1" fill="currentColor"></circle><circle cx="15" cy="16" r="1" fill="currentColor"></circle></svg>
};

function UtilBar({ pct, resource }) {
    const color = pct > 100 ? STATUS_COLOR.Overloaded
        : pct > 80 ? STATUS_COLOR.Congested
            : pct > 40 ? STATUS_COLOR.Optimal
                : STATUS_COLOR.Underutilized;
    return (
        <div title={`${resource}: ${pct}%`} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
            <span style={{ color, width: 14 }}>{RESOURCE_ICONS[resource]}</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{pct}%</span>
        </div>
    );
}

export default function UtilizationGrid({ wardAnalytics = [], onWardSelect }) {
    const [filter, setFilter] = useState('All');
    const [sortBy, setSortBy] = useState('avgPct');
    const [page, setPage] = useState(0);
    const PER_PAGE = 24;

    const statusOptions = ['All', 'Overloaded', 'Congested', 'Optimal', 'Underutilized'];

    const filtered = wardAnalytics
        .filter(w => filter === 'All' || w.overallStatus === filter)
        .sort((a, b) => sortBy === 'avgPct' ? b.avgPct - a.avgPct : a.wardId.localeCompare(b.wardId));

    const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Ward Utilization Grid
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>({filtered.length} wards)</span>
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        {statusOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <option value="avgPct">Sort: Highest Load</option>
                        <option value="wardId">Sort: Ward ID</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {paged.map(w => {
                    const borderColor = STATUS_COLOR[w.overallStatus];
                    return (
                        <div key={w.wardId}
                            onClick={() => onWardSelect && onWardSelect(w)}
                            style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '0.8rem', border: `2px solid ${borderColor}22`, borderLeft: `4px solid ${borderColor}`, cursor: onWardSelect ? 'pointer' : 'default', transition: 'transform 0.15s, box-shadow 0.15s' }}
                            onMouseEnter={e => { if (onWardSelect) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{w.name}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', background: borderColor, padding: '2px 7px', borderRadius: 12 }}>{w.overallStatus}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {w.zone} Zone — Avg {w.avgPct}%
                            </div>
                            {Object.entries(w.util).map(([res, u]) => (
                                <UtilBar key={res} pct={u.pct} resource={res} />
                            ))}
                            {onWardSelect && (
                                <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.7rem', color: 'var(--accent-light, #3b82f6)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    View in Command Center
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                        style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: page === 0 ? '#f0f0f0' : 'var(--accent-primary)', color: page === 0 ? '#999' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>
                        Prev
                    </button>
                    <span style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {page + 1} / {totalPages}
                    </span>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                        style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: page === totalPages - 1 ? '#f0f0f0' : 'var(--accent-primary)', color: page === totalPages - 1 ? '#999' : '#fff', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>
                        Next
                    </button>
                </div>
            )}
        </GlassCard>
    );
}
