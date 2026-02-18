import React, { useContext, useEffect, useState, useRef } from 'react';
import Title from '../components/Title';
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaSearch } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Loader Component
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-cyan-300 border-b-transparent rounded-full animate-spin-reverse"></div>
      </div>
      <p className="text-cyan-200 text-lg font-medium">Loading Best Sellers...</p>
      <p className="text-gray-400 text-sm mt-2">Discovering our most loved items</p>
    </div>
  );
};

// Skeleton Loader for Cards
const CardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 animate-pulse">
      <div className="w-full h-64 bg-gray-700"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

function BestSellers() {
  const { product } = useContext(shopDataContext);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    // Filter best sellers
    const filteredProducts = product.filter((item) => item.bestseller);
    setBestSellers(filteredProducts);

    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [product]);

  useEffect(() => {
    // Animations
    if (!isLoading && bestSellers.length > 0) {
      gsap.fromTo(".bestseller-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [isLoading, bestSellers]);

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 overflow-x-hidden'>
        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8'>

          {/* Products Section */}
          <div className='flex-1' ref={contentRef}>
            {/* Header */}
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 p-6 bg-gray-800/50 rounded-2xl backdrop-blur-md border border-gray-700'>
              <Title text1={"BEST"} text2={"SELLERS"} />
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-8">
                <Loader />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {[...Array(8)].map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : bestSellers.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {bestSellers.map((item) => (
                    <div key={item._id} className='bestseller-item'>
                      <Card
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.image1}
                        showQuickActions={true}
                        badge="BESTSELLER"
                        badgeColor="from-red-500 to-orange-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button (Optional, can be removed if not needed for best sellers) */}
                {/*
                {bestSellers.length > 12 && (
                  <div className='text-center mt-12'>
                    <button className='px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold'>
                      Load More Products
                    </button>
                  </div>
                )}
                */}
              </>
            ) : (
              <div className='text-center py-16 bg-gray-800/30 rounded-2xl'>
                <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center'>
                  <FaSearch className='text-gray-600 text-3xl' />
                </div>
                <h3 className='text-white text-xl font-semibold mb-2'>No best sellers found</h3>
                <p className='text-gray-400 mb-6'>
                  Check back later for our top rated products.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default BestSellers;
