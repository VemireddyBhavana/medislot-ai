import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
}