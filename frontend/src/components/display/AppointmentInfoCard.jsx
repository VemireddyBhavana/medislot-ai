import React from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import CardWrapper from '../layout/CardWrapper';
import AppointmentStatusBadge from '../ui/AppointmentStatusBadge';

export default function AppointmentInfoCard({ appointment, onAction, actionLabel }) {
  return (
    <CardWrapper className="hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            {appointment?.patientName || 'Patient Name'}
          </h4>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <Phone size={14} className="text-gray-400" />
            {appointment?.patientPhone || 'No Phone'}
          </p>
        </div>
        <AppointmentStatusBadge status={appointment?.status || 'booked'} />
      </div>
      
      <div className="flex gap-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          {appointment?.date || 'Date'}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          {appointment?.time || 'Time'}
        </div>
      </div>
      
      {onAction && actionLabel && (
        <button 
          onClick={() => onAction(appointment)}
          className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </CardWrapper>
  );
}