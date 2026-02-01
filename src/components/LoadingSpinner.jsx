import React from 'react';

const LoadingSpinner = ({ size = "small" }) => {
  const dimensions = size === "small" ? "w-6 h-6" : "w-12 h-12";
  
  return (
    <div className={`flex items-center justify-center ${dimensions}`}>
      <div className="relative w-full h-full">
        {/* Outer Pulsing Glow */}
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md animate-pulse" />
        
        {/* The Fast Spinner */}
        <div className="absolute inset-0 border-t-2 border-r-2 border-transparent border-t-violet-400 border-r-violet-400 rounded-full animate-spin" 
             style={{ animationDuration: '0.6s' }} />
             
        {/* Inner Static Ring for Depth */}
        <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
      </div>
    </div>
  );
};

export default LoadingSpinner;