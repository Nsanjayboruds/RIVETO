import { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';

const BestSellers = () => {
  const { product, compareList, toggleCompare, productError, loadingProducts, getProducts } = useContext(shopDataContext);
  const [bestsellers, setBestsellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product && product.length > 0) {
      // Filter products that are marked as bestseller
      const filteredProducts = product.filter((item) => item.bestseller);
      setBestsellers(filteredProducts);
      setIsLoading(false);
    } else if (!loadingProducts) {
      setIsLoading(false);
    }
  }, [product, loadingProducts]);

  // Error state
  if (productError) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24">
        <ErrorState message={productError} onRetry={() => getProducts()} />
      </div>
    );
  }

  // Loading skeleton
  if (isLoading || (product.length === 0 && loadingProducts)) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24 animate-fadeIn">
        <div className="text-center mb-8">
          <Title text1="BEST" text2="SELLERS" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Check out our most popular products.
          </p>
        </div>
        <LoadingState type="grid" message="Loading Bestsellers..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 border-t pt-16">
      <div className="text-center text-2xl mb-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our most popular products, loved by customers worldwide.
        </p>
      </div>

      {bestsellers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No bestsellers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestsellers.map((item, index) => (
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
};

export default BestSellers;
