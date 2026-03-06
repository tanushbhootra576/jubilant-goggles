import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto'
        }}>
            <p>&copy; {new Date().getFullYear()} Kavach-City AI. All rights reserved.</p>
        </footer>
    );
}
