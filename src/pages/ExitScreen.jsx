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
            <div className="registration-page">
                <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="professional-card" style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
                        <CheckCircle size={100} color="var(--color-success)" style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s' }} />
                        <h1 style={{ color: 'var(--color-success)', fontSize: '2.5rem', fontWeight: 800 }}>Thank you</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Visit Completed. Gate is opening for exit.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-page">
            <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="professional-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 2rem' }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                        <button style={{ padding: '0.75rem', borderRadius: '50%', color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'var(--color-surface-hover)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/')}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, color: 'var(--color-text)', fontWeight: 800 }}>Exit Complex</h2>
                        <div style={{ width: '48px' }}></div>
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                        Please select your exit method. If you received an exit QR code, you can scan it now.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                        <button
                            className="submit-btn"
                            style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                            disabled={isProcessing}
                            onClick={() => handleExit('qr')}
                        >
                            <QrCode size={20} /> SCAN QR CODE
                        </button>

                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>OR</div>

                        <button
                            className="submit-btn"
                            disabled={isProcessing}
                            onClick={() => handleExit('button')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                        >
                            {isProcessing ? 'PROCESSING...' : <><LogOut size={20} /> TAP TO EXIT</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
