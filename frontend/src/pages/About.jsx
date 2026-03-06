import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const Section = ({ children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}
        style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
        {children}
    </motion.div>
);

const Stat = ({ value, label }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.03em' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
);

export default function About() {
    return (
        <MainLayout>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 2rem' }}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-light)', textTransform: 'uppercase', marginBottom: 10 }}>About the Project</div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Kavach-City AI</h1>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 620, lineHeight: 1.7 }}>
                        A real-time urban infrastructure command center that monitors, predicts, and responds to city-wide resource stress — built to demonstrate how AI and live data can protect critical infrastructure at scale.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <Section delay={0.05}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <Stat value="10" label="City Wards" />
                        <Stat value="6" label="Infrastructure Resources" />
                        <Stat value="5s" label="Real-time Update Interval" />
                        <Stat value="24h" label="Predictive Forecast Horizon" />
                    </div>
                </Section>

                <Section delay={0.1}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Mission</h3>
                    <p style={{ margin: 0, lineHeight: 1.75 }}>City infrastructure — power grids, water networks, traffic systems, waste management, parking, and public transit — fails silently until it doesn't. Kavach-City AI was built to change that: giving operators a live, unified picture of every ward's health, surfacing congestion before it becomes a crisis, and using AI to recommend precise corrective actions.</p>
                </Section>

                <Section delay={0.15}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.05rem' }}>What it monitors</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { name: 'Power Grid', desc: 'Load vs. rated capacity per ward' },
                            { name: 'Water Supply', desc: 'Pressure and throughput levels' },
                            { name: 'Traffic Flow', desc: 'Congestion index per corridor' },
                            { name: 'Parking', desc: 'Real-time occupancy across zones' },
                            { name: 'Waste Management', desc: 'Fill levels and collection status' },
                            { name: 'Public Transit', desc: 'Ridership vs. scheduled capacity' },
                        ].map(item => (
                            <div key={item.name} style={{ padding: '0.9rem 1rem', background: 'var(--accent-muted)', borderRadius: 10, border: '1px solid rgba(30,64,175,0.1)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: 4 }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section delay={0.2}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>How it works</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {[
                            { step: '01', title: 'Sensor Simulation', desc: 'A backend simulation engine generates realistic time-of-day load curves for all 10 wards every 5 seconds, including disaster scenarios.' },
                            { step: '02', title: 'Real-time Streaming', desc: 'Node.js + Socket.io pushes live ward state to every connected client without polling.' },
                            { step: '03', title: 'Analytics Engine', desc: 'The /api/analytics endpoint computes utilization percentages, status classification, zone comparisons, congestion alerts, and 24h/7d forecasts on every request.' },
                            { step: '04', title: 'AI Explainability', desc: 'When a ward exceeds 90% utilisation on any resource, the Featherless AI service (Qwen3-VL) generates a natural-language tactical response plan.' },
                        ].map(item => (
                            <div key={item.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.9rem 1rem', background: '#fafafa', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{item.step}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 3 }}>{item.title}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </MainLayout>
    );
}