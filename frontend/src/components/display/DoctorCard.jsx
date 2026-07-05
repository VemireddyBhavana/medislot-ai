import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import CardWrapper from '../layout/CardWrapper';

export default function DoctorCard({ doctor, onBook }) {
  // Use pravatar for placeholder if no actual image URL exists
  const imageUrl = doctor?.image || `https://i.pravatar.cc/150?u=${doctor?._id || 'demo'}`;
  
  return (
    <CardWrapper className="flex flex-row p-4 gap-5 items-stretch border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
      
      {/* Left - Doctor Image */}
      <div className="w-[100px] bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={doctor?.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right - Doctor Details */}
      <div className="flex flex-col flex-1 py-1">
        
        <h3 className="font-bold text-slate-900 text-[15px] mb-0.5 leading-tight">
          {doctor?.name || 'Dr. Doctor Name'}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {doctor?.specialization || doctor?.specialty || 'Specialist'}
        </p>
        
        <div className="text-[11px] text-slate-600 font-medium mb-2">
          {doctor?.experienceYears || '5'}+ Years Exp • ₹{doctor?.fee || '500'}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1.5 font-medium">
          <Calendar size={12} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">
            {doctor?.availableDays?.length 
              ? doctor.availableDays.join(', ')
              : 'Mon, Tue, Wed, Fri'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-4 font-medium">
          <Clock size={12} className="text-blue-500 flex-shrink-0" />
          <span>
            {doctor?.startTime || '10:00 AM'} - {doctor?.endTime || '05:00 PM'}
          </span>
        </div>

        {/* Book Now Button */}
        <div className="mt-auto">
          <button 
            onClick={() => onBook?.(doctor)}
            className="w-24 py-1.5 border border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100 text-xs font-semibold rounded transition-colors"
          >
            Book Now
          </button>
        </div>

      </div>
    </CardWrapper>
  );
}
