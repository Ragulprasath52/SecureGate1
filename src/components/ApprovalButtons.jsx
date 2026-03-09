import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ApprovalButtons({ onApprove, onReject, isProcessing, decision }) {
    if (decision === 'approved') {
        return (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-success)', fontWeight: 600, fontSize: '1.25rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--border-radius-md)' }}>
                <CheckCircle size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Visitor Approved. Gate access granted.
            </div>
        );
    }

    if (decision === 'denied') {
        return (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-error)', fontWeight: 600, fontSize: '1.25rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--border-radius-md)' }}>
                <XCircle size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Visitor Rejected.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', marginTop: '1rem' }}>
            <button
                className="btn btn-success"
                onClick={onApprove}
                disabled={isProcessing}
                style={{ flex: 1 }}
            >
                <CheckCircle /> {isProcessing ? 'Processing...' : 'Approve'}
            </button>

            <button
                className="btn btn-danger"
                onClick={onReject}
                disabled={isProcessing}
                style={{ flex: 1 }}
            >
                <XCircle /> {isProcessing ? 'Processing...' : 'Reject'}
            </button>
        </div>
    );
}
