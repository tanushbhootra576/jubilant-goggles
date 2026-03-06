import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/analytics', label: 'Analytics' },
    { to: '/technology', label: 'Technology' },
    { to: '/about', label: 'About' },
];

export default function Navbar() {
    const location = useLocation();
    const active = location.pathname;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 2.5rem',
            height: 60,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 1px 3px rgba(15,23,42,0.06)'
        }}>
            {/* Brand */}
            <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Kavach-City AI
            </Link>

            {/* Nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {NAV_LINKS.map(({ to, label }) => {
                    const isActive = active === to;
                    return (
                        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 600 : 450,
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-muted)' : 'transparent',
                                transition: 'all 0.15s',
                                cursor: 'pointer',
                            }}>
                                {label}
                            </div>
                        </Link>
                    );
                })}
                <div style={{ width: 1, height: 22, background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{
                        padding: '6px 18px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        letterSpacing: '0.01em'
                    }}>
                        Command Center
                    </button>
                </Link>
            </div>
        </nav>
    );
}

