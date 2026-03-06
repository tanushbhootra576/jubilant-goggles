import React from 'react';
import GlassCard from './GlassCard';

export default function WardPanel({ wards = [], onSelect }) {
  return (
    <GlassCard>
      <h3>Wards Monitor</h3>
      <div style={{ maxHeight: 420, overflow: 'auto', paddingRight: '10px' }}>
        {wards.map(w => (
          <div key={w.wardId} className="ward-row" onClick={() => onSelect && onSelect(w)}>
            <strong>{w.name}</strong>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Power: {Math.round(w.power)}% | Water: {Math.round(w.water)}% | Traffic: {Math.round(w.traffic)}%
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
