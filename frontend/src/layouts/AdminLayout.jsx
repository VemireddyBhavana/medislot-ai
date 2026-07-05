import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/navigation/AdminSidebar';
import AdminTopbar from '../components/navigation/AdminTopbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  const getPageTitle = () => {
    if (location.pathname.includes('dashboard')) return 'Dashboard Overview';
    if (location.pathname.includes('appointments')) return 'Manage Appointments';
    if (location.pathname.includes('add-doctor')) return 'Add New Doctor';
    if (location.pathname.includes('notifications')) return 'Notifications';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar title={getPageTitle()} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}