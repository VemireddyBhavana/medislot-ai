import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function CardWrapper({ children, className, noPadding = false }) {
  return (
    <div
      className={twMerge(clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100/80',
        'transition-all duration-300 hover:shadow-md', // Added global hover polish
        !noPadding && 'p-6',
        className
      ))}
    >
      {children}
    </div>
  );
}