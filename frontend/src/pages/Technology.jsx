import React from 'react';
import MainLayout from '../layouts/MainLayout';
import GlassCard from '../components/GlassCard';

export default function Technology() {
    return (
        <MainLayout>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
                <h1 style={{ color: 'var(--accent-primary)', marginBottom: '2rem' }}>System Architecture & Stack</h1>
                <GlassCard>
                    <h3>Frontend</h3>
                    <ul>
                        <li><strong>Vite + React:</strong> High performance modern web rendering.</li>
                        <li><strong>Leaflet.js:</strong> Geospatial visualization for city mapping.</li>
                        <li><strong>Framer Motion:</strong> Fluid alerts and layout transitions.</li>
                        <li><strong>Socket.io Client:</strong> Nanosecond latency event processing.</li>
                    </ul>
                </GlassCard>
                <div style={{ margin: '2rem 0' }}></div>
                <GlassCard>
                    <h3>Backend</h3>
                    <ul>
                        <li><strong>Node.js / Express:</strong> Scalable microservices.</li>
                        <li><strong>MongoDB Atlas:</strong> Highly available NoSQL cluster.</li>
                        <li><strong>MongoDB Change Streams:</strong> Native tracking of sensor state mutations.</li>
                        <li><strong>Socket.io:</strong> Scalable real-time duplex data flow for dashboard state.</li>
                    </ul>
                </GlassCard>
                <div style={{ margin: '2rem 0' }}></div>
                <GlassCard>
                    <h3>AI Layer</h3>
                    <ul>
                        <li><strong>Featherless API:</strong> Tactical analysis using open-source LLMs.</li>
                        <li><strong>Predictive Engine:</strong> Time-series models analyzing rolling 60-second windows for anomaly detection.</li>
                    </ul>
                </GlassCard>
            </div>
        </MainLayout>
    );
}