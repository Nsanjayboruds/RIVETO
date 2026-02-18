import React, { useContext, useState, useRef, useEffect } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Card from './Card';
import Title from './Title';
import mobvid from '../assets/4 Mobile.mp4';
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import gsap from 'gsap';

function LatestCollection() {
  const { product, compareList, toggleCompare } = useContext(shopDataContext);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // Animation on component mount
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.warning('Please select a size before adding to cart.');
      return;
    }
    addtoCart(productData._id, size);
    toast.success(`${productData.name} added to cart!`);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#06080e] py-16 px-4 md:px-7 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-12 z-10 relative">
        <Title text1="TRENDING" text2="STYLES" />
        <p className="text-gray-400 mt-3 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Discover our handpicked selection of the latest and most sought-after mobile devices
        </p>
      </div>

      {/* Product Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 z-10 relative">
        {product && product.length > 0 ? (
          product.slice(0, 8).map((item, index) => (
            <Card
              key={item._id}
              name={item.name}
              image={item.image1}
              id={item._id}
              price={item.price}
              className="transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onCompare={() => toggleCompare(item)}
              isCompared={compareList?.some(p => p._id === item._id)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 border-t-2 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-xl">Loading products...</p>
          </div>
        )}
      </div>

      {/* View More Button */}
      {product && product.length > 8 && (
        <div className="text-center mt-12 z-10 relative">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            View All Products
          </button>
        </div>
      )}

      {/* Video Section with Enhanced Design */}
      <div className="max-w-6xl mx-auto mt-20 md:mt-28 rounded-2xl overflow-hidden shadow-2xl relative z-10">
        <div className="relative rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[600px] object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={mobvid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>

          {/* Video Controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full p-2">
            <button
              onClick={toggleVideoPlayback}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isVideoPlaying ? 'Pause' : 'Play'}
            >
              {isVideoPlaying ? (
                <FaPause className="text-white text-lg" />
              ) : (
                <FaPlay className="text-white text-lg" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <FaCompress className="text-white text-lg" />
              ) : (
                <FaExpand className="text-white text-lg" />
              )}
            </button>
          </div>

          {/* Video Content Text */}
          <div className="absolute bottom-6 left-6 text-white max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Experience Innovation</h3>
            <p className="text-sm md:text-base opacity-90">Discover the future of mobile technology with our latest collection</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl rounded-full -translate-x-1/2"></div>
      <div className="absolute bottom-1/3 right-0 w-40 h-40 bg-gradient-to-l from-purple-500/10 to-pink-500/10 blur-xl rounded-full translate-x-1/2"></div>
    </div>
  );
}

export default LatestCollection;