import React, { useEffect, useState, useCallback } from 'react';
import GlassCard from '../GlassCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell, PieChart, Pie, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const SECTOR_COLORS = {
    power: '#1e40af', water: '#0e7490', traffic: '#6d28d9',
    parking: '#0369a1', waste: '#065f46', transit: '#7c3aed'
};
const SECTOR_LABELS = {
    power: 'Power Grid', water: 'Water Supply', traffic: 'Traffic Mgmt',
    parking: 'Parking', waste: 'Waste Mgmt', transit: 'Public Transit'
};
const SECTORS = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];

function statusColor(s) {
    if (s === 'Underfunded') return '#b91c1c';
    if (s === 'Surplus') return '#0e7490';
    return '#15803d';
}

function cr(v) { return `₹${Number(v).toFixed(1)}Cr`; }

function KpiCard({ label, value, sub, color, icon }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '1rem 1.2rem',
            borderTop: `4px solid ${color}`,
            border: `1.5px solid ${color}22`,
            display: 'flex', alignItems: 'center', gap: '0.8rem'
        }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.73rem', fontWeight: 600, color: '#334155', marginTop: 2 }}>{label}</div>
                {sub && <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{sub}</div>}
            </div>
        </div>
    );
}

function SectorBar({ sector, allocated, spent, pct }) {
    const col = SECTOR_COLORS[sector];
    const spendPct = allocated > 0 ? Math.min(100, (spent / allocated) * 100) : 0;
    return (
        <div style={{ marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>{SECTOR_LABELS[sector]}</span>
                <span style={{ fontSize: '0.72rem', color: col, fontWeight: 700 }}>{cr(allocated)}</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `${col}40`, borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: `${spendPct * pct / 100}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Spent: {cr(spent)} ({spendPct.toFixed(0)}%)</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{pct.toFixed(0)}% of city budget</span>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: '0.78rem' }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ margin: '2px 0', color: p.fill || p.stroke }}>
                    {p.name}: <strong>{typeof p.value === 'number' ? `${cr(p.value)}` : p.value}</strong>
                </p>
            ))}
        </div>
    );
};

function WardRankingTable({ wards, title, sortKey = 'totalBudget', limit = 10 }) {
    const [sortBy, setSortBy] = useState(sortKey);
    const sorted = [...wards].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, limit);

    const cols = [
        { key: 'totalBudget', label: 'Budget' },
        { key: 'totalSpent', label: 'Spent' },
        { key: 'overallUtil', label: 'Utilisation' },
        { key: 'deficitCr', label: 'Deficit' }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                    {cols.map(c => (
                        <button key={c.key} onClick={() => setSortBy(c.key)}
                            style={{ padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600, border: 'none', borderRadius: 5, cursor: 'pointer', background: sortBy === c.key ? 'var(--accent-primary)' : 'rgba(0,0,0,0.06)', color: sortBy === c.key ? '#fff' : 'var(--text-secondary)' }}>
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                            <th style={{ textAlign: 'left', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>#</th>
                            <th style={{ textAlign: 'left', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Ward</th>
                            <th style={{ textAlign: 'left', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Zone</th>
                            <th style={{ textAlign: 'right', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Budget</th>
                            <th style={{ textAlign: 'right', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Spent</th>
                            <th style={{ textAlign: 'right', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Util %</th>
                            <th style={{ textAlign: 'right', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Deficit</th>
                            <th style={{ textAlign: 'center', padding: '5px 8px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((w, idx) => (
                            <tr key={w.wardId} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: idx % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent' }}>
                                <td style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--text-secondary)' }}>{idx + 1}</td>
                                <td style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</td>
                                <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{w.zone}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#1e40af' }}>{cr(w.totalBudget)}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--text-primary)' }}>{cr(w.totalSpent)}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: w.overallUtil > 80 ? '#b91c1c' : w.overallUtil > 60 ? '#b45309' : '#15803d' }}>
                                    {w.overallUtil}%
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: w.deficitCr > 0 ? '#b91c1c' : '#15803d' }}>
                                    {w.deficitCr > 0 ? `-${cr(w.deficitCr)}` : '+' + cr(w.surplusCr)}
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white', background: w.isUnderfunded ? '#b91c1c' : '#15803d', padding: '2px 6px', borderRadius: 10 }}>
                                        {w.isUnderfunded ? 'Underfunded' : 'Adequate'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function WardBudgetGrid({ wardBudgets = [] }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {wardBudgets.map(w => {
                const borderColor = w.isUnderfunded ? '#b91c1c' : w.surplusCr > 5 ? '#0e7490' : '#15803d';
                const isOpen = expanded === w.wardId;
                return (
                    <div key={w.wardId}
                        onClick={() => setExpanded(isOpen ? null : w.wardId)}
                        style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '0.85rem', borderLeft: `4px solid ${borderColor}`, border: `1.5px solid ${borderColor}22`, borderLeft: `4px solid ${borderColor}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{w.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{w.zone} Zone</div>
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white', background: borderColor, padding: '2px 7px', borderRadius: 10 }}>
                                {w.isUnderfunded ? 'Underfunded' : 'Adequate'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>{cr(w.totalBudget)}</div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Allocated</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0e7490' }}>{cr(w.totalSpent)}</div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Spent</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: w.overallUtil > 80 ? '#b91c1c' : '#15803d' }}>{w.overallUtil}%</div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Util</div>
                            </div>
                        </div>

                        {/* Spend progress bar */}
                        <div style={{ marginTop: '0.6rem', height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${Math.min(100, w.spendRate)}%`, background: borderColor, borderRadius: 3, transition: 'width 0.5s' }} />
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            Spend rate: {w.spendRate}% &nbsp;|&nbsp; {w.isUnderfunded ? `Deficit: ${cr(w.deficitCr)}` : `Surplus: ${cr(w.surplusCr)}`}
                        </div>

                        {/* Expanded sector breakdown */}
                        {isOpen && (
                            <div style={{ marginTop: '0.7rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                {SECTORS.map(s => {
                                    const sd = w.sectors[s];
                                    const col = SECTOR_COLORS[s];
                                    const spPct = sd.allocated > 0 ? Math.min(100, (sd.spent / sd.allocated) * 100) : 0;
                                    return (
                                        <div key={s} style={{ marginBottom: 5 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 2 }}>
                                                <span style={{ color: col, fontWeight: 600 }}>{SECTOR_LABELS[s]}</span>
                                                <span style={{ color: sd.status === 'Underfunded' ? '#b91c1c' : 'var(--text-secondary)' }}>
                                                    {cr(sd.spent)}/{cr(sd.allocated)} &bull; {sd.usagePct}%
                                                </span>
                                            </div>
                                            <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 3 }}>
                                                <div style={{ height: '100%', width: `${spPct}%`, background: col, borderRadius: 3 }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div style={{ marginTop: 4, fontSize: '0.65rem', color: 'var(--accent-primary)', textAlign: 'right' }}>
                            {isOpen ? 'Click to collapse' : 'Click for sector details'}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function AiBudgetPanel({ aiData, onRefresh, loading }) {
    if (loading) return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(30,64,175,0.15)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.6rem' }} />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Featherless AI analysing budget...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (!aiData) return (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>AI budget analysis not yet run</p>
            <button onClick={onRefresh} style={{ padding: '5px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                Run AI Analysis
            </button>
        </div>
    );
    const sc = aiData.budgetStatus === 'Deficit' ? '#b91c1c' : aiData.budgetStatus === 'Surplus' ? '#0e7490' : '#15803d';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white', background: sc, padding: '3px 12px', borderRadius: 12 }}>
                    {aiData.budgetStatus || 'Stable'}
                </span>
                {aiData.risk_score !== undefined && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Risk Score: <strong style={{ color: aiData.risk_score > 60 ? '#b91c1c' : aiData.risk_score > 40 ? '#b45309' : '#15803d' }}>{aiData.risk_score}</strong>/100
                    </span>
                )}
                {aiData.source && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6d28d9', background: 'rgba(109,40,217,0.08)', padding: '2px 7px', borderRadius: 10, marginLeft: 'auto' }}>
                        {aiData.source === 'featherless-ai' ? 'Featherless AI' : 'Local Heuristic'}
                    </span>
                )}
            </div>
            {aiData.headline && (
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.55, padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: 8 }}>
                    {aiData.headline}
                </p>
            )}
            {aiData.underfunding_risk && (
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#b45309', lineHeight: 1.45, padding: '0.5rem 0.75rem', background: 'rgba(180,83,9,0.05)', borderLeft: '3px solid #b45309', borderRadius: '0 6px 6px 0' }}>
                    <strong>Underfunding Risk:</strong> {aiData.underfunding_risk}
                </p>
            )}
            {aiData.redistribution_plan?.length > 0 && (
                <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Redistribution Plan</div>
                    {aiData.redistribution_plan.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: '0.79rem', color: 'var(--text-primary)', marginBottom: 5, lineHeight: 1.45 }}>
                            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'rgba(30,64,175,0.1)', color: 'var(--accent-primary)', fontSize: '0.62rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</span>
                            {r}
                        </div>
                    ))}
                </div>
            )}
            {aiData.insight && (
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>{aiData.insight}</p>
            )}
            <button onClick={onRefresh} style={{ alignSelf: 'flex-start', padding: '4px 12px', background: 'none', border: '1px solid rgba(30,64,175,0.25)', borderRadius: 6, color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                Refresh Analysis
            </button>
        </div>
    );
}

export default function BudgetAnalysis() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiData, setAiData] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchBudget = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/budget`);
            const json = await res.json();
            if (json.ok && json.budget) {
                setData(json.budget);
                setLastUpdated(new Date());
                setError(null);
            }
        } catch (e) {
            setError('Failed to load budget data. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAI = useCallback(async (budgetData) => {
        if (!budgetData) return;
        setAiLoading(true);
        try {
            const res = await fetch(`${API}/api/ai/budget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wards: budgetData.wardBudgets?.slice(0, 10),
                    cityTotals: { total: budgetData.cityTotal, spend: budgetData.citySpend },
                    underfunded: budgetData.underfunded?.slice(0, 5),
                    topBudget: budgetData.topBudget?.slice(0, 3),
                    sectorTotals: budgetData.sectorTotals
                })
            });
            const json = await res.json();
            if (json.ok && json.analysis) setAiData(json.analysis);
        } catch (e) {
            console.warn('AI budget analysis unavailable');
        } finally {
            setAiLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudget();
        const timer = setInterval(fetchBudget, 30000);
        return () => clearInterval(timer);
    }, [fetchBudget]);

    // Auto-run AI once data loaded
    useEffect(() => {
        if (data && !aiData) fetchAI(data);
    }, [data, aiData, fetchAI]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 38, height: 38, border: '4px solid var(--accent-primary)', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading budget engine...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <GlassCard style={{ padding: '2rem', maxWidth: 480, margin: '3rem auto', textAlign: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 10 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <h3 style={{ color: '#b91c1c', margin: '0 0 8px' }}>Budget Data Unavailable</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{error}</p>
            <button onClick={fetchBudget} style={{ marginTop: '0.8rem', padding: '7px 18px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </GlassCard>
    );

    if (!data) return null;

    const { wardBudgets = [], sectorTotals = {}, sectorSpend = {}, cityTotal = 0, citySpend = 0,
        topSector, topBudget = [], topUtilisation = [], topEfficiency = [],
        underfunded = [], surplus = [], zoneSummary = [], generatedAt } = data;

    const spendRate = cityTotal > 0 ? ((citySpend / cityTotal) * 100).toFixed(1) : 0;
    const topSectorLabel = SECTOR_LABELS[topSector] || topSector;

    // Sector chart data
    const sectorChartData = SECTORS.map(s => ({
        name: SECTOR_LABELS[s].replace(' Mgmt', '').replace(' Grid', '').replace(' Supply', ''),
        allocated: sectorTotals[s] || 0,
        spent: sectorSpend[s] || 0
    }));

    // Zone chart data
    const zoneChartData = zoneSummary.map(z => ({
        zone: z.zone,
        budget: z.totalBudget,
        spent: z.totalSpent,
        deficit: z.totalDeficit,
        avgUtil: z.avgUtil
    }));

    // City-wide sector allocation pie
    const sectorPieData = SECTORS.map(s => ({ name: SECTOR_LABELS[s], value: sectorTotals[s] || 0 }));
    const totalSectorAlloc = SECTORS.reduce((s, k) => s + (sectorTotals[k] || 0), 0);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>

            {/* ── Page sub-header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Budget Allocation Analysis</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Ward-wise infrastructure spend, sector funding breakdown, and AI redistribution recommendations
                    </p>
                </div>
                {lastUpdated && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Updated: {lastUpdated.toLocaleTimeString()}</span>}
            </div>

            {/* ── KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <KpiCard label="City Total Budget" value={cr(cityTotal)} sub="across all wards" color="var(--accent-primary)"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3H8L2 7h20z" /></svg>} />
                <KpiCard label="Total Spend" value={cr(citySpend)} sub={`${spendRate}% utilised`} color="#0e7490"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} />
                <KpiCard label="Top Funded Sector" value={topSectorLabel} sub={cr(sectorTotals[topSector] || 0)} color="#6d28d9"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>} />
                <KpiCard label="Underfunded Wards" value={underfunded.length} sub="demand exceeds budget" color={underfunded.length > 0 ? '#b91c1c' : '#15803d'}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>} />
                <KpiCard label="Highest Budget Ward" value={topBudget[0]?.name || '—'} sub={cr(topBudget[0]?.totalBudget || 0)} color="#1e40af"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>} />
                <KpiCard label="Surplus Wards" value={surplus.length} sub="budget exceeds demand" color="#15803d"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>} />
            </div>

            {/* ── Row 1: Sector breakdown + AI Insights ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Sector Allocation */}
                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.95rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
                        Sector Budget Allocation
                    </h3>
                    {SECTORS.map(s => {
                        const pct = totalSectorAlloc > 0 ? (sectorTotals[s] / totalSectorAlloc) * 100 : 0;
                        return <SectorBar key={s} sector={s} allocated={sectorTotals[s] || 0} spent={sectorSpend[s] || 0} pct={pct} />;
                    })}
                </GlassCard>

                {/* AI Budget Intelligence */}
                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.95rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        AI Budget Intelligence
                    </h3>
                    <AiBudgetPanel aiData={aiData} onRefresh={() => { setAiData(null); fetchAI(data); }} loading={aiLoading && !aiData} />
                </GlassCard>
            </div>

            {/* ── Row 2: Bar charts ─ Sector vs Zone ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 700 }}>Sector Budget vs Spend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sectorChartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="allocated" name="Allocated (Cr)" radius={[3, 3, 0, 0]}>
                                {sectorChartData.map((_, i) => <Cell key={i} fill={`${SECTOR_COLORS[SECTORS[i]]}80`} />)}
                            </Bar>
                            <Bar dataKey="spent" name="Spent (Cr)" radius={[3, 3, 0, 0]}>
                                {sectorChartData.map((_, i) => <Cell key={i} fill={SECTOR_COLORS[SECTORS[i]]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 700 }}>Zone Budget vs Deficit</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={zoneChartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="budget" name="Budget (Cr)" fill="#1e40af80" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="spent" name="Spent (Cr)" fill="#1e40af" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="deficit" name="Deficit (Cr)" fill="#b91c1c" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* ── Row 3: Underfunded + Surplus + Ranking ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.85rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.9rem', fontWeight: 700 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        Underfunded Wards
                        <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 4 }}>demand &gt; budget</span>
                    </h3>
                    {underfunded.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: '#15803d', textAlign: 'center', padding: '1rem 0' }}>No underfunded wards detected</p>
                    ) : underfunded.map((w, i) => (
                        <div key={w.wardId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#b91c1c', width: 18 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{w.name} <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>({w.zone})</span></div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Budget: {cr(w.totalBudget)} &bull; Demand: {cr(w.totalDemand)} &bull; Util: {w.overallUtil}%</div>
                            </div>
                            <span style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.78rem', flexShrink: 0 }}>-{cr(w.deficitCr)}</span>
                        </div>
                    ))}
                </GlassCard>

                <GlassCard style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.85rem', color: '#0e7490', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.9rem', fontWeight: 700 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Budget Surplus Wards
                        <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 4 }}>potential reallocation</span>
                    </h3>
                    {surplus.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No surplus wards identified</p>
                    ) : surplus.map((w, i) => (
                        <div key={w.wardId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#0e7490', width: 18 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{w.name} <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>({w.zone})</span></div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Budget: {cr(w.totalBudget)} &bull; Util: {w.overallUtil}%</div>
                            </div>
                            <span style={{ fontWeight: 800, color: '#0e7490', fontSize: '0.78rem', flexShrink: 0 }}>+{cr(w.surplusCr)}</span>
                        </div>
                    ))}
                </GlassCard>
            </div>

            {/* ── Row 4: Full ward ranking table ── */}
            <GlassCard style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <WardRankingTable wards={wardBudgets} title="Full Ward Budget Rankings" />
            </GlassCard>

            {/* ── Row 5: Ward-by-ward grid ── */}
            <GlassCard style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.95rem', fontWeight: 700 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Ward Budget Detail
                    <span style={{ fontSize: '0.76rem', fontWeight: 400, color: 'var(--text-secondary)' }}>Click a card to expand sector breakdown</span>
                </h3>
                <WardBudgetGrid wardBudgets={wardBudgets} />
            </GlassCard>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Last computed: {generatedAt ? new Date(generatedAt).toLocaleString() : '—'} &nbsp;|&nbsp; Auto-refresh every 30s
            </div>
        </div>
    );
}
