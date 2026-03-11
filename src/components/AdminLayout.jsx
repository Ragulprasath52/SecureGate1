import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import '../styles/dashboard.css';

export default function AdminLayout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="admin-layout">
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                setCollapsed={setIsSidebarCollapsed}
                setMobileOpen={setMobileMenuOpen}
            />

            <div className="main-wrapper">
                <AdminTopNav
                    toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                />

                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
