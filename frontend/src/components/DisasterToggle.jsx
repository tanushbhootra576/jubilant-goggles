import React, { useState } from 'react';
import socket from '../services/socketService';
import GlassCard from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function DisasterToggle() {
    const [enabled, setEnabled] = useState(false);
    const [scenario, setScenario] = useState('power');

    const toggle = () => {
        const next = !enabled;
        setEnabled(next);
        socket.emit('disaster:set', { enabled: next, scenario });
    };

    return (
        <GlassCard>
            <h3>Disaster Simulation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select value={scenario} onChange={e => setScenario(e.target.value)} disabled={enabled} style={{ padding: '0.5rem', width: '100%' }}>
                    <option value="power">Power Grid Failure</option>
                    <option value="flood">Flash Flood</option>
                    <option value="traffic">Major Traffic Accident</option>
                    <option value="pipeline">Water Pipeline Burst</option>
                </select>
                <button
                    onClick={toggle}
                    style={{
                        backgroundColor: enabled ? 'var(--critical)' : 'var(--accent-primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '10px'
                    }}
                >
                    {enabled ? 'Disable Emergency Mode' : 'Trigger Simulaton'}
                </button>
            </div>
        </GlassCard>
    );
}
