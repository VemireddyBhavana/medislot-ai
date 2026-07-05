import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Shield, User, Laptop, Lock } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.login({
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('adminToken', res.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.admin));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE - Light Blue Background with Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#f4f7fe] flex-col relative px-12 py-10">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-auto z-10">
          <div className="text-blue-600 bg-blue-100 p-1.5 rounded-md">
            <HeartPulse size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-blue-700">MediSlot AI</span>
        </div>
        
        {/* Illustration Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto">
          {/* We use a composed SVG/Icon layout to approximate the illustration */}
          <div className="relative w-full aspect-video flex items-center justify-center mb-10">
            {/* Background elements */}
            <div className="absolute top-4 right-12 w-48 h-56 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
            <div className="absolute bottom-4 left-12 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
            
            {/* Center Shield */}
            <div className="relative z-0 text-blue-500 opacity-90 transform translate-x-12 -translate-y-4">
              <Shield size={180} strokeWidth={1} fill="#dbeafe" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={48} className="text-blue-600 mb-6" />
              </div>
            </div>
            
            {/* Doctor & Laptop */}
            <div className="absolute bottom-4 left-1/4 z-10 flex items-end">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-50 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                  <User size={32} />
                </div>
                <Laptop size={48} className="text-slate-700" />
              </div>
            </div>
          </div>
          
          {/* Text Below Illustration */}
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold text-blue-700 mb-3">Secure Admin Access</h2>
            <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">
              Manage doctors, appointments and clinic operations in one place.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-white">
        <div className="w-full max-w-[420px] mx-auto">
          
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h2>
              <p className="text-sm text-slate-500">Enter your credentials to access admin panel</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                <input 
                  id="email"
                  type="email"
                  placeholder="admin@medislot.ai"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                <input 
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm tracking-widest placeholder:tracking-normal"
                />
              </div>

              <div className="flex items-center justify-between pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      id="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none">
                      <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember Me</span>
                </label>
                
                <Link to="/admin/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors text-sm shadow-sm shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <Link to="/admin/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
