import React from 'react';

export default function AppointmentStatusBadge({ status }) {
  const styles = {
    booked: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    'no-show': 'bg-orange-50 text-orange-700 border-orange-200',
  };
  
  const defaultStyle = 'bg-gray-50 text-gray-700 border-gray-200';
  const appliedStyle = styles[status?.toLowerCase()] || defaultStyle;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border `}>
      {status || 'Unknown'}
    </span>
  );
}