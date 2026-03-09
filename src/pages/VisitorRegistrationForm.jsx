import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { ChevronLeft, Send, User, Phone, Home, Briefcase, Camera, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import '../styles/visitor-form.css';

export default function VisitorRegistrationForm() {
    const navigate = useNavigate();
    const { addNotification, removeNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        flat: '',
        purpose: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        phone: false,
        flat: false,
        purpose: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errorLine, setErrorLine] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorLine('');
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateField = (name, value) => {
        if (!touched[name]) return null;
        if (!value) return false;
        if (name === 'phone' && value.length < 10) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all as touched
        setTouched({
            name: true,
            phone: true,
            flat: true,
            purpose: true
        });

        if (!formData.name || !formData.phone || !formData.flat || !formData.purpose) {
            setErrorLine('Please fill in all required fields to proceed.');
            return;
        }

        setIsSubmitting(true);
        const loadingId = addNotification('Securely transmitting request...', 'loading', 0);

        try {
            // Include image in request if we were actually processing it, but backend might not support it yet
            // const payload = { ...formData, photo: capturedImage };
            const response = await apiService.registerVisitor(formData);
            removeNotification(loadingId);

            setSubmitSuccess(true);

            // Wait for success animation, then navigate
            setTimeout(() => {
                navigate('/waiting', {
                    state: {
                        flat: formData.flat,
                        requestId: response.data.requestId,
                        link: response.data.approvalLink
                    }
                });
            }, 2500);
        } catch (err) {
            removeNotification(loadingId);
            addNotification('Failed to send request.', 'error');
            setIsSubmitting(false);
            setSubmitSuccess(false);
        }
    };

    const renderValidationIcon = (fieldName) => {
        const isValid = validateField(fieldName, formData[fieldName]);
        if (isValid === null) return null;
        if (isValid) return <CheckCircle2 size={18} className="input-status valid" color="var(--color-success)" />;
        return <AlertCircle size={18} className="input-status invalid" color="var(--color-error)" />;
    };

    const getInputClass = (fieldName) => {
        const isValid = validateField(fieldName, formData[fieldName]);
        let className = "input-field";
        if (formData[fieldName]) className += " has-value";
        if (isValid === null) return className;
        return `${className} ${isValid ? 'valid' : 'invalid'}`;
    };

    if (submitSuccess) {
        return (
            <div className="registration-container">
                <div className="glass-card approval-indicator">
                    <div className="ripple-circle success">
                        <CheckCircle2 size={40} color="var(--color-success)" />
                    </div>
                    <h2>Entry Request Sent</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                        Waiting for resident approval from Flat <strong>{formData.flat}</strong>.<br />
                        Please stand by...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-container">
            <div className="glass-card">
                <div className="trust-badge">
                    <ShieldCheck size={16} />
                    <span>SecureGate Encrypted Entry</span>
                </div>

                <div className="form-header">
                    <button type="button" className="back-btn" onClick={() => navigate('/')}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="header-title">Visitor Registration</h2>
                    <div style={{ width: '40px' }}></div>
                </div>

                {errorLine && (
                    <div style={{
                        background: 'var(--color-error-light)',
                        color: 'var(--color-error-text)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} />
                        {errorLine}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-wrapper">
                        <User size={20} className="input-icon" />
                        <input
                            type="text"
                            name="name"
                            className={getInputClass('name')}
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label className="input-label">Visitor Full Name</label>
                        {renderValidationIcon('name')}
                    </div>

                    <div className="input-wrapper">
                        <Phone size={20} className="input-icon" />
                        <input
                            type="tel"
                            name="phone"
                            className={getInputClass('phone')}
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label className="input-label">Phone Number</label>
                        {renderValidationIcon('phone')}
                    </div>

                    <div className="input-wrapper">
                        <Home size={20} className="input-icon" />
                        <input
                            type="text"
                            name="flat"
                            className={getInputClass('flat')}
                            value={formData.flat}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label className="input-label">Flat / House Number</label>
                        {renderValidationIcon('flat')}
                    </div>

                    <div className="input-wrapper">
                        <Briefcase size={20} className="input-icon" />
                        <select
                            name="purpose"
                            className={getInputClass('purpose')}
                            value={formData.purpose}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option value="" disabled hidden></option>
                            <option value="Delivery">Delivery / Courier</option>
                            <option value="Guest">Guest / Friend</option>
                            <option value="Maintenance">Maintenance / Service</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={20} className="select-arrow" />
                        <label className="input-label">Visit Purpose</label>
                        {renderValidationIcon('purpose')}
                    </div>

                    <div
                        className="photo-capture"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {capturedImage ? (
                            <>
                                <img src={capturedImage} alt="Visitor" className="photo-preview" />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Tap to retake photo</span>
                            </>
                        ) : (
                            <>
                                <Camera size={32} color="var(--color-primary-light)" />
                                <div>
                                    <h4 style={{ color: 'var(--color-text)', marginBottom: '0.25rem' }}>Visitor Photo (Optional)</h4>
                                    <span style={{ fontSize: '0.825rem' }}>Tap here to capture or upload photo</span>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handlePhotoCapture}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`submit-btn ${isSubmitting ? 'loading' : ''} ${submitSuccess ? 'success' : ''}`}
                        disabled={isSubmitting || submitSuccess}
                    >
                        {submitSuccess ? (
                            <>Verified & Sent <CheckCircle2 size={24} /></>
                        ) : isSubmitting ? (
                            <>Processing Request <Loader2 size={24} className="spinner" /></>
                        ) : (
                            <>Send Entry Request <Send size={24} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
