import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, Syringe, Pill, PhoneCall } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Stethoscope size={32} className="text-blue-600" />,
      title: "General Checkups",
      description: "Comprehensive physical exams and routine health screenings to keep you in optimal health."
    },
    {
      icon: <Activity size={32} className="text-blue-600" />,
      title: "Specialized Care",
      description: "Expert consultations across various departments including cardiology, neurology, and orthopedics."
    },
    {
      icon: <HeartPulse size={32} className="text-blue-600" />,
      title: "Diagnostic Tests",
      description: "State-of-the-art laboratory and imaging services for accurate and timely diagnoses."
    },
    {
      icon: <PhoneCall size={32} className="text-blue-600" />,
      title: "Telehealth Consultations",
      description: "Connect with top specialists from the comfort of your home through secure video calls."
    },
    {
      icon: <Syringe size={32} className="text-blue-600" />,
      title: "Vaccination Programs",
      description: "Routine immunizations and seasonal vaccines available for both children and adults."
    },
    {
      icon: <Pill size={32} className="text-blue-600" />,
      title: "Pharmacy Services",
      description: "In-house pharmacy ensuring you get your prescribed medications quickly and conveniently."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-blue-50/50 border-b border-blue-100">
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
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-20">
        <PageContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl hover:border-blue-100 group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {/* Clone element to change color on hover if needed, but keeping it simple */}
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(service.icon, { className: 'currentColor' })}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-center">
        <PageContainer>
          <h2 className="text-3xl font-bold text-white mb-4">Need Specialized Care?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Our AI-powered scheduling system ensures you get an appointment with the right specialist at the earliest available slot.</p>
          <a href="/doctors" className="inline-block bg-white text-blue-600 font-bold py-3.5 px-8 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            Book an Appointment Now
          </a>
        </PageContainer>
      </section>

    </div>
  );
}
