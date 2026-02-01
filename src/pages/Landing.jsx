import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#08070b] text-white px-4">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
      CTR Predictor <span className="text-violet-400">&</span> Ad Analyzer
    </h1>
    <p className="text-zinc-400 text-lg max-w-xl text-center mb-10">
      Analyze your text and image ads to predict Click-Through Rate (CTR).
    </p>
    <Link
      to="/dashboard"
      className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-900/30"
    >
      Get Started
    </Link>
  </div>
);

export default Landing;
