const EmptyState = ({ 
  title = "No Data Found", 
  description = "There is currently no information available to display here.", 
  actionText, 
  onActionClick 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 dark:bg-gray-850 dark:border-gray-700 min-h-[300px] w-full transition-all">
      {/* Centered Minimalist Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-7 h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 2.25 13.5Z" />
        </svg>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5">
        {description}
      </p>

      {/* Optional Interactive CTA Button */}
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;