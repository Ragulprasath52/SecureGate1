import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ShieldCheck, User, Phone, Briefcase, Home, Clock, X, Check, Loader2, Camera, UserX, AlertCircle } from 'lucide-react';

export default function ResidentApprovalPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [visitor, setVisitor] = useState({
        name: "Rahul Sharma",
        phone: "+91 9876543210",
        flat: "A-101",
        purpose: "Delivery / Courier",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState(null);

    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisitor = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiService.getRequestDetails(id || 1); // Fallback to 1 for testing
                if (data.success) {
                    setVisitor(data.data);
                } else {
                    setError("Visitor request not found.");
                }
            } catch (error) {
                console.error("Error fetching visitor:", error);
                setError("Network error: Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchVisitor();
    }, [id]);

    const handleApprove = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const data = await apiService.updateVisitorStatus(id, 'approved');
            if (data.success) {
                setDecision('approved');
            } else {
                setError(data.message || "Failed to approve.");
            }
        } catch (error) {
            console.error("Error approving visitor:", error);
            setError("Connection failed. Please check your internet.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!showRejectionInput) {
            setShowRejectionInput(true);
            return;
        }

        if (!rejectionReason.trim()) {
            setError("Please enter a reason for denial.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        try {
            const data = await apiService.updateVisitorStatus(id, 'denied', rejectionReason);
            if (data.success) {
                setDecision('denied');
            } else {
                setError(data.message || "Failed to deny entry.");
            }
        } catch (error) {
            console.error("Error rejecting visitor:", error);
            setError("Connection failed. Please check your internet.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
            </div>
        );
    }

    // Mobile layout container
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            background: '#f1f5f9',
            fontFamily: 'Inter, sans-serif'
        }}>

            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '430px',
                minHeight: '100vh',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--color-text)'
            }}>
                {/* Header App Bar */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: 'white',
                    padding: '2.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '12px' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>SecureGate</h2>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 500 }}>Resident Approval System</span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'transparent' }}>

                    {decision ? (
                        <div style={{
                            background: decision === 'approved' ? '#d1fae5' : '#fee2e2',
                            border: `1px solid ${decision === 'approved' ? '#34d399' : '#f87171'}`,
                            padding: '2rem 1.5rem',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            marginTop: '2rem',
                            animation: 'scaleIn 0.3s ease-out'
                        }}>
                            <div style={{
                                width: '80px', height: '80px',
                                borderRadius: '50%',
                                background: decision === 'approved' ? '#10b981' : '#ef4444',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                {decision === 'approved' ? <Check size={40} /> : <X size={40} />}
                            </div>
                            <h2 style={{ color: decision === 'approved' ? '#065f46' : '#991b1b', margin: '0 0 0.5rem 0' }}>
                                {decision === 'approved' ? 'Entry Approved' : 'Entry Denied'}
                            </h2>
                            <p style={{ color: decision === 'approved' ? '#064e3b' : '#7f1d1d', margin: '0 0 1rem 0' }}>
                                {decision === 'approved' ? 'The gate system has been notified. The visitor is proceeding to your flat.' : `The guard has been notified to deny entry.`}
                            </p>
                            {decision === 'denied' && rejectionReason && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px dashed #f87171', width: '100%', marginBottom: '1.5rem' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reason Provided</span>
                                    <span style={{ color: '#7f1d1d', fontWeight: 500 }}>"{rejectionReason}"</span>
                                </div>
                            )}
                            <button
                                onClick={() => window.close()}
                                style={{ padding: '0.75rem 2rem', background: 'transparent', border: `1px solid ${decision === 'approved' ? '#10b981' : '#ef4444'}`, color: decision === 'approved' ? '#065f46' : '#991b1b', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.6rem 1.25rem', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 700, alignItems: 'center', gap: '0.6rem', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <Clock size={16} /> Action Required: Visitor Waiting
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeInUp 0.3s ease-out' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <AlertCircle size={20} />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        style={{ background: '#991b1b', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Try Refreshing Page
                                    </button>
                                </div>
                            )}

                            {/* Visitor Details Card */}
                            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--color-text)', fontSize: '1.125rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', fontWeight: 700 }}>Visitor Details</h3>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
                                            <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>{visitor.name}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Purpose</span>
                                            <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>{visitor.purpose}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</span>
                                            <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>{visitor.phone}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Request Time</span>
                                            <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>{visitor.created_at ? new Date(visitor.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Floating Action Buttons or Rejection Input */}
                {!decision && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 -4px 15px rgba(0,0,0,0.05)' }}>
                        {showRejectionInput && (
                            <div style={{ marginBottom: '0.5rem', animation: 'fadeInUp 0.3s ease-out' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Reason for Denial</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g., Not at home / Don't recognize"
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-border)',
                                        background: '#f8fafc',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text)',
                                        resize: 'none',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                disabled={isProcessing}
                                onClick={handleReject}
                                style={{ flex: 1, padding: '1rem', background: showRejectionInput ? '#ef4444' : 'rgba(239, 68, 68, 0.1)', color: showRejectionInput ? 'white' : '#f87171', border: showRejectionInput ? 'none' : '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><X size={20} /> {showRejectionInput ? 'Confirm Denial' : 'Deny'}</>}
                            </button>

                            {!showRejectionInput && (
                                <button
                                    disabled={isProcessing}
                                    onClick={handleApprove}
                                    style={{ flex: 2, padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Approve Entry</>}
                                </button>
                            )}

                            {showRejectionInput && (
                                <button
                                    onClick={() => setShowRejectionInput(false)}
                                    style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#64748b', border: '1px solid var(--color-border)', borderRadius: '14px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <style>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
            </div>
        </div>
    );
}
