import React from 'react';
import GlassCard from './GlassCard';

export default function AIExplainPanel({ ai }) {
    if (!ai) return <GlassCard><h3>AI Reasoning</h3><div style={{ color: 'var(--text-secondary)' }}>Awaiting tactical scenarios...</div></GlassCard>;

    const statusColor = ai.severity > 90 ? 'var(--critical)' : ai.severity > 75 ? 'var(--warning)' : 'var(--success)';

    return (
        <GlassCard>
            <h3>AI Tactical Reasoning</h3>
            <div style={{ marginBottom: '10px' }}>
                <strong>Severity:</strong> <span style={{ color: statusColor, fontWeight: 'bold' }}>{ai.severity} ({ai.status_code})</span>
            </div>
            <div style={{ marginBottom: '10px', fontSize: '0.9rem', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                <strong>Prediction:</strong> {ai.prediction}
            </div>
            <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
                <strong>Reasoning Data:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', background: '#f1f5f9', padding: '10px', borderRadius: '4px', overflowX: 'hidden' }}>
                    {JSON.stringify(ai.reasoning, null, 2)}
                </pre>
            </div>
            <div style={{ marginTop: '10px' }}>
                <strong>Recommended Actions:</strong>
                <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {(ai.tactical_action || []).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            </div>
        </GlassCard>
    );
}

