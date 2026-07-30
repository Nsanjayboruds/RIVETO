import { useContext, useEffect } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from '../components/StateComponents';
import { FaHeart, FaTrash } from 'react-icons/fa';

function Wishlist() {
  const {
    wishlist, fetchWishlist, currency, removeFromWishlist,
    loadingWishlist, wishlistError,
  } = useContext(shopDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeFromWishlist(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] pt-28 px-4 md:px-10">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-rose-500 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Wishlist
        </h1>
      </div>

      {wishlistError ? (
        <ErrorState
          title="Failed to Load Wishlist"
          message={wishlistError}
          onRetry={fetchWishlist}
        />
      ) : loadingWishlist ? (
        <LoadingState
          type="card"
          count={4}
          message="Loading your wishlist..."
        />
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="Your wishlist is empty"
          description="Save products you love so you can find them here later ❤️"
          actionText="Explore Products"
          onAction={() => navigate('/collection')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/productdetail/${item._id}`)}
              className="relative bg-white dark:bg-[#121826] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              {/* REMOVE BUTTON */}
              <button
                onClick={(e) => handleRemove(e, item._id)}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-rose-600 text-white rounded-full z-10 transition-all"
              >
                <FaTrash className="text-sm" />
              </button>

              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={
                    item.image1 ||
                    item.image2 ||
                    item.image3 ||
                    item.image4 ||
                    '/fallback.jpg'
                  }
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/fallback.jpg';
                  }}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[56px]">
                  {item.name}
                </h2>

                <p className="mt-3 text-2xl font-bold text-blue-600">
                  {currency}
                  {item.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/productdetail/${item._id}`);
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-300"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
