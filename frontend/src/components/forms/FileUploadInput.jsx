import React from 'react';
import clsx from 'clsx';
import { Upload } from 'lucide-react';

export default function FileUploadInput({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 `}>
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          type="file"
          id={id}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          {...props}
        />
        <div className={clsx(
          'w-full flex items-center justify-center gap-2 px-3 py-4 border-2 border-dashed rounded-lg bg-gray-50 text-gray-500 transition-colors',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-100 hover:border-blue-400'
        )}>
          <Upload size={18} />
          <span className="text-sm font-medium">Click to upload or drag and drop</span>
        </div>
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}