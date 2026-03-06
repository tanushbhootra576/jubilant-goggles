import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, style, className = '' }) {
    return (
        <motion.div
            className={`glass-card ${className}`}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
