import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>🛡️ Kavach-City AI</Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/about" style={{ fontWeight: location.pathname === '/about' ? '600' : '400' }}>About</Link>
                <Link to="/technology" style={{ fontWeight: location.pathname === '/technology' ? '600' : '400' }}>Technology</Link>
                <Link to="/dashboard">
                    <button>Command Center</button>
                </Link>
            </div>
        </nav>
    );
}
