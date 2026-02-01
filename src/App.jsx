import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

const App = () => (
  /* 1. Main container must be relative and take full height */
  <div className="relative min-h-screen w-full bg-[#08070b]">
    
    {/* 2. Background Layer: Use 'fixed' so it stays behind while scrolling */}
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div className="stars-layer" />
      <div className="stars-layer-2" />
      <div className="stars-layer-3" />
      {/* Subtle overlay to soften the stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-black/40" />
    </div>

    {/* 3. Content Layer: MUST be relative and have a higher z-index (z-10) */}
    <div className="relative z-10">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  </div>
);

export default App;