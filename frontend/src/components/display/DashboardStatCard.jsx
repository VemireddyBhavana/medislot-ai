import React from 'react';
import CardWrapper from '../layout/CardWrapper';

export default function DashboardStatCard({ title, value, icon: Icon, trend, trendLabel }) {
  return (
    <CardWrapper className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
        {Icon && <Icon size={24} />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <span className={`text-xs font-medium `}>
              {trend > 0 ? '+' : ''}{trend}% {trendLabel && <span className="text-gray-400 ml-1">{trendLabel}</span>}
            </span>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}