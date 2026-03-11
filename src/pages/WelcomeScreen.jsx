import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Shield, Clock, Lock } from 'lucide-react';
import '../styles/visitor-form.css'; // Reusing glass-card styles

export default function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="registration-page">
            <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="professional-card animate-slide-in" style={{ width: '100%', maxWidth: '500px', padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <div className="trust-badge" style={{ marginBottom: '2rem' }}>
                        <ShieldCheck size={16} /> Secure Access Kiosk
                    </div>

                    <div
                        style={{
                            width: '80px', height: '80px',
                            borderRadius: '22px',
                            background: 'var(--color-primary-glow)',
                            border: '1px solid var(--admin-primary-glow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1.5rem',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative'
                        }}
                    >
                        <ShieldCheck size={42} color="var(--color-primary)" />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 850, margin: '0 0 0.25rem 0', color: 'var(--color-text)', letterSpacing: '-0.04em' }}>
                        SecureGate
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '2.5rem', maxWidth: '320px' }}>
                        Welcome to our secure community. Please tap below to begin your entry process.
                    </p>

                    <button
                        onClick={() => navigate('/register')}
                        className="submit-btn"
                        style={{
                            height: '70px',
                            fontSize: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            background: 'var(--color-primary)',
                            borderRadius: '16px'
                        }}
                    >
                        <UserCheck size={24} /> TAP TO START <ArrowRight size={20} />
                    </button>

                    <div style={{
                        marginTop: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        padding: '1rem',
                        background: 'var(--color-surface-hover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '16px',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Lock size={14} /> Encrypted
                        </div>
                        <div style={{ width: '1px', height: '12px', background: 'var(--color-border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Clock size={14} /> 24/7 Security
                        </div>
                    </div>
                </div>

                <div
                    style={{ marginTop: '2rem', color: 'var(--color-text-light)', opacity: 0.3, cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s ease' }}
                    onClick={() => navigate('/admin-login')}
                >
                    Administrative Login
                </div>
            </div>
        </div>
    );
}
