import React, { useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ThumbsUp, ThumbsDown, TrendingUp, ChevronRight, BarChart3 } from 'lucide-react';

const MAX_CTR_SCALE = 10; // Gauge max (e.g. 10%)
const INDUSTRY_AVG_CTR = 2.5;

const Results = () => {
  const { prediction, setPrediction } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const predictionFromState = location.state?.prediction;

  const effectivePrediction = predictionFromState ?? prediction;

  useEffect(() => {
    if (predictionFromState) setPrediction(predictionFromState);
  }, [predictionFromState, setPrediction]);

  if (!effectivePrediction) return <Navigate to="/dashboard" replace />;

  const ctr = Number(effectivePrediction.ctr) || 0;

  const getStatusColor = (value) => {
    if (value > 5) return { text: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500' };
    if (value > 2) return { text: 'text-violet-400', bg: 'bg-violet-500', border: 'border-violet-500' };
    return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500' };
  };

  const getStatusLabel = (value) => {
    if (value > 5) return 'High CTR Potential';
    if (value > 2) return 'Moderate CTR Potential';
    return 'Low CTR Potential';
  };

  const colors = getStatusColor(ctr);

  // Factor scores for graphical analysis (0–100). Derive from CTR or use API if available.
  const factors = effectivePrediction.factors || [
    { name: 'Clarity & message', score: Math.min(100, (ctr / MAX_CTR_SCALE) * 80 + 10) },
    { name: 'Urgency / CTA', score: Math.min(100, (ctr / MAX_CTR_SCALE) * 70 + 15) },
    { name: 'Relevance to audience', score: Math.min(100, (ctr / MAX_CTR_SCALE) * 75 + 12) },
    { name: 'Visual / copy balance', score: Math.min(100, (ctr / MAX_CTR_SCALE) * 72 + 14) },
  ];

  // Pros and cons: use API if provided, else derive from CTR tier
  const pros = effectivePrediction.pros || (ctr > 5
    ? ['Strong headline and value proposition.', 'Clear call-to-action.', 'Good relevance to target audience.', 'Engaging format.']
    : ctr > 2
      ? ['Decent clarity in messaging.', 'Some urgency elements present.', 'Room to improve with small tweaks.']
      : ['Baseline ad structure is present.', 'Opportunity to test new angles and copy.']);

  const cons = effectivePrediction.cons || (ctr > 5
    ? ['Minor: A/B test more variants to push further.']
    : ctr > 2
      ? ['Headline could be stronger.', 'CTA could be more specific.', 'Limited urgency or scarcity.']
      : ['Weak or generic headline.', 'Unclear or missing CTA.', 'Low perceived relevance or urgency.', 'Copy may be too long or unfocused.']);

  const suggestions = effectivePrediction.suggestions || [
    'Use a clear, benefit-led headline (e.g. save X%, limited time).',
    'Add one strong CTA button or link with action words (Get, Start, Try).',
    'Include urgency: limited time, few spots left, or deadline.',
    'Shorten copy; lead with the main benefit in the first line.',
    'Test different visuals or formats (image vs text) and run A/B tests.',
  ];

  return (
    <div className="min-h-screen bg-[#08070b] text-white relative overflow-x-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <p className="text-zinc-500 uppercase tracking-widest text-xs md:text-sm mb-2">Analysis Complete</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10">
          Your Ad CTR Results
        </h1>

        {/* CTR + Gauge */}
        <section className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-center md:text-left">
              <div className={`text-5xl md:text-6xl font-black mb-2 ${colors.text}`}>
                {ctr}%
              </div>
              <p className={`text-lg font-medium ${colors.text}`}>
                {getStatusLabel(ctr)}
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                Predicted click-through rate
              </p>
            </div>
            {/* Gauge */}
            <div className="flex justify-center md:block">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(Math.min(ctr, MAX_CTR_SCALE) / MAX_CTR_SCALE) * 163.36} 500`}
                    style={{ color: ctr > 5 ? '#4ade80' : ctr > 2 ? '#a78bfa' : '#fbbf24' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-white">{ctr}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Graphical analysis – factor bars */}
        <section className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            Performance breakdown
          </h2>
          <div className="space-y-4">
            {factors.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-400">{f.name}</span>
                  <span className="text-white font-medium">{Math.round(f.score)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-xs mt-4">
            Compared to typical benchmarks (industry avg CTR ~{INDUSTRY_AVG_CTR}%).
          </p>
        </section>

        {/* Pros */}
        <section className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            What’s working
          </h2>
          <ul className="space-y-2">
            {pros.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm md:text-base">
                <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Cons */}
        <section className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <ThumbsDown className="w-5 h-5 text-amber-400" />
            What’s holding CTR back
          </h2>
          <ul className="space-y-2">
            {cons.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm md:text-base">
                <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How to increase CTR */}
        <section className="glass-panel rounded-2xl border border-violet-500/20 p-6 md:p-8 mb-8 md:mb-10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            How to increase your CTR
          </h2>
          <ul className="space-y-3">
            {suggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm md:text-base">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-semibold">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={() => navigate('/analytics')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all"
          >
            View Analytics
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-xl transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
