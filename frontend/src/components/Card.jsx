import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaEye, FaHeart, FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Card({ name, image, id, price, showQuickActions = true, badge, badgeColor = "from-blue-500 to-cyan-500" }) {
  const { currency, addtoCart, addToWishlist } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    // Simulate API call delay
    setTimeout(() => {
      addtoCart(id);
      toast.success(`${name} added to cart! 🛒`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsAddingToCart(false);
    }, 500);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    addToWishlist(id);
    toast.success('Added to wishlist! 💖', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/productdetail/${id}`);
  };

  // Generate random rating between 3.5 and 5 for demo purposes
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 100) + 15;
  const discountPercent = Math.floor(Math.random() * 30) + 10;
  const originalPrice = (price * 1.3).toFixed(2);

  return (
    <div
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group border border-gray-700"
      onClick={() => navigate(`/productdetail/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse"></div>
        )}
        
        <img
          src={imageError ? '/fallback.jpg' : image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.target.src = '/fallback.jpg';
          }}
          className={`w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Quick Actions */}
        {showQuickActions && (
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={handleAddToWishlist}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500/30 transition-all duration-300 hover:scale-110 group/wishlist"
              aria-label="Add to wishlist"
            >
              <FaHeart className="text-white text-sm group-hover/wishlist:text-rose-400 transition-colors" />
            </button>
            
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-300 hover:scale-110 group/view"
              aria-label="Quick view"
            >
              <FaEye className="text-white text-sm group-hover/view:text-cyan-400 transition-colors" />
            </button>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
            -{discountPercent}%
          </span>
        </div>

        {/* Custom Badge */}
        {badge && (
          <div className={`absolute top-12 left-4 px-3 py-1 bg-gradient-to-r ${badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}>
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-white text-sm font-medium ml-1">{rating}</span>
          </div>
          <span className="text-gray-400 text-xs">({reviewCount})</span>
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 min-h-[3.5rem]">
          {name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-cyan-400 font-bold text-xl">
            {currency}{price.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm line-through">
            {currency}{originalPrice}
          </p>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/button ${
            isAddingToCart
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:shadow-xl'
          }`}
        >
          {isAddingToCart ? (
            <>
              <FaCheck className="text-white animate-pulse" />
              Added!
            </>
          ) : (
            <>
              <FaShoppingCart className="group-hover/button:scale-110 transition-transform" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>

      {/* Stock Indicator */}
      <div className="absolute bottom-2 right-2">
        <div className="flex items-center gap-1 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>In Stock</span>
        </div>
      </div>
    </div>
  );
}

export default Card;