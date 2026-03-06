import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import WardPanel from '../components/WardPanel';
import HealthIndex from '../components/HealthIndex';
import DisasterToggle from '../components/DisasterToggle';
import ReplayPanel from '../components/ReplayPanel';
import AIExplainPanel from '../components/AIExplainPanel';
import socket from '../services/socketService';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [wards, setWards] = useState([]);
    const [disasterMode, setDisasterMode] = useState(false);
    const [ai, setAi] = useState(null);

    useEffect(() => {
        socket.on('sensors:bulk', ({ wards: latest }) => {
            setWards(latest);
        });

        socket.on('ai:analysis', ({ ai: aiResp }) => {
            setAi(aiResp);
        });

        socket.on('connect', () => console.log('socket connected'));

        return () => {
            socket.off('sensors:bulk');
            socket.off('ai:analysis');
        };
    }, []);

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 1fr) 2fr minmax(300px, 1fr)',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    height: '100%'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <WardPanel wards={wards} />
                    <DisasterToggle />
                    <ReplayPanel />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                    <MapView wards={wards} disasterMode={disasterMode} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <HealthIndex wards={wards} />
                    <AIExplainPanel ai={ai} />
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
