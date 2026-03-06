import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const LAYERS = [
    {
        id: 'frontend',
        label: 'Frontend',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
        description: 'A single-page React application built on Vite with client-side routing, live Socket.io connection, and Recharts/Leaflet visualizations.',
        items: [
            { tech: 'Vite + React 18', note: 'HMR dev server, optimised production bundles via Rollup' },
            { tech: 'React Router DOM', note: '5-route SPA: /, /dashboard, /analytics, /technology, /about' },
            { tech: 'Leaflet.js', note: 'Carto light-theme tile map with CircleMarker overlays per ward' },
            { tech: 'Recharts', note: 'BarChart, LineChart, PieChart for real-time utilisation dashboards' },
            { tech: 'Framer Motion', note: 'Layout transitions, mount animations, hover micro-interactions' },
            { tech: 'Socket.io Client', note: 'Live sensor:bulk event stream from backend with auto-reconnect' },
        ]
    },
    {
        id: 'backend',
        label: 'Backend',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
        description: 'An Express.js server that runs a deterministic sensor simulation, streams results over Socket.io, persists readings to MongoDB, and exposes REST analytics endpoints.',
        items: [
            { tech: 'Node.js + Express', note: 'Lightweight REST API with CORS, JSON middleware, and graceful error handling' },
            { tech: 'Socket.io Server', note: 'Broadcasts sensors:bulk every 5s to all connected clients with ward state diff' },
            { tech: 'MongoDB + Mongoose', note: 'Ward and SensorReading schemas; bulk insertMany writes; index on wardId + timestamp' },
            { tech: 'Simulation Engine', note: 'Mean-reversion random walk with time-of-day sinusoidal load curve and disaster spikes' },
            { tech: 'Analytics Engine', note: 'Per-request computation of utilisation %, zones, hotspots, forecasts, recommendations' },
            { tech: 'nodemon', note: 'File-watch restart in development; configurable via package.json scripts' },
        ]
    },
    {
        id: 'ai',
        label: 'AI Layer',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>,
        description: 'Featherless AI provides zero-infrastructure access to open-source LLMs. The system triggers an AI analysis call when any ward resource exceeds 90% utilisation.',
        items: [
            { tech: 'Featherless API', note: 'OpenAI-compatible REST endpoint — no GPU infrastructure required' },
            { tech: 'Qwen3-VL-30B-A3B', note: 'Open-source multimodal model used for tactical emergency response generation' },
            { tech: 'Prediction Service', note: 'Rolling 60-sample moving average with slope detection and flagAI threshold trigger' },
            { tech: 'Local Fallback', note: 'Rule-based heuristics activate if the LLM API is unreachable, ensuring zero downtime' },
        ]
    },
];

export default function Technology() {
    const [active, setActive] = useState('frontend');
    const layer = LAYERS.find(l => l.id === active);

    return (
        <MainLayout>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-light)', textTransform: 'uppercase', marginBottom: 10 }}>Under the hood</div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.75rem' }}>System Architecture</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>A full-stack, real-time infrastructure intelligence platform. Three layers working together to simulate, analyze, and act on city data.</p>
                </motion.div>

                {/* Architecture diagram */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.8)', borderRadius: 14, border: '1px solid var(--border-color)' }}>
                    {['Sensors / Simulation', 'MongoDB', 'Express + Socket.io', 'React SPA', 'Featherless AI'].map((node, i, arr) => (
                        <React.Fragment key={node}>
                            <div style={{ textAlign: 'center', padding: '0.6rem 1rem', background: 'var(--accent-muted)', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>{node}</div>
                            {i < arr.length - 1 && <div style={{ width: 24, height: 1, background: 'var(--border-color)', flexShrink: 0, position: 'relative' }}><div style={{ position: 'absolute', right: -4, top: -4, borderLeft: '6px solid var(--text-muted)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }}></div></div>}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* Layer tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', padding: '4px', background: 'rgba(255,255,255,0.7)', borderRadius: 10, border: '1px solid var(--border-color)', width: 'fit-content' }}>
                    {LAYERS.map(l => (
                        <button key={l.id} onClick={() => setActive(l.id)} style={{
                            padding: '7px 18px', border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                            background: active === l.id ? 'var(--accent-primary)' : 'transparent',
                            color: active === l.id ? '#fff' : 'var(--text-secondary)'
                        }}>
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Layer detail */}
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                    style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '1.75rem', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>
                        {layer.icon}
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{layer.label} Layer</h3>
                    </div>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', lineHeight: 1.7 }}>{layer.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.6rem' }}>
                        {layer.items.map(item => (
                            <div key={item.tech} style={{ display: 'flex', gap: '0.75rem', padding: '0.8rem 1rem', background: '#fafafa', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                                <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', marginTop: 7 }} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.855rem', color: 'var(--text-primary)', marginBottom: 2 }}>{item.tech}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}