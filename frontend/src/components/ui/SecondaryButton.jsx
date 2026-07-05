import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SecondaryButton({ children, className, ...props }) {
  return (
    <button
      className={twMerge(clsx(
        'bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg shadow-sm',
        'hover:bg-slate-200 hover:text-slate-900 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
}