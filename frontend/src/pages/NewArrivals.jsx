import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';
import Title from '../components/Title';
import { motion } from 'framer-motion';

const NewArrivals = () => {
  const { product, compareList, toggleComparePanel, removeFromCompare, toggleCompare } = useContext(shopDataContext);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product && product.length > 0) {
      // Create a copy and reverse to get newest first
      const sortedProducts = [...product].reverse();
      setNewArrivals(sortedProducts);
      setIsLoading(false);
    } else {
      // If product array is empty, we might be loading or there are no products.
      // Since we don't have an explicit loading state from context, 
      // we'll assume it's loading initially and if it stays empty for a short while, 
      // we could show "No products found". 
      // However, usually context fetches on mount. 
      // Let's just set loading to false if products are still empty after a brief moment
      // or rely on the fact that if products are 0, we show empty state or loader.
      
      // For now, let's keep loading true until products arrive, or use a timeout?
      // Actually, if ShopContext fetches on mount, product will update.
      // If there are genuinely 0 products, this will hang on loading.
      // But typically there are products.
      
       const timer = setTimeout(() => {
         setIsLoading(false);
       }, 2000);
       return () => clearTimeout(timer);
    }
  }, [product]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Title text1="NEW" text2="ARRIVALS" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mb-8">
            Check out the latest additions to our collection.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 border-t pt-16">
        <div className="text-center text-2xl mb-8">
            <Title text1={'NEW'} text2={'ARRIVALS'}/>
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Discover our latest products, freshly added to our inventory.
            </p>
        </div>

        {newArrivals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No new arrivals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {newArrivals.map((item, index) => (
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
                    isCompared={compareList?.some(p => p._id === item._id)}
                  />
                </motion.div>
            ))}
          </div>
        )}
    </div>
  );
};

export default NewArrivals;
