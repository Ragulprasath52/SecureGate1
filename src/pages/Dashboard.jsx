import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import { ShieldCheck, Users, Clock, CheckCircle, XCircle, Home, LayoutDashboard, Video } from 'lucide-react';

const sampleData = [
    { id: 1, name: "Rahul Sharma", phone: "+91 9876543210", flat: "A-101", purpose: "Delivery", status: "Approved", time: "10:30 AM" },
    { id: 2, name: "Priya Singh", phone: "+91 8765432109", flat: "B-205", purpose: "Guest", status: "Waiting", time: "11:15 AM" },
    { id: 3, name: "Amit Kumar", phone: "+91 7654321098", flat: "C-302", purpose: "Plumber", status: "Rejected", time: "09:45 AM" },
    { id: 4, name: "Sneha Reddy", phone: "+91 6543210987", flat: "A-404", purpose: "Maid", status: "Approved", time: "08:00 AM" },
    { id: 5, name: "Vikram Patel", phone: "+91 5432109876", flat: "D-105", purpose: "Courier", status: "Approved", time: "07:30 AM" },
    { id: 6, name: "Neha Gupta", phone: "+91 4321098765", flat: "B-306", purpose: "Guest", status: "Waiting", time: "11:45 AM" },
];

function Dashboard() {
    return (
        <div className="admin-container dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <ShieldCheck size={32} />
                    <span>SafeEntry</span>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item active">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/register" className="nav-item">
                        <Home size={20} />
                        <span>Visitor Registration</span>
                    </Link>
                    <Link to="/video-verification" className="nav-item">
                        <Video size={20} />
                        <span>Video Verification</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <h1>SafeEntry – Visitor Management Dashboard</h1>
                        <p>Monitor and manage visitor activity across the premises</p>
                    </div>
                </header>

                <section className="summary-cards">
                    <div className="summary-card">
                        <div className="card-icon primary"><Users size={28} /></div>
                        <div className="card-info">
                            <h3>Total Visitors Today</h3>
                            <p className="card-value">124</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="card-icon warning"><Clock size={28} /></div>
                        <div className="card-info">
                            <h3>Waiting for Approval</h3>
                            <p className="card-value">12</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="card-icon success"><CheckCircle size={28} /></div>
                        <div className="card-info">
                            <h3>Approved Visitors</h3>
                            <p className="card-value">98</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="card-icon error"><XCircle size={28} /></div>
                        <div className="card-info">
                            <h3>Rejected Visitors</h3>
                            <p className="card-value">14</p>
                        </div>
                    </div>
                </section>

                <section className="activity-section">
                    <div className="section-header">
                        <h2>Visitor Activity</h2>
                    </div>
                    <div className="table-container">
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th>Visitor Name</th>
                                    <th>Phone Number</th>
                                    <th>Flat Number</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Entry Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sampleData.map(visitor => (
                                    <tr key={visitor.id}>
                                        <td>
                                            <div className="visitor-name">{visitor.name}</div>
                                        </td>
                                        <td>{visitor.phone}</td>
                                        <td><span className="flat-badge">{visitor.flat}</span></td>
                                        <td>{visitor.purpose}</td>
                                        <td>
                                            <span className={`badge badge-${visitor.status.toLowerCase() === 'waiting' ? 'warning' : visitor.status.toLowerCase() === 'approved' ? 'success' : 'error'}`}>
                                                {visitor.status}
                                            </span>
                                        </td>
                                        <td>{visitor.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
