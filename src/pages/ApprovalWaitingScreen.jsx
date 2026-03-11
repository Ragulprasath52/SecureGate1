import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, CheckCircle2, Home, Briefcase, Clock, ExternalLink } from 'lucide-react';
import '../styles/visitor-form.css'; // Reusing professional-card styles

export default function ApprovalWaitingScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    // Status states: 'waiting' -> 'approved'
    const [status, setStatus] = useState('waiting');
    const [rejectionReason, setRejectionReason] = useState(null);
    const [id, setId] = useState(location.state?.requestId || null);

    // Visitor data from state
    const visitorName = location.state?.name || 'Visitor';
    const visitorFlat = location.state?.flat || 'A-101';
    const visitorPurpose = location.state?.purpose || 'Meeting';

    useEffect(() => {
        if (!id) return;

        const pollStatus = async () => {
            try {
                const data = await apiService.getVisitor(id);
                if (data.success) {
                    if (data.data.status !== 'waiting') {
                        setStatus(data.data.status);
                        setRejectionReason(data.data.rejection_reason);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        const interval = setInterval(pollStatus, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [id]);

    if (status === 'denied') {
        return (
            <div className="registration-page">
                <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="professional-card animate-slide-in" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '3rem 2rem'
                    }}>
                        <div className="trust-badge" style={{ background: 'var(--color-error-light)', color: 'var(--color-error-text)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '2rem' }}>
                            <ShieldCheck size={16} /> Identity Verified
                        </div>

                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <X size={50} color="var(--color-error)" />
                        </div>

                        <h1 style={{ color: 'var(--color-text)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                            ACCESS DENIED
                        </h1>

                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            Sorry, your entry request has been denied by the resident.
                        </p>

                        {rejectionReason && (
                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px dashed var(--color-border)', width: '100%', marginBottom: '2rem', textAlign: 'left' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reason for Denial</span>
                                <p style={{ margin: 0, color: 'var(--color-text)', fontWeight: 600, fontSize: '1rem' }}>"{rejectionReason}"</p>
                            </div>
                        )}

                        <button onClick={() => navigate('/')} className="submit-btn" style={{ height: '50px', background: 'var(--color-text)' }}>
                            RETURN TO HOME
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'approved') {
        return (
            <div className="registration-page">
                <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="professional-card animate-slide-in" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '3rem 2rem'
                    }}>

                        <div className="trust-badge" style={{ background: 'var(--color-success-light)', color: 'var(--color-success-text)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '2rem' }}>
                            <ShieldCheck size={16} /> Identity Verified
                        </div>

                        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <div className="ping-ring" style={{ position: 'absolute', inset: 0, background: 'var(--color-success)', borderRadius: '50%', opacity: 0.2 }}></div>
                            <CheckCircle2 size={70} color="var(--color-success)" style={{ position: 'relative', zIndex: 2 }} />
                        </div>

                        <h1 style={{ color: 'var(--color-text)', fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                            ACCESS GRANTED
                        </h1>

                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                            Welcome, <strong>{visitorName}</strong>. You may now proceed.
                        </p>

                        <div style={{ background: 'var(--color-success-light)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success-text)', fontWeight: 700 }}>
                                <ExternalLink size={18} /> GATES OPENING
                            </div>
                            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                                Please collect your pass from the reception.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="submit-btn"
                            style={{ marginTop: '2rem', height: '50px' }}
                        >
                            DONE
                        </button>
                    </div>
                </div>
                <style>{`
                    .ping-ring {
                        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                    @keyframes ping {
                        75%, 100% { transform: scale(2); opacity: 0; }
                    }
                `}</style>
            </div>
        );
    }

    // Default 'Waiting' Screen
    return (
        <div className="registration-page">
            <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="professional-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 2rem' }}>

                    <div style={{
                        width: '70px', height: '70px',
                        borderRadius: '50%',
                        background: 'var(--color-background)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--color-border)'
                    }}>
                        <Loader2 size={32} color="var(--color-primary)" className="animate-spin" />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Connecting to Resident...</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '2rem', maxWidth: '300px' }}>
                        Asking for access to <strong>Flat {visitorFlat}</strong>. This usually takes less than a minute.
                    </p>

                    <div style={{ width: '100%', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.25rem', display: 'grid', gap: '0.75rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
                            Access Details
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(47, 107, 255, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={16} /></div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Destination</span>
                                <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 700, fontSize: '0.9rem' }}>Flat {visitorFlat}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={16} /></div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Purpose</span>
                                <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 700, fontSize: '0.9rem' }}>{visitorPurpose}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={16} /></div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Request Time</span>
                                <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 700, fontSize: '0.9rem' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
