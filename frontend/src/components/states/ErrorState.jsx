import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import RetryButton from './RetryButton';

export default function ErrorState({
  message = 'An error occurred while loading this page.',
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-rose-500/5 dark:bg-rose-950/10 border border-rose-500/20 dark:border-rose-500/10 rounded-3xl max-w-2xl mx-auto shadow-xl animate-fadeIn">
      {/* Warning Icon wrapper */}
      <div className="w-20 h-20 mb-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 text-3xl">
        <FaExclamationTriangle className="animate-pulse" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Failed</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
        {message || 'Unable to connect to the server. Please check your connection and try again.'}
      </p>

      {onRetry && (
        <RetryButton onRetry={onRetry} isRetrying={isRetrying} />
      )}
    </div>
  );
}
