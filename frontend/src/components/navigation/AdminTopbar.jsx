import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import clsx from 'clsx';

export default function AdminTopbar({ title = 'Overview', onMenuClick }) {
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
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-50 focus:bg-white transition-all w-64"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
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
    </header>
  );
}