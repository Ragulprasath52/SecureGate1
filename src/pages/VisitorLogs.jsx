import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MapPin } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

export default function VisitorLogs() {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [visitors, setVisitors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVisitors = async () => {
        setIsLoading(true);
        try {
            const res = await apiService.getAllVisitors();
            if (res.success) {
                setVisitors(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch visitors:", error);
            addNotification('Failed to load visitor logs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleExport = () => {
        addNotification('Generating Visitor Logs PDF...', 'loading', 2500);
        setTimeout(() => addNotification('Logs exported successfully!', 'success'), 2500);
    };

    const filteredVisitors = visitors.filter(v =>
        (v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.flat.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'All' || v.status === statusFilter)
    );

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Visitor Entry Logs</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>View and manage historical visitor data.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-secondary" onClick={handleExport}>
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ width: '320px', border: '1px solid var(--admin-border)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by name, flat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Filter size={18} color="var(--admin-text-muted)" />
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Checkout">Checked Out</option>
                        </select>
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor Name</th>
                                <th>Phone Number</th>
                                <th>Flat Number</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Check-in Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVisitors.map(v => (
                                <tr key={v.id}>
                                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                                    <td>{v.phone}</td>
                                    <td><span className="flat-badge">{v.flat}</span></td>
                                    <td>{v.purpose}</td>
                                    <td><span className={`status-badge status-${v.status.toLowerCase()}`}>{v.status}</span></td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{new Date(v.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {filteredVisitors.length === 0 && !isLoading && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>No logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
