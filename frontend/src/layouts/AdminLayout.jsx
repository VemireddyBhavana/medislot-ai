import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen flex bg-slate-50 overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile/Tablet Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900"
            />
            {/* Sidebar content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-50 flex flex-col w-64 h-full bg-slate-900 text-white shadow-2xl"
            >
              <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar title={getPageTitle()} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}