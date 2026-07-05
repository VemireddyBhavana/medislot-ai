import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientNavbar from '../components/navigation/PatientNavbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <PatientNavbar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MediSlot AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}