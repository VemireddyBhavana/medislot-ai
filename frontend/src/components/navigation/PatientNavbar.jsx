import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationAPI } from '../../services/api';
import gsap from 'gsap';

export default function PatientNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const navRef = useRef(null);
  const activeElementRef = useRef(null);
  const linkRefs = useRef([]);
  const prevIndexRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'How it works', path: '#how-it-works', isButton: true },
    { label: 'About us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
    { label: 'Appointments', path: '/appointments' },
  ];

  const activeIndex = navItems.findIndex(item => !item.isButton && location.pathname === item.path);

  useEffect(() => {
    if (activeIndex === -1) return;

    const activeBtn = linkRefs.current[activeIndex];
    const activeIndicator = activeElementRef.current;
    const navContainer = navRef.current;

    if (!activeBtn || !activeIndicator || !navContainer) return;

    const getOffsetLeft = (element) => {
      const elementRect = element.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      return (
        elementRect.left -
        navRect.left +
        (elementRect.width - activeIndicator.offsetWidth) / 2
      );
    };

    const x = getOffsetLeft(activeBtn);

    if (prevIndexRef.current === null) {
      gsap.set(activeIndicator, {
        x: x,
        "--active-element-show": 1,
      });
      prevIndexRef.current = activeIndex;
      return;
    }

    const prevIndex = prevIndexRef.current;
    if (prevIndex === activeIndex) return;

    const prevBtn = linkRefs.current[prevIndex];
    if (!prevBtn) {
      gsap.set(activeIndicator, {
        x: x,
        "--active-element-show": 1,
      });
      prevIndexRef.current = activeIndex;
      return;
    }

    const direction = activeIndex > prevIndex ? "after" : "before";
    const oldX = getOffsetLeft(prevBtn);
    const spacing = Math.abs(x - oldX);

    navContainer.classList.add(direction);

    gsap.set(activeIndicator, {
      rotateY: direction === "before" ? "180deg" : "0deg",
    });

    const maxSpacing = navContainer.offsetWidth - 60;
    const targetWidth = spacing > maxSpacing ? maxSpacing : spacing;

    gsap.killTweensOf(activeIndicator);

    gsap.to(activeIndicator, {
      keyframes: [
        {
          "--active-element-width": `${targetWidth}px`,
          duration: 0.3,
          ease: "none",
          onStart: () => {
            createSVG(activeIndicator);
            gsap.to(activeIndicator, {
              "--active-element-opacity": 1,
              duration: 0.1,
            });
          },
        },
        {
          "--active-element-scale-x": "0",
          "--active-element-scale-y": ".25",
          "--active-element-width": "0px",
          duration: 0.3,
          onStart: () => {
            gsap.to(activeIndicator, {
              "--active-element-mask-position": "40%",
              duration: 0.5,
            });
            gsap.to(activeIndicator, {
              "--active-element-opacity": 0,
              delay: 0.45,
              duration: 0.25,
            });
          },
          onComplete: () => {
            activeIndicator.innerHTML = "";
            navContainer.classList.remove("before", "after");
            activeIndicator.removeAttribute("style");
            gsap.set(activeIndicator, {
              x: x,
              "--active-element-show": "1",
            });
          },
        },
      ],
    });

    gsap.to(activeIndicator, {
      x: x,
      "--active-element-strike-x": "-50%",
      duration: 0.6,
      ease: "none",
    });

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  const createSVG = (element) => {
    element.innerHTML = `
      <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam">
        <path d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z" fill="url(#gradient-beam)"/>
        <defs>
          <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2563eb"/>
            <stop offset="1" stop-color="#60a5fa" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="strike">
        <svg viewBox="0 0 114 12" preserveAspectRatio="none">
          <g fill="none" stroke="currentColor" stroke-width="0.75" stroke-linecap="round">
            <path d="M113.5 6.5L109.068 8.9621C109.023 8.98721 108.974 9.00516 108.923 9.01531L106.889 9.42219C106.661 9.46776 106.432 9.35034 106.336 9.1388L104.045 4.0986C104.015 4.03362 104 3.96307 104 3.8917V2.12268C104 1.6898 103.487 1.46145 103.166 1.75103L99.2887 5.24019C99.1188 5.39305 98.867 5.41132 98.6768 5.28457L95.0699 2.87996C94.7881 2.69205 94.4049 2.83291 94.3118 3.15862L92.6148 9.09827C92.5483 9.33084 92.3249 9.48249 92.0843 9.45843L87.7087 9.02087C87.5752 9.00752 87.4419 9.04839 87.3389 9.13428L84.9485 11.1263C84.7128 11.3227 84.3575 11.2625 84.1996 10.9994L81.7602 6.93359C81.617 6.69492 81.3064 6.61913 81.0694 6.76501L75.3165 10.3052C75.1286 10.4209 74.8871 10.3997 74.7223 10.2531L70.6678 6.64917C70.5611 6.55429 70.5 6.41829 70.5 6.27547V1.20711C70.5 1.0745 70.4473 0.947322 70.3536 0.853553L70.2185 0.718508C70.0846 0.584592 69.8865 0.537831 69.7068 0.59772L69.2675 0.744166C68.9149 0.861705 68.8092 1.30924 69.0721 1.57206L69.605 2.10499C69.8157 2.31571 69.7965 2.66281 69.5638 2.84897L67.5 4.5L65.2715 6.28282C65.1083 6.41338 64.8811 6.42866 64.7019 6.32113L60.3621 3.71725C60.153 3.59179 59.8839 3.63546 59.7252 3.8206L57.0401 6.95327C57.0135 6.9843 56.9908 7.01849 56.9725 7.05505L55.2533 10.4934C55.1188 10.7624 54.779 10.8526 54.5287 10.6858L50.7686 8.17907C50.6051 8.07006 50.3929 8.06694 50.2263 8.17109L46.7094 10.3691C46.5774 10.4516 46.4145 10.468 46.2688 10.4133L42.6586 9.05949C42.5558 9.02091 42.4684 8.94951 42.4102 8.85633L40.1248 5.1997C40.0458 5.07323 40.0273 4.91808 40.0745 4.77659L40.6374 3.08777C40.7755 2.67359 40.3536 2.29381 39.9562 2.47447L35.5 4.5L32.2657 5.88613C32.1013 5.95658 31.9118 5.93386 31.7687 5.82656L30.1904 4.64279C30.0699 4.55245 29.9152 4.5212 29.7691 4.55772L26.2009 5.44977C26.0723 5.48193 25.9617 5.56388 25.8934 5.67759L23.1949 10.1752C23.0796 10.3673 22.8507 10.4593 22.6346 10.4003L17.6887 9.05148C17.5674 9.01838 17.463 8.94076 17.3963 8.83409L15.3331 5.53299C15.1627 5.26032 14.7829 5.21707 14.5556 5.44443L12.1464 7.85355C12.0527 7.94732 11.9255 8 11.7929 8H8.15139C8.05268 8 7.95617 7.97078 7.87404 7.91603L3.74143 5.16095C3.59214 5.06142 3.40096 5.04952 3.24047 5.12976L0.5 6.5" />
            <path d="M113.5 6.5L109.068 8.9621C109.023 8.98721 108.974 9.00516 108.923 9.01531L106.889 9.42219C106.661 9.46776 106.432 9.35034 106.336 9.1388L104.045 4.0986C104.015 4.03362 104 3.96307 104 3.8917V2.12268C104 1.6898 103.487 1.46145 103.166 1.75103L99.2887 5.24019C99.1188 5.39305 98.867 5.41132 98.6768 5.28457L95.0699 2.87996C94.7881 2.69205 94.4049 2.83291 94.3118 3.15862L92.6148 9.09827C92.5483 9.33084 92.3249 9.48249 92.0843 9.45843L87.7087 9.02087C87.5752 9.00752 87.4419 9.04839 87.3389 9.13428L84.9485 11.1263C84.7128 11.3227 84.3575 11.2625 84.1996 10.9994L81.7602 6.93359C81.617 6.69492 81.3064 6.61913 81.0694 6.76501L75.3165 10.3052C75.1286 10.4209 74.8871 10.3997 74.7223 10.2531L70.6678 6.64917C70.5611 6.55429 70.5 6.41829 70.5 6.27547V1.20711C70.5 1.0745 70.4473 0.947322 70.3536 0.853553L70.2185 0.718508C70.0846 0.584592 69.8865 0.537831 69.7068 0.59772L69.2675 0.744166C68.9149 0.861705 68.8092 1.30924 69.0721 1.57206L69.605 2.10499C69.8157 2.31571 69.7965 2.66281 69.5638 2.84897L67.5 4.5L65.2715 6.28282C65.1083 6.41338 64.8811 6.42866 64.7019 6.32113L60.3621 3.71725C60.153 3.59179 59.8839 3.63546 59.7252 3.8206L57.0401 6.95327C57.0135 6.9843 56.9908 7.01849 56.9725 7.05505L55.2533 10.4934C55.1188 10.7624 54.779 10.8526 54.5287 10.6858L50.7686 8.17907C50.6051 8.07006 50.3929 8.06694 50.2263 8.17109L46.7094 10.3691C46.5774 10.4516 46.4145 10.468 46.2688 10.4133L42.6586 9.05949C42.5558 9.02091 42.4684 8.94951 42.4102 8.85633L40.1248 5.1997C40.0458 5.07323 40.0273 4.91808 40.0745 4.77659L40.6374 3.08777C40.7755 2.67359 40.3536 2.29381 39.9562 2.47447L35.5 4.5L32.2657 5.88613C32.1013 5.95658 31.9118 5.93386 31.7687 5.82656L30.1904 4.64279C30.0699 4.55245 29.9152 4.5212 29.7691 4.55772L26.2009 5.44977C26.0723 5.48193 25.9617 5.56388 25.8934 5.67759L23.1949 10.1752C23.0796 10.3673 22.8507 10.4593 22.6346 10.4003L17.6887 9.05148C17.5674 9.01838 17.463 8.94076 17.3963 8.83409L15.3331 5.53299C15.1627 5.26032 14.7829 5.21707 14.5556 5.44443L12.1464 7.85355C12.0527 7.94732 11.9255 8 11.7929 8H8.15139C8.05268 8 7.95617 7.97078 7.87404 7.91603L3.74143 5.16095C3.59214 5.06142 3.40096 5.04952 3.24047 5.12976L0.5 6.5" />
          </g>
        </svg>
      </div>
    `;
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
        <nav ref={navRef} className="hidden md:flex items-center space-x-6 lg:space-x-8 relative pb-2 -mb-2">
          {navItems.map((item, index) => {
            if (item.isButton) {
              return (
                <button
                  key={item.label}
                  ref={el => { linkRefs.current[index] = el; }}
                  onClick={handleHowItWorksClick}
                  className="text-sm font-bold transition-colors text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white text-left cursor-pointer"
                >
                  {item.label}
                </button>
              );
            }
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                ref={el => { linkRefs.current[index] = el; }}
                className={`text-sm font-bold transition-colors ${
                  active 
                    ? 'text-blue-600 dark:text-blue-400 font-extrabold active' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="active-element" ref={activeElementRef} />
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

          {/* Theme Toggle Switch */}
          <label className="switch cursor-pointer shrink-0" title="Toggle Theme">
            <input 
              type="checkbox" 
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            <span className="slider">
              <div className="moons-hole">
                <div className="moon-hole"></div>
                <div className="moon-hole"></div>
                <div className="moon-hole"></div>
              </div>
              <div className="black-clouds">
                <div className="black-cloud"></div>
                <div className="black-cloud"></div>
                <div className="black-cloud"></div>
              </div>
              <div className="clouds">
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
                <div className="cloud"></div>
              </div>
              <div className="stars">
                <svg className="star" viewBox="0 0 20 20">
                  <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                </svg>
                <svg className="star" viewBox="0 0 20 20">
                  <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                </svg>
                <svg className="star" viewBox="0 0 20 20">
                  <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                </svg>
                <svg className="star" viewBox="0 0 20 20">
                  <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                </svg>
                <svg className="star" viewBox="0 0 20 20">
                  <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                </svg>
              </div>
            </span>
          </label>
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
            
            {/* Mobile Theme Toggle Switch */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-base font-bold text-gray-700">Light / Dark Theme</span>
              <label className="switch cursor-pointer scale-90 origin-right">
                <input 
                  type="checkbox" 
                  checked={theme === 'light'}
                  onChange={toggleTheme}
                />
                <span className="slider">
                  <div className="moons-hole">
                    <div className="moon-hole"></div>
                    <div className="moon-hole"></div>
                    <div className="moon-hole"></div>
                  </div>
                  <div className="black-clouds">
                    <div className="black-cloud"></div>
                    <div className="black-cloud"></div>
                    <div className="black-cloud"></div>
                  </div>
                  <div className="clouds">
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                  </div>
                  <div className="stars">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                  </div>
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
