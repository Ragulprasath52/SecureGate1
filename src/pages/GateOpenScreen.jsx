import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { ShieldCheck, DoorOpen } from 'lucide-react';

export default function GateOpenScreen() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let timer;
        const openGate = async () => {
            try {
                await apiService.openGate();
                setIsOpen(true);
                addNotification('Gate Opened... Welcome!', 'success');

                // Return to home after showing the open gate for a few seconds
                timer = setTimeout(() => {
                    navigate('/');
                }, 5000);
            } catch (err) {
                console.error("Gate open error:", err);
                addNotification(`Failed to open gate: ${err.message || 'Unknown Error'}`, 'error');
            }
        };

        openGate();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <div className="card">
            {!isOpen ? (
                <DoorOpen size={80} color="var(--color-primary)" className="animate-pulse" style={{ marginBottom: '1.5rem' }} />
            ) : (
                <ShieldCheck size={80} color="var(--color-success)" style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s' }} />
            )}

            <div className="gate-animation-container">
                <div className={`gate-door left ${isOpen ? 'open' : ''}`}></div>
                <div className={`gate-door right ${isOpen ? 'open' : ''}`}></div>
            </div>

            <h1 style={{ color: isOpen ? 'var(--color-success)' : 'var(--color-primary)' }}>
                {isOpen ? 'Welcome In!' : 'Gate Opening...'}
            </h1>
            <p>{isOpen ? 'Please proceed through the gate.' : 'Verifying connection and commanding gate mechanism.'}</p>
        </div>
    );
}
