import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FEATURES = [
    {
        title: 'Predictive Analytics',
        desc: 'Time-series moving averages forecast power, water, and traffic bottlenecks 30–60 minutes in advance before they become incidents.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    },
    {
        title: 'Live Infrastructure Map',
        desc: 'Leaflet-powered city map shows ward-level health indicators updated every 5 seconds across all 10 monitored zones.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path></svg>
    },
    {
        title: 'AI Decision Explainability',
        desc: 'When utilisation exceeds safe thresholds, the Featherless AI model generates plain-language tactical response plans with full reasoning traces.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>
    },
    {
        title: 'Disaster Simulation',
        desc: 'Inject grid failures, flooding, or pipeline breaks to stress-test city infrastructure and measure response time before a real event.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    },
    {
        title: 'Capacity Stress Analysis',
        desc: 'Zone-by-zone capacity versus load comparisons across 6 resource types: power, water, traffic, parking, waste, and transit.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    },
    {
        title: 'Historical Replay',
        desc: 'Scrub through the last 30 minutes of sensor history to understand how an incident developed and retrace the sequence of events.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.78"></path></svg>
    },
];

export default function Landing() {
    return (
        <MainLayout>
            <div style={{ maxWidth: 1160, margin: '0 auto', padding: '4rem 2rem' }}>
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'var(--accent-muted)', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                        Live — 10 wards monitored in real time
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.04em', lineHeight: 1.15 }}>
                        Urban Infrastructure<br />Intelligence Platform
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
                        Kavach-City AI gives city operators a unified real-time view of all critical infrastructure — and predicts failures before they happen.
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '10px 24px', fontSize: '0.95rem', fontWeight: 600, borderRadius: 9 }}>Command Center</button>
                        </Link>
                        <Link to="/analytics" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '10px 24px', fontSize: '0.95rem', fontWeight: 600, borderRadius: 9, background: 'rgba(255,255,255,0.9)', color: 'var(--accent-primary)', border: '1.5px solid rgba(30,64,175,0.25)' }}>
                                Infrastructure Analytics
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Feature grid */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Everything in one dashboard</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Six modules working in real time across every ward.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.35 }}
                                style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-muted)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
