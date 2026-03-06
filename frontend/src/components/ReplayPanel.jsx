import React, { useState } from 'react';
import axios from 'axios';
import socket from '../services/socketService';
import GlassCard from './GlassCard';

export default function ReplayPanel() {
    const [playing, setPlaying] = useState(false);
    const [frames, setFrames] = useState([]);

    async function startReplay() {
        setPlaying(true);
        try {
            const res = await axios.get('http://localhost:4000/api/history?minutes=30');
            setFrames(res.data.frames || []);
            socket.emit('replay:start', { minutes: 30 });
        } catch (err) {
            console.error('replay fetch', err);
        }
    }

    function stopReplay() {
        setPlaying(false);
        socket.emit('replay:stop');
    }

    return (
        <GlassCard>
            <h3>Historical Timeline</h3>
            <p style={{ fontSize: '0.85rem' }}>View the last 30 minutes of sensor data.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={startReplay} disabled={playing} style={{ flex: 1, backgroundColor: playing ? '#cbd5e1' : 'var(--accent-primary)' }}>Replay</button>
                <button onClick={stopReplay} disabled={!playing} style={{ flex: 1, backgroundColor: !playing ? '#cbd5e1' : 'var(--warning)' }}>Stop</button>
            </div>
            {playing && (
                <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                    Playing {frames.length} frames...
                </div>
            )}
        </GlassCard>

    );
}
