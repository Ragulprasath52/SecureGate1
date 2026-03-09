import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { ShieldCheck, QrCode, KeyRound, ChevronLeft } from 'lucide-react';

export default function AuthScreen() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'qr'
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (authMethod === 'otp') {
            inputsRef.current[0]?.focus();
        }
    }, [authMethod]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        // Auto verify when filled
        if (index === 3 && value && !newOtp.includes('')) {
            verifyOTP(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace handling
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const verifyOTP = async (code) => {
        setIsVerifying(true);
        try {
            await apiService.verifyOTP(code);
            addNotification('Access Approved! Opening gate.', 'success');
            navigate('/gate');
        } catch (err) {
            addNotification('Verification Failed: Invalid OTP.', 'error');
            // Reset OTP
            setOtp(['', '', '', '']);
            inputsRef.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleScanQR = async () => {
        setIsVerifying(true);
        addNotification('Scanning...', 'info', 1000);
        try {
            await apiService.verifyQR('simulate_qr_code_data');
            addNotification('QR Code Verified! Opening gate.', 'success');
            navigate('/gate');
        } catch (err) {
            addNotification('Verification Failed.', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="card" style={{ paddingTop: '2rem' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'var(--color-surface-hover)', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <ChevronLeft />
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Verify Identity</h2>
                <div style={{ width: '48px' }}></div> {/* Spacer for symmetry */}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'var(--color-surface-hover)', padding: '0.5rem', borderRadius: '12px' }}>
                <button
                    className="btn"
                    onClick={() => setAuthMethod('otp')}
                    style={{ flex: 1, padding: '0.75rem', background: authMethod === 'otp' ? 'var(--color-primary)' : 'transparent', color: authMethod === 'otp' ? 'white' : 'var(--color-text)', boxShadow: 'none' }}
                >
                    <KeyRound size={20} /> Enter OTP
                </button>
                <button
                    className="btn"
                    onClick={() => setAuthMethod('qr')}
                    style={{ flex: 1, padding: '0.75rem', background: authMethod === 'qr' ? 'var(--color-primary)' : 'transparent', color: authMethod === 'qr' ? 'white' : 'var(--color-text)', boxShadow: 'none' }}
                >
                    <QrCode size={20} /> Scan QR
                </button>
            </div>

            {authMethod === 'otp' ? (
                <div style={{ textAlign: 'center' }}>
                    <p>Please enter the 4-digit code provided to you by the resident. (Try 1234)</p>
                    <div className="otp-container">
                        {[0, 1, 2, 3].map((index) => (
                            <input
                                key={index}
                                type="number"
                                disabled={isVerifying}
                                ref={(el) => (inputsRef.current[index] = el)}
                                className="otp-digit"
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                min="0"
                                max="9"
                            />
                        ))}
                    </div>
                    {isVerifying ? (
                        <button className="btn btn-primary" disabled>
                            Verifying...
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => verifyOTP(otp.join(''))}>
                            Verify Access <ShieldCheck />
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <p>Hold your QR code up to the scanner built into this kiosk.</p>

                    <div className="qr-scanner-placeholder" onClick={!isVerifying ? handleScanQR : undefined} style={{ cursor: 'pointer' }}>
                        {!isVerifying ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-success)' }}>
                                <QrCode size={64} style={{ marginBottom: '1rem' }} />
                                <div>Tap to Simulate Scan</div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <ShieldCheck size={48} className="animate-spin text-success" />
                                <div style={{ marginTop: '1rem' }}>Processing...</div>
                            </div>
                        )}
                        <div className="qr-scanner-line"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
