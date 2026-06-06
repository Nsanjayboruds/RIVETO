import React, { useContext, useEffect, useState, useRef } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';
import Title from '../components/Title';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NewArrivals = () => {
  const {
    product,
    compareList,
    _toggleComparePanel,
    _removeFromCompare,
    toggleCompare,
  } = useContext(shopDataContext);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    if (product && product.length > 0) {
      const sortedProducts = [...product].reverse();
      setNewArrivals(sortedProducts);
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [product]);

  useEffect(() => {
    if (!isLoading && newArrivals.length > 0 && gridRef.current) {
      gsap.fromTo(
        '.newarrival-item',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [isLoading, newArrivals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin-reverse"></div>
          </div>
          <p className="text-gray-400">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0a2e1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <Title text1={'NEW'} text2={'ARRIVALS'} />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Discover our latest products, freshly added to our inventory.
          </p>
          <div className="mt-4 w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto"></div>
        </div>

        {newArrivals.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a]/50 backdrop-blur-sm border border-[#1f2a44] rounded-2xl max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#111c33] border border-[#1f2a44] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No new arrivals found.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
            {newArrivals.map((item, index) => (
              <motion.div
                key={item._id}
                className="newarrival-item"
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
    </div>
  );
};

export default NewArrivals;
