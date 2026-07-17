import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { notificationAPI } from '../../services/api';

export default function AdminTopbar({ title = 'Overview', onMenuClick, search = '', onSearchChange = () => {} }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const lastSpeechTimeRef = useRef(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll every 3 seconds for completely real-time emergency updates
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

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

      // Look for any pending SOS emergency alerts
      const pendingSos = data.find(n => 
        n.type === 'alert' && 
        n.status === 'pending' && 
        n.message && 
        n.message.includes('EMERGENCY SOS')
      );
      
      if (pendingSos) {
        setActiveEmergency(pendingSos);
        
        // Trigger voice alarm only once every 8 seconds
        const now = Date.now();
        if (now - lastSpeechTimeRef.current > 8000) {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Warning. Critical SOS emergency request received. Please check dashboard immediately.");
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          }
          lastSpeechTimeRef.current = now;
        }
      } else {
        setActiveEmergency(null);
      }
    } catch (err) {
      console.error('Failed to load admin topbar notifications', err);
    }
  };

  const handleAcknowledgeSos = async () => {
    if (!activeEmergency) return;
    try {
      await notificationAPI.updateStatus(activeEmergency._id, { status: 'sent' });
      setActiveEmergency(null);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to acknowledge emergency', err);
    }
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={14} className="text-red-500 shrink-0" />;
      case 'follow_up': return <CheckCircle2 size={14} className="text-purple-500 shrink-0" />;
      case 'reminder': return <Clock size={14} className="text-yellow-500 shrink-0" />;
      default: return <Bell size={14} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-blue-600">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-50 focus:bg-white transition-all w-64"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Interactive Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-blue-600 transition-colors relative p-1 rounded-full hover:bg-slate-50"
              title="Notifications"
            >
              <Bell size={22} />
              {pendingNotifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {pendingNotifications.length}
                </span>
              )}
            </button>

            {/* Dropdown Overlay */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Admin Alerts</h3>
                  <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                    {pendingNotifications.length} Pending
                  </span>
                </div>
                
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No system notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3">
                        <div className="mt-0.5">
                          {getTypeIcon(notif.type)}
                        </div>
                        <div className="space-y-1">
                          <p className={clsx(
                            "text-xs font-medium leading-relaxed",
                            notif.status === 'pending' ? "text-slate-800 font-semibold" : "text-slate-500"
                          )}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              {notif.scheduledFor === 'Immediate' || !notif.scheduledFor 
                                ? 'Immediate' 
                                : new Date(notif.scheduledFor).toLocaleDateString()}
                            </span>
                            <span className={clsx(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded",
                              notif.status === 'sent' 
                                ? 'bg-green-50 text-green-600 border border-green-100' 
                                : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                            )}>
                              {notif.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-3 border-t border-slate-100 text-center">
                  <Link 
                    to="/admin/notifications" 
                    onClick={() => setShowDropdown(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              AD
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 leading-none">Admin User</p>
              <p className="text-xs text-gray-500 mt-1">Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Emergency SOS Alert Popup for Admin */}
      <AnimatePresence>
        {activeEmergency && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white border-4 border-red-600 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 text-center space-y-6"
            >
              <div className="flex justify-center text-red-600">
                <AlertTriangle size={64} className="animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-red-700 tracking-tight uppercase">🚨 CRITICAL PATIENT EMERGENCY SOS 🚨</h3>
                <p className="text-xs text-slate-500 font-bold">An immediate ambulance dispatch and specialist consultation is requested!</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-left space-y-3">
                <p className="text-xs font-bold text-red-800 leading-relaxed">
                  {activeEmergency.message}
                </p>
                <div className="pt-2 border-t border-red-200/50 flex flex-col gap-1 text-[11px] text-slate-600">
                  <p>👤 <strong>Patient Name:</strong> {activeEmergency.patientName || 'N/A'}</p>
                  <p>📧 <strong>Email Address:</strong> {activeEmergency.patientEmail || 'N/A'}</p>
                  <p>📞 <strong>Contact Phone:</strong> {activeEmergency.patientPhone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleAcknowledgeSos}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] cursor-pointer"
                >
                  DISPATCH AMBULANCE &amp; ACKNOWLEDGE ALERT
                </button>
                <button 
                  onClick={() => setActiveEmergency(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl transition-all text-xs"
                >
                  Dismiss Temporarily
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}