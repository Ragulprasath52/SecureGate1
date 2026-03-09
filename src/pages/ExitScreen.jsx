import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { LogOut, QrCode, CheckCircle, ChevronLeft } from 'lucide-react';

export default function ExitScreen() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleExit = async (method) => {
        setIsProcessing(true);
        addNotification(`Processing exit via ${method}...`, 'loading', 1000);

        try {
            await apiService.recordExit(method);
            setSuccess(true);
            addNotification('Visit Completed! Gate opening.', 'success');

            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            addNotification('Error recording exit. Please contact security.', 'error');
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="card">
                <CheckCircle size={100} color="var(--color-success)" style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s' }} />
                <h1 style={{ color: 'var(--color-success)' }}>Thank you</h1>
                <p style={{ fontSize: '1.5rem' }}>Visit Completed. Gate is opening for exit.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'var(--color-surface-hover)', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <ChevronLeft />
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Exit Complex</h2>
                <div style={{ width: '48px' }}></div> {/* Spacer for symmetry */}
            </div>

            <p style={{ marginTop: '1rem', marginBottom: '3rem' }}>Please select your exit method. If you received an exit QR code, you can scan it now.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                <button
                    className="btn btn-outline"
                    disabled={isProcessing}
                    onClick={() => handleExit('qr')}
                >
                    Scan QR Code <QrCode />
                </button>

                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>OR</div>

                <button
                    className="btn btn-primary"
                    disabled={isProcessing}
                    onClick={() => handleExit('button')}
                >
                    {isProcessing ? 'Processing Exit...' : 'Tap to Exit Without QR'} <LogOut />
                </button>
            </div>
        </div>
    );
}
