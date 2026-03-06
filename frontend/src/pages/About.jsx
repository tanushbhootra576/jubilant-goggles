import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function About() {
    return (
        <MainLayout>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
                <h1 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>About Kavach-City AI</h1>
                <p>Built for the smart city hackathon, Kavach-City AI is a command-center level application intended to save lives and maximize infrastructure efficiency.</p>
                <p>This prototype demonstrates real-time visualization, reactive predictive modeling, and integration with powerful AI reasoning via Featherless AI.</p>
            </div>
        </MainLayout>
    );
}