import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import CardWrapper from '../layout/CardWrapper';
import clsx from 'clsx';

export default function NotificationCard({ title, message, time, type = 'info', isRead = false }) {
  const types = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    warning: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    alert: { icon: Bell, color: 'text-red-500', bg: 'bg-red-50' }
  };
  
  const currentType = types[type] || types.info;
  const Icon = currentType.icon;

  return (
    <CardWrapper className={clsx(
      'flex gap-4 p-4 transition-colors',
      isRead ? 'opacity-70 bg-gray-50/50' : 'bg-white border-l-4 border-l-blue-500'
    )}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 `}>
        <Icon size={20} className={currentType.color} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-semibold `}>{title}</h4>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
      </div>
    </CardWrapper>
  );
}