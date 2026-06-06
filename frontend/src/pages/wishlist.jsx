import { useContext, useEffect } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';

function Wishlist() {
  const {
    wishlist,
    fetchWishlist,
    currency,
    removeFromWishlist,
  } = useContext(shopDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
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

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <FaHeart className="text-6xl text-rose-300 mb-6" />

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Save products you love ❤️
          </p>

          <button
            onClick={() => navigate('/collection')}
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
          >
            Explore Products
          </button>
        </div>
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
                  {currency}{item.price}
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