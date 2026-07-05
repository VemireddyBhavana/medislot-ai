import React from 'react';

export default function NoShowRiskBadge({ risk }) {
  const styles = {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };
  
  const appliedStyle = styles[risk?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border `}>
      Risk: {risk}
    </span>
  );
}