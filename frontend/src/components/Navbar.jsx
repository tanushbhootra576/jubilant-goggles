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
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Kavach-City AI
                </Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/about" style={{ fontWeight: location.pathname === '/about' ? '600' : '400' }}>About</Link>
                <Link to="/technology" style={{ fontWeight: location.pathname === '/technology' ? '600' : '400' }}>Technology</Link>
                <Link to="/analytics" style={{
                    fontWeight: location.pathname === '/analytics' ? '700' : '500',
                    color: location.pathname === '/analytics' ? 'var(--accent-primary)' : 'inherit',
                    display: 'flex', alignItems: 'center', gap: 5
                }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    Analytics
                </Link>
                <Link to="/dashboard">
                    <button>Command Center</button>
                </Link>
            </div>
        </nav>
    );
}
