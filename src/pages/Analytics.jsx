import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle } from 'lucide-react'; // Example icons

const Analytics = () => {
  const { prediction } = useApp();

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mt-12">
      {/* PROS CARD */}
      <div className="bg-zinc-900 p-8 rounded-2xl border-l-4 border-violet-500 shadow-xl">
        <h3 className="text-violet-400 text-2xl font-bold mb-6 flex items-center">
          Positive Signals
        </h3>
        <ul className="space-y-4 text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="text-violet-500">✓</span> Strong Call to Action (CTA)
          </li>
          <li className="flex items-start gap-3">
            <span className="text-violet-500">✓</span> Positive sentiment detected
          </li>
          <li className="flex items-start gap-3">
            <span className="text-violet-500">✓</span> Clear visual hierarchy
          </li>
        </ul>
      </div>

      {/* CONS CARD */}
      <div className="bg-zinc-900 p-8 rounded-2xl border-l-4 border-zinc-700 shadow-xl opacity-80">
        <h3 className="text-zinc-400 text-2xl font-bold mb-6 flex items-center">
          Potential Friction
        </h3>
        <ul className="space-y-4 text-zinc-500">
          <li className="flex items-start gap-3">
            <span>•</span> Low emotional urgency
          </li>
          <li className="flex items-start gap-3">
            <span>•</span> Visual clutter in background
          </li>
          <li className="flex items-start gap-3">
            <span>•</span> Sub-optimal readability
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics