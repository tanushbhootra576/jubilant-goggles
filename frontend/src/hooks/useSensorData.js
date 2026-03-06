import { useEffect, useState } from 'react';
import socket from '../services/socketService';
import { normalizeWards } from '../services/sensorService';

export default function useSensorData() {
    const [wards, setWards] = useState([]);

    useEffect(() => {
        socket.on('sensors:bulk', ({ wards: raw }) => {
            setWards(normalizeWards(raw));
        });
        return () => {
            socket.off('sensors:bulk');
        };
    }, []);

    return { wards };
}
