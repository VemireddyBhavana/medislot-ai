import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationAPI } from '../../services/api';

export default function PatientNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 10 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationAPI.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load navbar notifications', err);
    }
  };

  const handleHowItWorksClick = () => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById('how-it-works'); 
    if (el) el.scrollIntoView({ behavior: 'smooth' }); 
    else window.location.href = '/home#how-it-works';
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="text-blue-600 bg-blue-50 p-1.5 rounded-lg">
            <HeartPulse size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-blue-700">MediSlot AI</span>
        </Link>
        
        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/home" className={`text-sm font-bold transition-colors ${isActive('/home') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
          <Link to="/doctors" className={`text-sm font-bold transition-colors ${isActive('/doctors') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Doctors</Link>
          <button onClick={handleHowItWorksClick} className="text-sm font-bold transition-colors text-gray-500 hover:text-gray-900 text-left">How it works</button>
          <Link to="/about" className={`text-sm font-bold transition-colors ${isActive('/about') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>About us</Link>
          <Link to="/services" className={`text-sm font-bold transition-colors ${isActive('/services') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Services</Link>
          <Link to="/contact" className={`text-sm font-bold transition-colors ${isActive('/contact') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Contact</Link>
          <Link to="/appointments" className={`text-sm font-bold transition-colors ${isActive('/appointments') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Appointments</Link>
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 relative" ref={dropdownRef}>
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-300 relative border border-gray-100/80"
              title="Notifications"
            >
              <Bell size={20} />
              {pendingNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>
            
            {/* Dropdown Overlay */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-4 z-50">
                <div className="px-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">System Alerts</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full">
                    {pendingNotifications.length} Active
                  </span>
                </div>
                
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3">
                        <div className="mt-0.5">
                          {notif.type === 'follow_up' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block shrink-0" />
                          ) : notif.type === 'alert' || notif.message?.includes('cancelled') ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block shrink-0" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-800 font-medium leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">
                              {notif.scheduledFor === 'Immediate' || !notif.scheduledFor 
                                ? 'Immediate' 
                                : new Date(notif.scheduledFor).toLocaleDateString()}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              notif.status === 'sent' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {notif.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/hospitals">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm">
              Book Appointment
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button & Mobile Bell */}
        <div className="md:hidden flex items-center gap-3">
          {/* Notification bell on mobile */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 rounded-lg relative border border-gray-100"
            >
              <Bell size={18} />
              {pendingNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50">
                <div className="px-4 pb-2 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-xs">Alerts</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">
                    {pendingNotifications.length}
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2">
                        <div className="mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
                            notif.type === 'follow_up' ? 'bg-purple-500' : notif.message?.includes('cancelled') ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-gray-700 leading-normal">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-gray-400">
                            {notif.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/hospitals" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
            Book
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 z-40"
          >
            <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/home') ? 'text-blue-600' : 'text-gray-700'}`}>Home</Link>
            <Link to="/doctors" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/doctors') ? 'text-blue-600' : 'text-gray-700'}`}>Doctors</Link>
            <button onClick={handleHowItWorksClick} className="text-base font-bold text-gray-700 text-left">How it works</button>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/about') ? 'text-blue-600' : 'text-gray-700'}`}>About us</Link>
            <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/services') ? 'text-blue-600' : 'text-gray-700'}`}>Services</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/contact') ? 'text-blue-600' : 'text-gray-700'}`}>Contact</Link>
            <Link to="/appointments" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-bold ${isActive('/appointments') ? 'text-blue-600' : 'text-gray-700'}`}>Appointments</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
