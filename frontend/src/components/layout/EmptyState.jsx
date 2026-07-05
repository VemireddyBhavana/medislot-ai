import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = 'There is nothing to display here right now.', icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}