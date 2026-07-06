import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
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
        staggerChildren: 0.15
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
      
      {/* Header */}
      <motion.section variants={fadeInUp} className="relative pt-16 pb-12 bg-slate-50/50 border-b border-slate-100">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Contact <span className="text-blue-600">Us</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              We're here to help. Get in touch with our team for any inquiries, support, or feedback.
            </p>
          </div>
        </PageContainer>
      </motion.section>

      {/* Main Content */}
      <motion.section variants={fadeInUp} className="py-16 relative z-20">
        <PageContainer>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Our Location</h4>
                    <p className="text-slate-500 leading-relaxed">
                      123 Healthcare Avenue, Medical District,<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Phone Number</h4>
                    <p className="text-slate-500 leading-relaxed">+91 98765 43210</p>
                    <p className="text-slate-500 leading-relaxed">1-800-MEDISLOT (Toll-Free)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Email Address</h4>
                    <p className="text-slate-500 leading-relaxed">support@medislotai.com</p>
                    <p className="text-slate-500 leading-relaxed">info@medislotai.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Working Hours</h4>
                    <p className="text-slate-500 leading-relaxed">Mon - Fri: 8:00 AM - 8:00 PM</p>
                    <p className="text-slate-500 leading-relaxed">Sat - Sun: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input type="text" placeholder="How can we help you?" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows="4" placeholder="Your message here..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm mt-2">
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </PageContainer>
      </motion.section>

    </motion.div>
  );
}
