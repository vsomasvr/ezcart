import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-10" aria-label="Loading content">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      <p className="mt-4 text-slate-300 text-lg">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
