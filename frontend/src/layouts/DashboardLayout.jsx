import React from 'react';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }) {
    // Dashboard might be a full screen app layout without footer
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <main style={{ flex: 1, overflow: 'auto', background: '#f1f5f9' }}>
                {children}
            </main>
        </div>
    );
}
