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
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard">
                            <button style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>View Live Dashboard</button>
                        </Link>
                        <Link to="/analytics">
                            <button style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', backgroundColor: '#eef2ff', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)' }}>
                                Infrastructure Analytics
                            </button>
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
                        <h3 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            Predictive Analytics
                        </h3>
                        <p>Using moving averages and machine learning to forecast power and water infrastructure bottlenecks 30–60 minutes in advance.</p>
                    </GlassCard>
                    <GlassCard>
                        <h3 style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
                            AI Explainability
                        </h3>
                        <p>Understand the exact reasoning behind automated tactical responses, ensuring human-in-the-loop oversight during critical moments.</p>
                    </GlassCard>
                    <GlassCard>
                        <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            Disaster Mode
                        </h3>
                        <p>Simulate large-scale catastrophic events (grid failure, massive flooding) to prepare and measure infrastructure resilience.</p>
                    </GlassCard>
                </div>
            </div>
        </MainLayout>
    );
}
