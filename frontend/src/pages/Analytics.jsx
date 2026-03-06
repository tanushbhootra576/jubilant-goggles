import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';
import UtilizationGrid from '../components/analytics/UtilizationGrid';
import CongestionAlerts from '../components/analytics/CongestionAlerts';
import CapacityStress from '../components/analytics/CapacityStress';
import ForecastChart from '../components/analytics/ForecastChart';
import Recommendations from '../components/analytics/Recommendations';
import StatusDistribution from '../components/analytics/StatusDistribution';
import HotspotMap from '../components/analytics/HotspotMap';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const POLL_INTERVAL = 10000; // 10 seconds

function SummaryCard({ label, value, sub, color, icon }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '1rem 1.25rem',
            border: `2px solid ${color}33`, borderTop: `4px solid ${color}`,
            display: 'flex', alignItems: 'center', gap: '0.85rem'
        }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginTop: 3 }}>{label}</div>
                {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{sub}</div>}
            </div>
        </div>
    );
}

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const navigate = useNavigate();

    const handleWardSelect = (ward) => {
        navigate('/dashboard', { state: { selectedWard: ward } });
    };

    const fetchAnalytics = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/analytics`);
            const json = await res.json();
            if (json.ok && json.analytics) {
                setData(json.analytics);
                setLastUpdated(new Date());
                setError(null);
            }
        } catch (e) {
            setError('Failed to connect to backend. Make sure the server is running on port 4000.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
        const timer = setInterval(fetchAnalytics, POLL_INTERVAL);
        return () => clearInterval(timer);
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid var(--accent-primary)', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading analytics engine...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <GlassCard style={{ padding: '2rem', maxWidth: 480, textAlign: 'center' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <h3 style={{ color: '#ef4444', marginBottom: 8 }}>Connection Error</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{error}</p>
                        <button onClick={fetchAnalytics}
                            style={{ marginTop: '1rem', padding: '8px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                            Retry
                        </button>
                    </GlassCard>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) return null;

    const { wardAnalytics = [], zoneSummaries = [], cityAvg = {}, hotspots = [], underutilized = [],
        distribution = {}, alerts = [], forecast24h = [], forecast7d = [],
        recommendations = [], generatedAt } = data;

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const overloadedZones = zoneSummaries.filter(z =>
        Object.values(z.resources).some(r => r.status === 'Overloaded')
    ).length;

    const resources = ['power', 'water', 'traffic', 'parking', 'waste', 'transit'];
    const avgOverall = Math.round(resources.reduce((s, r) => s + (cityAvg[r]?.avg || 0), 0) / resources.length);

    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ padding: '1.5rem', maxWidth: 1600, margin: '0 auto' }}>

                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                            Infrastructure Analytics
                        </h1>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Real-time capacity utilization, congestion alerts, and predictive insights across all city resources
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Live — {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}
                        </span>
                        <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem', marginBottom: '1.5rem' }}>
                    <SummaryCard label="Total Wards Monitored" value={wardAnalytics.length} sub="across all zones" color="#3b82f6"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>} />
                    <SummaryCard label="City Avg Utilization" value={`${avgOverall}%`} sub="across 6 resources" color={avgOverall > 100 ? '#ef4444' : avgOverall > 80 ? '#f59e0b' : '#22c55e'}
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>} />
                    <SummaryCard label="Active Alerts" value={alerts.length} sub={`${criticalCount} critical`} color={criticalCount > 0 ? '#ef4444' : '#f59e0b'}
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>} />
                    <SummaryCard label="Overloaded Zones" value={overloadedZones} sub="zones above capacity" color={overloadedZones > 0 ? '#ef4444' : '#22c55e'}
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>} />
                    <SummaryCard label="Hotspot Wards" value={hotspots.length} sub="congested or overloaded" color="#8b5cf6"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path></svg>} />
                    <SummaryCard label="Underutilized Zones" value={underutilized.length} sub="below 40% capacity" color="#06b6d4"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} />
                </div>

                {/* Row 1: Capacity Stress + Status Distribution + Congestion Alerts */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <CapacityStress cityAvg={cityAvg} zoneSummaries={zoneSummaries} />
                    <StatusDistribution distribution={distribution} totalWards={wardAnalytics.length} />
                    <CongestionAlerts alerts={alerts} />
                </div>

                {/* Row 2: Forecast + Hotspot Map */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <ForecastChart forecast24h={forecast24h} forecast7d={forecast7d} />
                    <HotspotMap hotspots={hotspots} underutilized={underutilized} />
                </div>

                {/* Row 3: Recommendations */}
                <div style={{ marginBottom: '1rem' }}>
                    <Recommendations recommendations={recommendations} />
                </div>

                {/* Row 4: Full ward utilization grid */}
                <div>
                    <UtilizationGrid wardAnalytics={wardAnalytics} onWardSelect={handleWardSelect} />
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Last computed: {generatedAt ? new Date(generatedAt).toLocaleString() : '—'} &nbsp;|&nbsp; Auto-refresh every {POLL_INTERVAL / 1000}s
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
