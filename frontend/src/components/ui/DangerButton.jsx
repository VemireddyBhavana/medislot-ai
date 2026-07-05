import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DangerButton({ children, className, ...props }) {
  return (
    <button
      className={twMerge(clsx(
        'bg-red-50 text-red-600 font-medium py-2 px-4 rounded-lg border border-red-100 shadow-sm',
        'hover:bg-red-100 hover:border-red-200 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
}