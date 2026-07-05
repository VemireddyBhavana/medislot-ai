import React from 'react';
import { Sparkles } from 'lucide-react';

export default function RecommendationBadge({ text = 'Recommended' }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 shadow-sm animate-pulse">
      <Sparkles size={12} className="text-purple-600" />
      {text}
    </span>
  );
}