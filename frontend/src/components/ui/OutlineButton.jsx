import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function OutlineButton({ children, className, ...props }) {
  return (
    <button
      className={twMerge(clsx(
        'bg-transparent text-blue-600 font-semibold py-2 px-5 rounded-xl shadow-sm',
        'border-2 border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
}