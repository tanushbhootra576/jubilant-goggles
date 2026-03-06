import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GlassCard from '../GlassCard';

const STATUS_COLOR = {
    Overloaded: '#ef4444',
    Congested: '#f59e0b',
    Optimal: '#22c55e',
    Underutilized: '#3b82f6'
};

export default function HotspotMap({ hotspots = [], underutilized = [] }) {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);

    const combined = [
        ...hotspots.map(h => ({ ...h, type: 'hotspot' })),
        ...underutilized.map(u => ({ ...u, type: 'cold' }))
    ];

    useEffect(() => {
        if (!combined.length || !mapRef.current) return;
        if (leafletMap.current) {
            leafletMap.current.remove();
            leafletMap.current = null;
        }

        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([12.92, 77.55], 11);
        leafletMap.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
        }).addTo(map);

        combined.forEach(w => {
            if (!w.location?.lat || !w.location?.lng) return;
            const color = STATUS_COLOR[w.overallStatus] || '#8b5cf6';
            const radius = w.avgPct > 100 ? 700 : w.avgPct > 80 ? 550 : 400;

            const circle = L.circle([w.location.lat, w.location.lng], {
                color, fillColor: color, fillOpacity: 0.35, weight: 2, radius
            }).addTo(map);

            const popupContent = `
                <div style="font-family:sans-serif;min-width:180px;">
                    <strong style="font-size:13px;">${w.name}</strong>
                    <span style="float:right;font-size:11px;background:${color};color:white;padding:1px 6px;border-radius:10px;">${w.overallStatus}</span>
                    <hr style="margin:4px 0;opacity:0.2"/>
                    <div style="font-size:11px;color:#555;">Zone: ${w.zone} &mdash; Avg ${w.avgPct}%</div>
                    ${w.util ? Object.entries(w.util).map(([r, u]) =>
                `<div style="font-size:11px;margin-top:2px;"><strong>${r}:</strong> ${u.pct}% (${u.status})</div>`
            ).join('') : ''}
                </div>`;
            circle.bindPopup(popupContent);
        });

        return () => {
            if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
        };
    }, [hotspots.length, underutilized.length]);

    return (
        <GlassCard style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path></svg>
                Geographic Hotspot Detection
            </h3>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {Object.entries(STATUS_COLOR).map(([s, c]) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                        {s}
                    </div>
                ))}
            </div>

            <div ref={mapRef} style={{ height: 340, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }} />

            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{hotspots.length} Hotspots detected</span>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{underutilized.length} Underutilized zones</span>
            </div>
        </GlassCard>
    );
}
