import React from 'react';

export default function PriorityBadge({ priority }) {
  const styles = {
    routine: 'bg-slate-100 text-slate-700 border-slate-200',
    'follow-up': 'bg-blue-50 text-blue-700 border-blue-200',
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  
  const appliedStyle = styles[priority?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border `}>
      {priority}
    </span>
  );
}