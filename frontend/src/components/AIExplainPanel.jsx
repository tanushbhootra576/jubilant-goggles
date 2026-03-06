import React, { useState } from 'react';
import GlassCard from './GlassCard';

function severityColor(code) {
    if (!code) return '#1e40af';
    const c = code.toLowerCase();
    if (c === 'critical') return '#b91c1c';
    if (c === 'warning') return '#b45309';
    if (c === 'low') return '#0e7490';
    return '#15803d';
}

function SeverityBar({ severity = 0 }) {
    const segments = [
        { label: 'Low', range: [0, 40], color: '#15803d' },
        { label: 'Normal', range: [40, 60], color: '#0e7490' },
        { label: 'Warning', range: [60, 80], color: '#b45309' },
        { label: 'Critical', range: [80, 100], color: '#b91c1c' }
    ];
    const capped = Math.min(100, Math.max(0, severity));
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Severity Score</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: severityColor(capped > 80 ? 'critical' : capped > 60 ? 'warning' : 'normal') }}>{capped}</span>
            </div>
            <div style={{ position: 'relative', height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${capped}%`,
                    background: `linear-gradient(90deg, #15803d 0%, #0e7490 40%, #b45309 70%, #b91c1c 100%)`,
                    borderRadius: 5, transition: 'width 0.6s ease'
                }} />
                {/* Threshold markers */}
                {[40, 60, 80].map(t => (
                    <div key={t} style={{ position: 'absolute', left: `${t}%`, top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.5)' }} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                {segments.map(s => (
                    <span key={s.label} style={{ fontSize: '0.6rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
                ))}
            </div>
        </div>
    );
}

export default function AIExplainPanel({ ai }) {
    const [expanded, setExpanded] = useState(false);

    if (!ai) {
        return (
            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <h3 style={{ margin: 0, fontSize: '0.95rem' }}>AI Tactical Reasoning</h3>
                </div>
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(30,64,175,0.15)', borderTop: '3px solid var(--accent-primary)', animation: 'spin 1.2s linear infinite', margin: '0 auto 0.75rem' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Awaiting AI analysis...</p>
                    <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.72rem', marginTop: 4 }}>Triggers when any resource exceeds 80%</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </GlassCard>
        );
    }

    const sc = severityColor(ai.status_code);
    const isAI = ai.source?.startsWith('featherless');

    return (
        <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <h3 style={{ margin: 0, fontSize: '0.95rem' }}>AI Tactical Reasoning</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isAI && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6d28d9', background: 'rgba(109,40,217,0.08)', padding: '2px 7px', borderRadius: 10 }}>
                            Featherless AI
                        </span>
                    )}
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', background: sc, padding: '2px 9px', borderRadius: 10 }}>
                        {ai.status_code || 'Normal'}
                    </span>
                </div>
            </div>

            {/* Severity bar */}
            <div style={{ marginBottom: '0.9rem', padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: 8 }}>
                <SeverityBar severity={ai.severity} />
            </div>

            {/* Summary / Prediction */}
            {ai.summary && (
                <div style={{ marginBottom: '0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {ai.summary}
                </div>
            )}
            <div style={{ marginBottom: '0.85rem', padding: '0.65rem 0.75rem', background: `${sc}08`, borderLeft: `3px solid ${sc}`, borderRadius: '0 8px 8px 0', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: sc, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prediction</span>
                {ai.prediction}
            </div>

            {/* Tactical actions */}
            {(ai.tactical_action || []).length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Recommended Actions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {ai.tactical_action.map((action, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: `${sc}14`, color: sc, fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</span>
                                {action}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reasoning expandable */}
            {ai.reasoning && (
                <div>
                    <button onClick={() => setExpanded(e => !e)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        {expanded ? 'Hide' : 'Show'} Reasoning Detail
                    </button>
                    {expanded && (
                        <div style={{ marginTop: 8, background: '#f8fafc', borderRadius: 6, padding: '0.6rem 0.75rem', fontSize: '0.72rem', color: '#334155', lineHeight: 1.6, maxHeight: 200, overflowY: 'auto' }}>
                            {ai.reasoning.risk_assessment && <p style={{ margin: '0 0 4px' }}><strong>Risk:</strong> {ai.reasoning.risk_assessment}</p>}
                            {ai.reasoning.conclusion && <p style={{ margin: '0 0 4px' }}><strong>Conclusion:</strong> {ai.reasoning.conclusion}</p>}
                            {ai.reasoning.critical_resources?.length > 0 && (
                                <p style={{ margin: '0 0 4px' }}><strong>Critical Resources:</strong> {ai.reasoning.critical_resources.join(', ')}</p>
                            )}
                            {ai.reasoning.raw && <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ai.reasoning.raw}</p>}
                            {/* Fallback for older format */}
                            {ai.reasoning.power && <p style={{ margin: 0 }}><strong>Power trend:</strong> {JSON.stringify(ai.reasoning.power)}</p>}
                        </div>
                    )}
                </div>
            )}
        </GlassCard>
    );
}

