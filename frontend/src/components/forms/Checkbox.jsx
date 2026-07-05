import React from 'react';

export default function Checkbox({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex items-start gap-2 `}>
      <input
        type="checkbox"
        id={id}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
        {...props}
      />
      <div className="flex flex-col">
        {label && <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>}
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    </div>
  );
}