import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';
import Title from '../components/Title';
import LoadingState from '../components/states/LoadingState';
import EmptyState from '../components/states/EmptyState';
import ErrorState from '../components/states/ErrorState';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const {
    product,
    wishlist,
    compareList,
    toggleCompare,
    loadingProducts,
    productError,
    getProducts,
  } = useContext(shopDataContext);

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product && product.length > 0) {
      const filtered = product.filter((item) => wishlist.includes(item._id));
      setWishlistProducts(filtered);
      setIsLoading(false);
    } else if (!loadingProducts) {
      setIsLoading(false);
    }
  }, [product, wishlist, loadingProducts]);

  // Error State
  if (productError) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <ErrorState message={productError} onRetry={() => getProducts()} />
      </div>
    );
  }

  // Loading State
  if (isLoading || (product.length === 0 && loadingProducts)) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28 animate-fadeIn">
        <div className="text-center mb-8">
          <Title text1="MY" text2="WISHLIST" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            Keep track of all the items you love.
          </p>
        </div>
        <LoadingState type="grid" message="Loading wishlist..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 border-t pt-28 min-h-screen animate-fadeIn">
      <div className="text-center mb-10">
        <Title text1="MY" text2="WISHLIST" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          Your curated list of saved items.
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon="wishlist"
          title="Your Wishlist is empty"
          description="Save your favorite items here to view them later."
          actionText="Start Shopping"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {wishlistProducts.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card
                id={item._id}
                image={item.image1}
                name={item.name}
                price={item.price}
                onCompare={() => toggleCompare(item)}
                isCompared={compareList?.some((p) => p._id === item._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
