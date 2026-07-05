import React from 'react';
import clsx from 'clsx';

export default function TextareaInput({ label, id, error, rows = 4, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 `}>
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-y',
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
        )}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}