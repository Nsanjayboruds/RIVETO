import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default function RetryButton({ onRetry, label = 'Try Again', isRetrying = false }) {
  return (
    <button
      onClick={onRetry}
      disabled={isRetrying}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
    >
      <FiRefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`} />
      <span>{isRetrying ? 'Retrying...' : label}</span>
    </button>
  );
}
