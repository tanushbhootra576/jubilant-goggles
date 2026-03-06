import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

function getColor(value) {
    if (value >= 90) return 'red';
    if (value >= 75) return 'orange';
    return 'green';
}

export default function MapView({ wards = [], disasterMode }) {
    const mapRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map', { center: [12.95, 77.55], zoom: 12 });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        wards.forEach(w => {
            const key = w.wardId;
            const score = Math.round((w.power + w.water + w.traffic) / 3);
            const color = getColor(score);

            if (!markersRef.current[key]) {
                const el = document.createElement('div');
                el.className = `marker ${color}` + (disasterMode ? ' pulsing' : '');
                el.innerHTML = `<div class="dot"></div>`;
                const marker = L.marker([w.location.lat, w.location.lng], { icon: L.divIcon({ className: '', html: el }) }).addTo(map);
                marker.bindPopup(`<b>${w.name}</b><br/>Power:${w.power.toFixed(0)}% Water:${w.water.toFixed(0)}% Traffic:${w.traffic.toFixed(0)}%`);
                markersRef.current[key] = { marker, el };
            } else {
                const { marker, el } = markersRef.current[key];
                el.className = `marker ${color}` + (disasterMode ? ' pulsing' : '');
                marker.setLatLng([w.location.lat, w.location.lng]);
                marker.setPopupContent(`<b>${w.name}</b><br/>Power:${w.power.toFixed(0)}% Water:${w.water.toFixed(0)}% Traffic:${w.traffic.toFixed(0)}%`);
            }
        });
    }, [wards, disasterMode]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                background: 'var(--bg-card)',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                height: '100%'
            }}
        >
            <div id="map" style={{ height: '100%', minHeight: '500px', borderRadius: '8px', overflow: 'hidden' }} />
        </motion.div>
    );
}
