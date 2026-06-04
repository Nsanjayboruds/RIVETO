import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaBox, FaSearch, FaShoppingBasket } from 'react-icons/fa';
import { RiShoppingBag3Line } from 'react-icons/ri';

export default function EmptyState({
  icon = 'default',
  title = 'No items found',
  description = 'Looks like there is nothing to display here yet.',
  actionText = 'Start Shopping',
  onAction,
}) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (icon) {
      case 'cart':
        return <RiShoppingBag3Line className="text-4xl text-blue-500 dark:text-cyan-400" />;
      case 'wishlist':
        return <FaHeart className="text-4xl text-rose-500" />;
      case 'orders':
        return <FaBox className="text-4xl text-purple-500 dark:text-purple-400" />;
      case 'search':
        return <FaSearch className="text-4xl text-amber-500 dark:text-amber-400" />;
      default:
        return <FaShoppingBasket className="text-4xl text-gray-500" />;
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/collection');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/80 dark:bg-gray-800/10 border border-gray-200 dark:border-gray-800/60 rounded-3xl backdrop-blur-md max-w-2xl mx-auto shadow-xl animate-fadeIn">
      {/* Icon Wrapper with Premium Glow */}
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-md animate-pulse"></div>
        {getIcon()}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">{description}</p>

      {actionText && (
        <button
          onClick={handleAction}
          className="px-8 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
