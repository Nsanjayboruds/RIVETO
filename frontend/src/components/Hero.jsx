import React, { useEffect, useRef } from 'react';
import { FaCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import gsap from 'gsap';

function Hero({ heroData, heroCount, setHeroCount }) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const dotsRef = useRef([]);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);

  // Auto-rotate hero content
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [setHeroCount]);

  useEffect(() => {
    // Animate entire container
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    
    // Animate text with more polished effects
    gsap.fromTo(text1Ref.current, 
      { opacity: 0, y: 40, filter: 'blur(10px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(text2Ref.current, 
      { opacity: 0, y: 30, filter: 'blur(5px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', delay: 0.3, duration: 0.8, ease: 'power3.out' }
    );
    
    // Animate CTA button
    gsap.fromTo(ctaRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, delay: 0.6, duration: 0.5, ease: 'back.out(1.7)' }
    );
    
    // Animate dots with staggered effect
    dotsRef.current.forEach((dot, i) => {
      gsap.fromTo(dot, 
        { scale: 0.5, opacity: 0 }, 
        { scale: 1, opacity: 1, delay: 0.8 + (0.1 * i), duration: 0.4, ease: 'back.out(1.7)' }
      );
    });
  }, [heroCount]);

  const nextSlide = () => {
    setHeroCount(heroCount === 3 ? 0 : heroCount + 1);
  };

  const prevSlide = () => {
    setHeroCount(heroCount === 0 ? 3 : heroCount - 1);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="w-full md:w-[70%] lg:w-[50%] xl:w-[45%] relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
        {/* Hero Text */}
        <div className="space-y-4 md:space-y-6 text-center">
          <p ref={text1Ref} className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 leading-tight">
            {heroData.text1}
          </p>
          <p ref={text2Ref} className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700">
            {heroData.text2}
          </p>
          
          {/* CTA Button */}
          <div ref={ctaRef} className="pt-4">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-all duration-300 group"
        >
          <FaChevronLeft className="text-gray-700 group-hover:text-blue-600" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-all duration-300 group"
        >
          <FaChevronRight className="text-gray-700 group-hover:text-blue-600" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setHeroCount(i)}
              className="focus:outline-none transition-transform duration-300 hover:scale-125"
            >
              <FaCircle
                ref={el => dotsRef.current[i] = el}
                className={`w-3 h-3 ${heroCount === i ? "text-blue-600" : "text-gray-400"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;