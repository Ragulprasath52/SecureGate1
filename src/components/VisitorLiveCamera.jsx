import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

export default function VisitorLiveCamera() {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let stream = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Unable to access camera. Please check permissions.');
                console.error("Camera access error:", err);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                <Camera size={24} /> LIVE VISITOR CAMERA
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
    );
}
