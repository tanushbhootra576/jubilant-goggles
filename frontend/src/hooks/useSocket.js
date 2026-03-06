import { useEffect } from 'react';
import socket from '../services/socketService';

export default function useSocket(onConnect) {
    useEffect(() => {
        socket.on('connect', () => onConnect && onConnect(socket));
        return () => socket.off('connect');
    }, []);
    return socket;
}
