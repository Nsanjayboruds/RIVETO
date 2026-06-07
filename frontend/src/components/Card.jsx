import { useContext, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';

import { toast } from 'react-toastify';
import gsap from 'gsap';
import { FaCheck, FaExchangeAlt, FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

function Card({
  name,
  image,
  id,
  price,
  showQuickActions = true,
  badge,
  badgeColor = 'from-blue-500 to-cyan-500',
  onCompare,
  isCompared,
  isFeatured = false,
}) {
  const {
    currency,
    addToWishlist,
    removeFromWishlist,
    wishlist,
  } = useContext(shopDataContext);

  const navigate = useNavigate();

  const isWishlisted =
    wishlist?.some((item) => item._id === id) || false;

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, _setIsAddingToCart] = useState(false);

  const cardRef = useRef(null);

  // Removed 3D tilt effect for corporate stability
  const handleMouseMove = (_e) => {
    // No transform changes - stability over motion
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // No transform changes - stability over motion
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // No transform changes - stability over motion
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Show warning and navigate to product detail where size selection is required
    toast.warning('Please select a size before adding to cart', {
      position: 'top-center',
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    // Navigate to product detail page for proper size selection
    navigate(`/productdetail/${id}`);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();

    gsap.to(e.currentTarget, {
      scale: 1.5,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)',
    });

    const exists = wishlist?.some((item) => item._id === id);

    if (exists) {
      removeFromWishlist(id);

      toast.info('Removed from wishlist');
    } else {
      addToWishlist(id);

      toast.success('Added to wishlist! 💖', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCompare = (e) => {
    e.stopPropagation();

    if (onCompare) {
      // Compare button animation
      gsap.to(e.currentTarget, {
        scale: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(2)',
      });

      onCompare();
      // Toast notifications are handled in ShopContext to avoid duplicates
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/productdetail/${id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/productdetail/${id}`);
    }
  };

  // Generate stable random values based on product id
  const { rating, reviewCount, discountPercent, dispatchHours } =
    useMemo(() => {
      // Use id as seed for deterministic random values
      const seed =
        typeof id === 'string'
          ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : id;

      const pseudoRandom = (offset) =>
        ((seed * 9301 + offset * 49297) % 233280) / 233280;
      return {
        rating: (pseudoRandom(1) * 1.5 + 3.5).toFixed(1),
        reviewCount: Math.floor(pseudoRandom(2) * 150) + 45,
        discountPercent: Math.floor(pseudoRandom(3) * 30) + 10,
        dispatchHours: [24, 48, 12][Math.floor(pseudoRandom(4) * 3)],
      };
    }, [id]);
  const originalPrice = (price * (1 + discountPercent / 100)).toFixed(0);
  const savingsAmount = (originalPrice - price).toFixed(0);

  return (
    <article
      ref={cardRef}
      className={`relative bg-white dark:bg-[#121826] rounded-2xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-[#2563EB]/50 ${
        isFeatured ? 'sm:col-span-2 sm:row-span-1' : ''
      }`}
      onClick={() => navigate(`/productdetail/${id}`)}
      onKeyDown={handleCardKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      aria-label={`${name}, ${currency}${price.toLocaleString()}. Press Enter to view details.`}
    >
      {/* Removed dynamic glow effect for commerce stability */}

      {/* Animated Border Gradient - Removed for commerce stability */}

      {/* Image Container with Interaction Zone */}
      <div className="relative overflow-hidden">
        {/* Badge - e.g., BESTSELLER */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <div
              className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badgeColor} text-white text-xs font-bold shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform duration-200`}
            >
              {badge}
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div
            className={`w-full bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse ${
              isFeatured ? 'h-80' : 'h-64'
            }`}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        )}

        <img
          src={imageError ? '/fallback.jpg' : image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.target.src = '/fallback.jpg';
          }}
          className={`w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            isFeatured ? 'h-80' : 'h-64'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Layer 1: Quick View CTA (Evaluation) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={handleQuickView}
            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105"
            style={{ fontFamily: 'Inter, sans-serif' }}
            aria-label={`Quick view ${name}`}
          >
            Quick View
          </button>
        </div>

        {/* Wishlist Icon - Top Right on Hover */}
        {showQuickActions && (
          <button
            type="button"
            onClick={handleAddToWishlist}
            className={`absolute top-4 right-4 w-11 h-11 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border shadow-md
            ${
              isWishlisted
                ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-400'
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:border-rose-400'
            }
                  ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
`}
            aria-label="Add to wishlist"
          >
            <FaHeart
              className={`text-sm transition-colors ${
                isWishlisted
                  ? 'text-rose-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-rose-500'
              }`}
            />
          </button>
        )}

        {/* Compare Icon - Top Left on Hover */}
        {showQuickActions && onCompare && (
          <button
            type="button"
            onClick={handleCompare}
            className={`absolute top-4 left-4 w-11 h-11 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border shadow-md ${
              isCompared
                ? 'bg-[#2563EB] border-[#2563EB] hover:bg-[#1d4ed8]'
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400'
            } ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
            aria-label={
              isCompared
                ? `Remove ${name} from compare`
                : `Add ${name} to compare`
            }
          >
            <FaExchangeAlt
              className={`text-sm transition-colors ${
                isCompared
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
              }`}
            />
          </button>
        )}

        {/* Stock Indicator */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            <span>In Stock</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3 line-clamp-2 transition-colors duration-300 min-h-[3.5rem]">
          {name}
        </h3>

        {/* Trust Strip - Ratings + Reviews + Dispatch */}
        <div className="flex items-center flex-wrap gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-xs" />

            <span className="font-medium text-gray-900 dark:text-white">
              {rating}
            </span>
          </div>

          <span className="text-gray-400">•</span>

          <span className="text-xs">
            {reviewCount} reviews
          </span>

          <span className="text-gray-400">•</span>

         <span className="text-xs font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
  {dispatchHours}h dispatch
</span>
        </div>

        {/* Price Block with Value-Attached Savings */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-gray-900 dark:text-white font-bold text-2xl">
              {currency}
              {price.toLocaleString()}
            </p>

            <p className="text-gray-400 dark:text-gray-500 text-sm line-through">
              {currency}
              {originalPrice}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded-md">
            <span className="text-red-600 dark:text-red-400 text-xs font-semibold">
              Save {currency}
              {savingsAmount}
            </span>
          </div>
        </div>

        {/* Layer 2: Commitment CTA (Secondary Weight) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          aria-label={`Add ${name} to cart`}
          className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm border ${
            isAddingToCart
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:border-[#2563EB] dark:hover:text-[#2563EB]'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {isAddingToCart ? (
            <>
              <FaCheck />
              <span>Added!</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="text-sm" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.3)',
        }}
      />
    </article>
  );
}

export default Card;
