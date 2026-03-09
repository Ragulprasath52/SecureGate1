import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowRight } from 'lucide-react';

export default function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="card">
            <ShieldCheck size={80} color="var(--color-primary)" style={{ marginBottom: '1.5rem' }} />
            <h1>SecureGate</h1>
            <h2>Visitor Access Kiosk</h2>
            <p>Please register your visit to get access pass or select exit if you are leaving.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>
                    Register Visit <ArrowRight />
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/exit')}>
                    Exit Complex <LogOut />
                </button>
            </div>
        </div>
    );
}
