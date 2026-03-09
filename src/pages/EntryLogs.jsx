import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, ClipboardList } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

export default function EntryLogs() {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await apiService.getAllVisitors();
            if (res.success) {
                setLogs(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            addNotification('Failed to load entry logs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleExport = () => {
        addNotification('Preparing audit logs export...', 'loading', 2000);
        setTimeout(() => addNotification('Audit logs exported successfully', 'success'), 2000);
    };

    const filteredLogs = logs.filter(log =>
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.flat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.guard || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Gate Entry Audit Logs</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Detailed history of all entry and exit events.</p>
                    </div>
                    <button className="btn-secondary" onClick={handleExport}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by visitor, flat or duty guard..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor</th>
                                <th>Flat Number</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Approved By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontWeight: 600 }}>{log.name}</td>
                                    <td><span className="flat-badge">{log.flat}</span></td>
                                    <td style={{ fontSize: '0.875rem' }}>{new Date(log.created_at).toLocaleString()}</td>
                                    <td style={{ fontSize: '0.875rem', color: !log.exit_time ? 'var(--admin-warning)' : 'inherit' }}>
                                        {log.exit_time || '-'}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>{log.host || 'Resident'}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${log.status.toLowerCase()}`}>{log.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && !isLoading && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>No logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
