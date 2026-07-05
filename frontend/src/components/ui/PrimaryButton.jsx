import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      className={twMerge(clsx(
        'bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow-sm',
        'hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
}