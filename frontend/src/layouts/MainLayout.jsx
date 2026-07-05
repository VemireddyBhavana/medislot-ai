import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import PatientNavbar from '../components/navigation/PatientNavbar';
import Footer from '../components/layout/Footer';
import Chatbot from '../components/chat/Chatbot';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <PatientNavbar />

      <main className="flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}