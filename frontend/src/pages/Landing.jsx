import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

export default function Landing() {
    return (
        <MainLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                        AI Powered Urban Infrastructure Intelligence
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 2rem' }}>
                        Kavach-City AI monitors power, water and traffic infrastructure in real time across city wards.
                        Predicting failures before they happen using Advanced AI.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/dashboard">
                            <button style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>View Live Dashboard</button>
                        </Link>
                        <Link to="/about">
                            <button style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', backgroundColor: '#e2e8f0', color: 'var(--text-primary)' }}>
                                Learn More
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <GlassCard>
                        <h3 style={{ color: 'var(--success)' }}>⚡ Predictive Analytics</h3>
                        <p>Using moving averages and machine learning to forecast power and water infrastructure bottlenecks 30–60 minutes in advance.</p>
                    </GlassCard>
                    <GlassCard>
                        <h3 style={{ color: 'var(--accent-primary)' }}>🤖 AI Explainability</h3>
                        <p>Understand the exact reasoning behind automated tactical responses, ensuring human-in-the-loop oversight during critical moments.</p>
                    </GlassCard>
                    <GlassCard>
                        <h3 style={{ color: 'var(--warning)' }}>🚨 Disaster Mode</h3>
                        <p>Simulate large-scale catastrophic events (grid failure, massive flooding) to prepare and measure infrastructure resilience.</p>
                    </GlassCard>
                </div>
            </div>
        </MainLayout>
    );
}
