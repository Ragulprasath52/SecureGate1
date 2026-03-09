import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { ChevronLeft, Send } from 'lucide-react';

export default function VisitorForm() {
    const navigate = useNavigate();
    const { addNotification, removeNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        flat: '',
        purpose: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorLine, setErrorLine] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorLine(''); // clear errors on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.flat || !formData.purpose) {
            setErrorLine('All fields are required.');
            return;
        }
        if (formData.phone.length < 10) {
            setErrorLine('Please enter a valid phone number.');
            return;
        }

        setIsSubmitting(true);
        const loadingId = addNotification('Sending Request...', 'loading', 0);

        try {
            await apiService.registerVisitor(formData);
            removeNotification(loadingId);
            addNotification('Request Sent! Your request has been sent to the resident for approval.', 'success');
            // Navigation with pass-through state (could use query params or context in true app)
            setTimeout(() => navigate('/waiting', { state: { flat: formData.flat } }), 1000);
        } catch (err) {
            removeNotification(loadingId);
            addNotification('Failed to send request.', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', color: 'white', border: 'none', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <ChevronLeft />
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Register Visit</h2>
                <div style={{ width: '48px' }}></div> {/* Spacer for symmetry */}
            </div>

            {errorLine && <div style={{ color: 'var(--color-error)', width: '100%', textAlign: 'left', marginBottom: '1rem', fontWeight: 500 }}>{errorLine}</div>}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="input-group">
                    <label>Visitor Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tap to enter name" />
                </div>

                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Tap to enter number" />
                </div>

                <div className="input-group">
                    <label>Flat / House Number</label>
                    <input type="text" name="flat" value={formData.flat} onChange={handleChange} placeholder="E.g. A-101" />
                </div>

                <div className="input-group">
                    <label>Purpose of Visit</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange}>
                        <option value="" disabled>Select purpose</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Guest">Guest / Friend</option>
                        <option value="Maintenance">Maintenance / Service</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                    {isSubmitting ? 'Sending Request...' : 'Request Entry'} <Send size={24} />
                </button>
            </form>
        </div>
    );
}
