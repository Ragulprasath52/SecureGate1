import React from 'react';
import { User, Phone, Home, Clock, FileText } from 'lucide-react';

export default function VisitorDetailsCard({ visitor }) {
    if (!visitor) return null;

    return (
        <div style={{
            width: '100%',
            background: 'var(--color-surface-hover)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid var(--color-border)'
        }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                <FileText size={20} /> Visitor Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={14} /> Name
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{visitor.name}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={14} /> Phone
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{visitor.phone}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Home size={14} /> Purpose
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{visitor.purpose}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> Time of Request
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{visitor.timestamp}</strong>
                </div>
            </div>
        </div>
    );
}
