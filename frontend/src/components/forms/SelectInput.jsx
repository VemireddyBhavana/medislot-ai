import React from 'react';
import clsx from 'clsx';

export default function SelectInput({ label, id, options = [], error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 `}>
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        id={id}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors appearance-none',
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
        )}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}