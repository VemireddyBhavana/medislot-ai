import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, Syringe, Pill, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services() {
  const services = [
    {
      icon: Stethoscope,
      title: "General Checkups",
      description: "Comprehensive physical exams and routine health screenings to keep you in optimal health."
    },
    {
      icon: Activity,
      title: "Specialized Care",
      description: "Expert consultations across various departments including cardiology, neurology, and orthopedics."
    },
    {
      icon: HeartPulse,
      title: "Diagnostic Tests",
      description: "State-of-the-art laboratory and imaging services for accurate and timely diagnoses."
    },
    {
      icon: PhoneCall,
      title: "Telehealth Consultations",
      description: "Connect with top specialists from the comfort of your home through secure video calls."
    },
    {
      icon: Syringe,
      title: "Vaccination Programs",
      description: "Routine immunizations and seasonal vaccines available for both children and adults."
    },
    {
      icon: Pill,
      title: "Pharmacy Services",
      description: "In-house pharmacy ensuring you get your prescribed medications quickly and conveniently."
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col min-h-screen bg-white font-sans"
    >
      
      {/* Hero Section */}
      <motion.section variants={fadeInUp} className="relative pt-16 pb-20 bg-blue-50/50 border-b border-blue-100">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Our <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              We offer a wide range of healthcare services designed to meet all your medical needs under one roof. Book an appointment today and experience world-class care.
            </p>
          </div>
        </PageContainer>
      </motion.section>

      {/* Services Grid */}
      <motion.section variants={fadeInUp} className="py-20 relative z-20">
        <PageContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl hover:border-blue-100 group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <service.icon size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </motion.section>

      {/* CTA Section */}
      <motion.section variants={fadeInUp} className="py-16 bg-blue-600 text-center">
        <PageContainer>
          <h2 className="text-3xl font-bold text-white mb-4">Need Specialized Care?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Our AI-powered scheduling system ensures you get an appointment with the right specialist at the earliest available slot.</p>
          <a href="/doctors" className="inline-block bg-white text-blue-600 font-bold py-3.5 px-8 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            Book an Appointment Now
          </a>
        </PageContainer>
      </motion.section>

    </motion.div>
  );
}
