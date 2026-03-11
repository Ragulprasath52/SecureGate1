import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ShieldCheck, CameraOff, Loader2 } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

export default function VideoVerificationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotification();

    const [visitor, setVisitor] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    const requestId = location.state?.requestId;

    // Load visitor details and setup camera
    useEffect(() => {
        let stream = null;

        const setup = async () => {
            if (requestId) {
                try {
                    const response = await apiService.getRequestDetails(requestId);
                    setVisitor(response.data);
                } catch (e) {
                    console.error("Could not load details");
                }
            } else {
                // Mock fallback if user browses directly without state
                setVisitor({
                    name: 'Demo Visitor',
                    phone: '9876543210',
                    flat: 'A-101',
                    purpose: 'Delivery'
                });
            }

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Unable to access camera. Please check permissions.');
            }
        };

        setup();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [requestId]);

    // Auto-transition to waiting screen after a simulated "Resident Approval" period
    useEffect(() => {
        if (!error && visitor) {
            const timer = setTimeout(() => {
                addNotification("Resident notified. Connecting...", "success");
                navigate('/waiting', { state: location.state });
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [error, visitor, navigate, location.state, addNotification]);

    return (
        <div className="registration-page">
            <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="professional-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <div className="trust-badge" style={{ marginBottom: '1.25rem' }}>
                        <ShieldCheck size={16} /> Live Feed to Resident
                    </div>

                    <h2 className="header-title" style={{ marginBottom: '0.5rem', width: '100%', textAlign: 'center' }}>
                        Resident Approval
                    </h2>

                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Your live video is being shown to the resident of {visitor?.flat || 'the flat'}. Please wait for them to grant access.
                    </p>

                    {/* Live Camera Module */}
                    <div style={{ width: '100%', marginBottom: '1.5rem', position: 'relative' }}>
                        <div style={{
                            width: '240px',
                            height: '240px',
                            backgroundColor: '#111827',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            margin: '0 auto',
                            border: '4px solid var(--color-border)',
                            boxShadow: 'var(--shadow-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {error ? (
                                <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem' }}>
                                    <CameraOff size={40} opacity={0.6} />
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{error}</span>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {/* Recording Indicator */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'rgba(0,0,0,0.5)',
                                        padding: '4px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        <div style={{ width: '8px', height: '8px', background: 'var(--color-error)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                        <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Live</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--color-background)',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            fontSize: '0.95rem'
                        }}>
                            <Loader2 size={18} className="animate-spin" />
                            Awaiting resident response...
                        </div>
                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Connection is active. Please stay in front of the camera.
                        </p>
                    </div>

                    {visitor && (
                        <div style={{ marginTop: '1.5rem', width: '100%', textAlign: 'left', padding: '1rem', background: 'var(--color-primary-glow)', borderRadius: '10px', border: '1px solid var(--admin-primary-glow)' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>Visitor</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{visitor.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Access Request: {visitor.flat}</div>
                        </div>
                    )}
                    Broadway                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
