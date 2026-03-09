import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ShieldCheck, Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';
import VisitorDetailsCard from '../components/VisitorDetailsCard';

export default function VideoVerificationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotification();

    const [visitor, setVisitor] = useState(null);
    const [isDecisionMade, setIsDecisionMade] = useState(null); // 'approved' or 'denied'
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
                    purpose: 'Delivery',
                    timestamp: new Date().toLocaleTimeString()
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

    const handleApprove = () => {
        setIsDecisionMade('approved');
        addNotification("Visitor Approved - Gate Opening", "success");
        setTimeout(() => navigate('/gate'), 2500); // fast track for demo
    };

    const handleReject = () => {
        setIsDecisionMade('denied');
        addNotification("Visitor Rejected", "error");
        setTimeout(() => navigate('/'), 2500);
    };

    if (isDecisionMade === 'approved') {
        return (
            <div className="card">
                <CheckCircle size={100} color="var(--color-success)" style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s' }} />
                <h1 style={{ color: 'var(--color-success)' }}>Visitor Approved – Gate Opening</h1>
                <p>Granting access.</p>
            </div>
        );
    }

    if (isDecisionMade === 'denied') {
        return (
            <div className="card">
                <XCircle size={100} color="var(--color-error)" style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s' }} />
                <h1 style={{ color: 'var(--color-error)' }}>Visitor Rejected</h1>
                <p>Entry was denied.</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '2rem', alignSelf: 'flex-start' }}>Video Verification</h2>

            {/* Section 1 - Visitor Information */}
            <VisitorDetailsCard visitor={visitor} />

            {/* Section 2 - Live Camera Module */}
            <div style={{ width: '100%', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                    <Camera size={24} /> LIVE CAMERA
                </h3>

                <div style={{
                    width: '100%',
                    backgroundColor: '#000',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {error ? (
                        <div style={{ color: 'var(--color-error-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <CameraOff size={48} />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                    {!error && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span> LIVE
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3 - Resident Decision Buttons */}
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <button
                    className="btn btn-success"
                    onClick={handleApprove}
                    style={{ flex: 1 }}
                >
                    <CheckCircle /> Approve
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleReject}
                    style={{ flex: 1 }}
                >
                    <XCircle /> Reject
                </button>
            </div>
        </div>
    );
}
