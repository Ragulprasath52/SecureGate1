import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Loader2, XCircle, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

export default function ApprovalWaitingScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotification();
    const [status, setStatus] = useState('waiting'); // 'waiting', 'approved', 'denied'
    const requestId = location.state?.requestId;
    const demoLink = location.state?.link;

    useEffect(() => {
        const timer = setTimeout(() => {
            // After 5 seconds, simulate the resident approval navigation automatically for the demo
            navigate('/video-verification', { state: location.state });
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, location.state]);

    const copyLink = () => {
        navigator.clipboard.writeText(demoLink);
        addNotification('Link copied to clipboard. Open in new tab.', 'success');
    };

    if (status === 'approved') {
        return (
            <div className="card">
                <CheckCircle size={100} color="var(--color-success)" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ color: 'var(--color-success)' }}>Access Approved</h1>
                <p>Please verify using OTP or QR.</p>
            </div>
        );
    }

    if (status === 'denied') {
        return (
            <div className="card">
                <XCircle size={100} color="var(--color-error)" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ color: 'var(--color-error)' }}>Access Denied</h1>
                <p>Access Denied by Resident.</p>
                <button className="btn btn-outline" onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }

    return (
        <div className="card">
            <Loader2 size={100} color="var(--color-primary)" className="animate-spin" style={{ marginBottom: '1.5rem' }} />
            <h2>Waiting for Resident Approval...</h2>
            <p style={{ marginTop: '1rem' }}>
                We have notified the resident at <strong>{location.state?.flat || 'the selected home'}</strong>.
                Please wait while they review your request live.
            </p>

        </div>
    );
}
