import React from 'react';

export default function LoadingState({
  type = 'spinner',
  message = 'Loading...',
  gridCount = 8,
  listCount = 4,
}) {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 animate-fadeIn">
        {[...Array(gridCount)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#121826] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            {/* Image Placeholder */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            {/* Content */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-6 animate-fadeIn">
        {[...Array(listCount)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#121826] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Info */}
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
              </div>

              {/* Tracker / Action */}
              <div className="space-y-2 py-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-blue-600 border-b-transparent rounded-full animate-spin [animation-direction:reverse] opacity-75"></div>
      </div>
      <p className="text-gray-900 dark:text-white text-lg font-semibold tracking-wide">{message}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Please wait a moment...</p>
    </div>
  );
}
