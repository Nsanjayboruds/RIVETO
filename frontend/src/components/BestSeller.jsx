import React, { useContext, useEffect, useState, useRef } from 'react';
import Title from './Title';
import Card from './Card';
import { shopDataContext } from '../context/ShopContext';
import { FaFire, FaArrowRight } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function BestSeller() {
  const { product, compareList, toggleCompare } = useContext(shopDataContext);
  const [bestseller, setBestseller] = useState([]);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const filterProduct = product.filter(item => item.bestseller);
    setBestseller(filterProduct.slice(0, 8)); // Show top 8 bestsellers
  }, [product]);

  useEffect(() => {
    // Animation for the section
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Stagger animation for cards
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );
  }, [bestseller]);

  return (
    <section ref={sectionRef} className="w-full py-10 sm:py-14 md:py-20 px-3 sm:px-4 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-12 -right-12 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 sm:-bottom-24 sm:-left-24 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Section Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <FaFire className="text-white text-base sm:text-lg md:text-xl" />
            </div>
            <Title text1="BEST" text2="SELLERS" />
          </div>

          <p className="text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Discover our most loved products — tried, tested, and adored by thousands of customers worldwide.
          </p>

          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-400">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span>Trending now</span>
          </div>
        </div>

        {/* Best Sellers Grid */}
        {bestseller.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {bestseller.map((item, index) => (
              <div
                key={item._id}
                ref={el => cardsRef.current[index] = el}
                className="transform transition-all duration-500 hover:-translate-y-2"
              >
                <Card
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image1}
                  badge="BESTSELLER"
                  badgeColor="from-red-500 to-orange-500"
                  onCompare={() => toggleCompare(item)}
                  isCompared={compareList?.some(p => p._id === item._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12 md:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
              <FaFire className="text-gray-600 text-xl sm:text-2xl md:text-3xl" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-2 sm:mb-4">No bestsellers yet</p>
            <p className="text-gray-500 text-xs sm:text-sm">Our bestsellers will appear here soon</p>
          </div>
        )}

        {/* View All Button */}
        {bestseller.length > 0 && (
          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <button className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-medium hover:from-gray-800 hover:to-gray-700 hover:border-gray-600 hover:shadow-2xl transition-all duration-300 active:scale-95">
              <span>View All Bestsellers</span>
              <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Stats Section */}
        {/* {bestseller.length > 0 && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Units Sold</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">98%</div>
              <div className="text-gray-400 text-sm">Satisfaction Rate</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">4.9/5</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">24H</div>
              <div className="text-gray-400 text-sm">Fast Shipping</div>
            </div>
          </div>
        )} */}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-red-500/10 rounded-full blur-xl"></div>
    </section>
  );
}

export default BestSeller;