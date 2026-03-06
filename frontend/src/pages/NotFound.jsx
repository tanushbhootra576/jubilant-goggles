import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <MainLayout>
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                <h1 style={{ fontSize: '4rem', color: 'var(--critical)' }}>404</h1>
                <h2>Page Not Found</h2>
                <p style={{ marginBottom: '2rem' }}>The requested sector is outside our ward jurisdiction.</p>
                <Link to="/">
                    <button>Return to Base</button>
                </Link>
            </div>
        </MainLayout>
    );
}