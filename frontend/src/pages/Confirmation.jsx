import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, User, Stethoscope, Calendar, Clock, Mail, Phone, Info, HelpCircle, ArrowLeft } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import CardWrapper from '../components/layout/CardWrapper';
import PrimaryButton from '../components/ui/PrimaryButton';
import OutlineButton from '../components/ui/OutlineButton';
import AppointmentStatusBadge from '../components/ui/AppointmentStatusBadge';

export default function Confirmation() {
  const location = useLocation();
  const appointmentData = location.state?.appointment;

  const mockAppointment = {
    _id: 'APP-8492-X',
    patientName: 'John Doe',
    patientEmail: 'john@example.com',
    patientPhone: '+1 (555) 123-4567',
    doctorName: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    appointmentDate: '2026-07-10',
    appointmentTime: '10:00',
    status: 'booked'
  };

  const appointment = appointmentData || mockAppointment;

  return (
    <PageContainer className="max-w-4xl py-12">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm border-4 border-white">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Thank you for choosing MediSlot AI. Your appointment has been confirmed and our team is ready to assist you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Column - Appointment Summary */}
        <div className="md:col-span-2 space-y-6">
          <CardWrapper className="border-t-4 border-t-green-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <CheckCircle2 size={120} />
            </div>
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-6 relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Appointment ID</p>
                <p className="font-mono text-gray-900 font-bold">{appointment._id.substring(0, 10).toUpperCase()}</p>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 relative z-10">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><User size={16} /> Patient Name</p>
                <p className="font-semibold text-gray-900">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Stethoscope size={16} /> Doctor</p>
                <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
                <p className="text-xs text-blue-600">{appointment.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Calendar size={16} /> Date</p>
                <p className="font-semibold text-gray-900">{appointment.appointmentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Clock size={16} /> Time</p>
                <p className="font-semibold text-gray-900">{appointment.appointmentTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Mail size={16} /> Email</p>
                <p className="font-semibold text-gray-900 truncate">{appointment.patientEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Phone size={16} /> Phone</p>
                <p className="font-semibold text-gray-900">{appointment.patientPhone}</p>
              </div>
            </div>
          </CardWrapper>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/" className="flex-1">
              <PrimaryButton className="w-full py-3 flex justify-center items-center gap-2">
                <ArrowLeft size={18} /> Back to Home
              </PrimaryButton>
            </Link>
            <Link to="/doctors" className="flex-1">
              <OutlineButton className="w-full py-3 bg-white">
                Book Another Appointment
              </OutlineButton>
            </Link>
          </div>
        </div>

        {/* Sidebar - Helper Cards */}
        <div className="md:col-span-1 space-y-6">
          <CardWrapper className="bg-blue-50/50 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Info className="text-blue-600" size={20} />
              <h3 className="font-bold text-gray-900">What happens next?</h3>
            </div>
            <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <li className="relative flex items-start gap-4">
                <div className="w-4 h-4 mt-1 bg-blue-600 rounded-full flex-shrink-0 z-10 border-2 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Confirmation Sent</p>
                  <p className="text-xs text-gray-600 mt-1">An email with these details has been sent to you.</p>
                </div>
              </li>
              <li className="relative flex items-start gap-4">
                <div className="w-4 h-4 mt-1 bg-blue-400 rounded-full flex-shrink-0 z-10 border-2 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Smart Reminder</p>
                  <p className="text-xs text-gray-600 mt-1">We'll notify you 24 hours before your visit.</p>
                </div>
              </li>
              <li className="relative flex items-start gap-4">
                <div className="w-4 h-4 mt-1 bg-gray-300 rounded-full flex-shrink-0 z-10 border-2 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Arrive Early</p>
                  <p className="text-xs text-gray-600 mt-1">Please arrive 10 minutes early for check-in.</p>
                </div>
              </li>
            </ul>
          </CardWrapper>

          <CardWrapper className="bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="text-slate-500" size={20} />
              <h3 className="font-bold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">If you need to reschedule or cancel your appointment, please contact our support desk.</p>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-gray-500">Call Us:</span>
                <span className="font-medium text-gray-900">1-800-MEDISLOT</span>
              </p>
              <p className="flex justify-between pt-1">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-blue-600">support@medislot.ai</span>
              </p>
            </div>
          </CardWrapper>
        </div>

      </div>
    </PageContainer>
  );
}