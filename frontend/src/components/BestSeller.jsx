import { useContext, useEffect, useState, useRef } from 'react';

import { shopDataContext } from '../context/ShopContext';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import Card from '../components/Card';

gsap.registerPlugin(ScrollTrigger);

function BestSeller() {
  const { product, compareList, toggleCompare } = useContext(shopDataContext);
  const [bestseller, setBestseller] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const filterProduct = product.filter((item) => item.bestseller);
    setBestseller(filterProduct.slice(0, 8)); // Show top 8 bestsellers
  }, [product]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll navigation functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Update arrow visibility on scroll and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [bestseller]);

  // Auto-scroll functionality
  const handleCardHover = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const card = cardsRef.current[index];
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardRightEdge = cardRect.right;
    const containerRightEdge = containerRect.right;

    // Check if card is near the right edge (within 300px)
    const distanceFromRight = containerRightEdge - cardRightEdge;

    if (distanceFromRight < 300 && distanceFromRight > -100) {
      startAutoScroll();
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll(); // Clear any existing scroll

    const scroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft < maxScroll) {
        container.scrollLeft += 2; // Scroll speed: 2px per frame
        autoScrollRef.current = requestAnimationFrame(scroll);
      }
    };

    autoScrollRef.current = requestAnimationFrame(scroll);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  useEffect(() => {
    // Animation for the section
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Stagger animation for cards
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [bestseller]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 sm:py-14 md:py-20 px-3 sm:px-4 md:px-8 relative overflow-hidden bg-white dark:bg-[#0B0F1A]"
    >
      {/* Section Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header - Left Aligned */}
        <div
          ref={titleRef}
          className="flex items-end justify-between mb-8 sm:mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg">
                <FaFire className="text-white text-lg" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Best Sellers
              </h2>
            </div>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Most loved products — tried, tested, and adored by thousands
            </p>
          </div>

          {/* Inline Text CTA */}
          {bestseller.length > 0 && (
            <button
              onClick={() => (window.location.href = '/collection')}
              className="group flex items-center gap-2 text-[#2563EB] hover:text-[#1d4ed8] font-semibold text-sm md:text-base transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore All
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Carousel */}
        {bestseller.length > 0 ? (
          <div className="relative">
            {/* Left Navigation Arrow */}
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <FaChevronLeft className="text-gray-700 dark:text-gray-300 group-hover:text-[#2563EB] dark:group-hover:text-[#4F8CFF] transition-colors" />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <FaChevronRight className="text-gray-700 dark:text-gray-300 group-hover:text-[#2563EB] dark:group-hover:text-[#4F8CFF] transition-colors" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bestseller.map((item, index) => (
                <div
                  key={item._id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="flex-shrink-0 w-64 sm:w-72 snap-start"
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={stopAutoScroll}
                >
                  <Card
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.image1}
                    badge="BESTSELLER"
                    badgeColor="from-red-500 to-orange-500"
                    onCompare={() => toggleCompare(item)}
                    isCompared={compareList?.some((p) => p._id === item._id)}
                  />
                </div>
              ))}
            </div>

            {/* Trust Strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#121826] rounded-2xl p-6 border border-gray-700/50">
              <div className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-[#4F8CFF] mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  10K+
                </div>
                <div
                  className="text-gray-400 text-xs md:text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Units Sold
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-[#4F8CFF] mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  4.9★
                </div>
                <div
                  className="text-gray-400 text-xs md:text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-[#4F8CFF] mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  24H
                </div>
                <div
                  className="text-gray-400 text-xs md:text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fast Shipping
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-[#4F8CFF] mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  24/7
                </div>
                <div
                  className="text-gray-400 text-xs md:text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Support
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12 md:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
              <FaFire className="text-gray-600 text-xl sm:text-2xl md:text-3xl" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-2 sm:mb-4">
              No bestsellers yet
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Our bestsellers will appear here soon
            </p>
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
