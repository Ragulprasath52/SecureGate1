import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useNotification } from '../components/NotificationProvider';
import { ShieldCheck, Loader2 } from 'lucide-react';
import VisitorLiveCamera from '../components/VisitorLiveCamera';
import VisitorDetailsCard from '../components/VisitorDetailsCard';
import ApprovalButtons from '../components/ApprovalButtons';

export default function ResidentApprovalPage() {
    const { id } = useParams();
    const { addNotification } = useNotification();

    const [visitor, setVisitor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState(null); // 'approved' or 'denied'

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await apiService.getRequestDetails(id);
                setVisitor(response.data);
                if (response.data.status !== 'waiting') {
                    setDecision(response.data.status);
                }
            } catch (err) {
                addNotification('Could not load request details. Link might be invalid.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, addNotification]);

    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            await apiService.approveVisitor(id);
            addNotification('Visitor Approved Successfully', 'success');
            setDecision('approved');
        } catch (err) {
            addNotification('Failed to approve request', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await apiService.rejectVisitor(id);
            addNotification('Visitor Rejected', 'info');
            setDecision('denied');
        } catch (err) {
            addNotification('Failed to reject request', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Loader2 size={64} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!visitor) {
        return (
            <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div className="card">
                    <h1>Invalid Request</h1>
                    <p>This visitor request does not exist or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <div className="kiosk-header" style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
                <div className="kiosk-logo">
                    <ShieldCheck size={28} />
                    SafeEntry (SecureGate)
                </div>
                <div className="kiosk-time">Flat {visitor.flat}</div>
            </div>

            <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '2rem', alignSelf: 'flex-start' }}>Entry Authorization Request</h2>

                <VisitorDetailsCard visitor={visitor} />

                <VisitorLiveCamera />

                <ApprovalButtons
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessing={isProcessing}
                    decision={decision}
                />
            </div>
        </div>
    );
}
