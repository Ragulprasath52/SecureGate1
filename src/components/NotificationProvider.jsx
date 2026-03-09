import React, { createContext, useContext, useState, useCallback } from 'react';
import { ShieldCheck, XCircle, Info, Loader2 } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((n) => (
                    <div key={n.id} className={`notification ${n.type}`}>
                        {n.type === 'success' && <ShieldCheck className="text-success-light" />}
                        {n.type === 'error' && <XCircle className="text-error" />}
                        {n.type === 'info' && <Info className="text-primary-light" />}
                        {n.type === 'loading' && <Loader2 className="animate-spin text-primary-light" />}
                        <span>{n.message}</span>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
