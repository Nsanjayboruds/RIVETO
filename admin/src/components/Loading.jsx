import React from 'react'

function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent rounded-full border-t-blue-500 animate-spin"></div>
        </div>
        
        {/* Loading text with animation */}
        <div className="flex justify-center space-x-1">
          <span className="text-gray-700 font-medium">Loading</span>
          <div className="flex space-x-1">
            <span className="animate-bounce text-blue-500 delay-100">.</span>
            <span className="animate-bounce text-blue-600 delay-300">.</span>
            <span className="animate-bounce text-blue-700 delay-500">.</span>
          </div>
        </div>
        
        {/* Optional: Subtle message */}
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}

export default Loading