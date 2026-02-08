import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import gsap from 'gsap';

function Hero({ heroData, heroCount, setHeroCount }) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const dotsRef = useRef([]);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const particlesRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Animate entire container with parallax
    gsap.to(containerRef.current, {
      x: mousePosition.x * 15,
      y: mousePosition.y * 15,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [mousePosition]);

  useEffect(() => {
    // Animate entire container
    gsap.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
    
    // Animate text with more polished effects
    gsap.fromTo(text1Ref.current, 
      { opacity: 0, y: 60, rotateX: 45, filter: 'blur(15px)' }, 
      { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
    );
    
    gsap.fromTo(text2Ref.current, 
      { opacity: 0, y: 40, filter: 'blur(8px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', delay: 0.4, duration: 0.9, ease: 'power3.out' }
    );
    
    // Animate CTA button with bounce
    gsap.fromTo(ctaRef.current, 
      { opacity: 0, scale: 0.6, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, delay: 0.7, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
    );
    
    // Animate dots with staggered effect
    dotsRef.current.forEach((dot, i) => {
      gsap.fromTo(dot, 
        { scale: 0, opacity: 0, rotation: -180 }, 
        { scale: 1, opacity: 1, rotation: 0, delay: 0.9 + (0.12 * i), duration: 0.5, ease: 'back.out(2)' }
      );
    });
  }, [heroCount]);

  const nextSlide = () => {
    setHeroCount(heroCount === 3 ? 0 : heroCount + 1);
  };

  const prevSlide = () => {
    setHeroCount(heroCount === 0 ? 3 : heroCount - 1);
  };

  // Color themes for each slide
  const colorThemes = [
    { primary: 'from-blue-500 via-cyan-400 to-teal-500', accent: 'blue' },
    { primary: 'from-purple-500 via-pink-500 to-rose-500', accent: 'purple' },
    { primary: 'from-amber-500 via-orange-500 to-red-500', accent: 'orange' },
    { primary: 'from-emerald-500 via-teal-400 to-cyan-500', accent: 'emerald' }
  ];

  const currentTheme = colorThemes[heroCount];

  // Precompute particles once to avoid re-randomizing on each render
  const particles = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899'];
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color1: colors[i % 4],
      color2: colors[(i + 1) % 4],
      delay: i * 0.3,
      duration: 4 + Math.random() * 4,
      glow: 10 + Math.random() * 20,
    }));
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 rounded-full animate-float opacity-40`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: `linear-gradient(45deg, ${particle.color1}, ${particle.color2})`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              boxShadow: `0 0 ${particle.glow}px ${particle.color1}`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-morph"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accent === 'blue' ? '#3b82f6' : currentTheme.accent === 'purple' ? '#8b5cf6' : currentTheme.accent === 'orange' ? '#f59e0b' : '#10b981'}, transparent)`,
          left: '10%',
          top: '20%',
          transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 animate-morph"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accent === 'blue' ? '#06b6d4' : currentTheme.accent === 'purple' ? '#ec4899' : currentTheme.accent === 'orange' ? '#ef4444' : '#06b6d4'}, transparent)`,
          right: '10%',
          bottom: '20%',
          animationDelay: '-4s',
          transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
        }}
      />

      <div 
        ref={containerRef} 
        className="w-full md:w-[75%] lg:w-[55%] xl:w-[48%] relative glass-card rounded-3xl p-10 md:p-12 border border-white/20 shadow-2xl gradient-border"
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        </div>

        {/* Hero Text */}
        <div className="space-y-5 md:space-y-7 text-center relative z-10">
          <p 
            ref={text1Ref} 
            className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white`}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary.includes('blue') ? '#3b82f6, #06b6d4, #8b5cf6' : currentTheme.primary.includes('purple') ? '#8b5cf6, #ec4899, #f43f5e' : currentTheme.primary.includes('amber') ? '#f59e0b, #ef4444, #ec4899' : '#10b981, #06b6d4, #3b82f6'})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 4s ease infinite',
            }}
          >
            {heroData.text1}
          </p>
          <p ref={text2Ref} className="text-lg md:text-xl lg:text-2xl font-medium text-gray-200/90 tracking-wide">
            {heroData.text2}
          </p>
          
          {/* CTA Button */}
          <div ref={ctaRef} className="pt-5">
            <button className={`cta-button px-10 py-4 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 relative overflow-hidden group`}>
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 md:left-5 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-400 group border border-white/20"
        >
          <FaChevronLeft className="text-white text-lg group-hover:text-cyan-400 transition-colors" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-3 md:right-5 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-400 group border border-white/20"
        >
          <FaChevronRight className="text-white text-lg group-hover:text-cyan-400 transition-colors" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/10">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setHeroCount(i)}
              className="focus:outline-none transition-all duration-400 hover:scale-150 group"
            >
              <div
                ref={el => dotsRef.current[i] = el}
                className={`w-3 h-3 rounded-full transition-all duration-400 ${
                  heroCount === i 
                    ? `bg-gradient-to-r ${currentTheme.primary} shadow-lg scale-125` 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                style={{
                  boxShadow: heroCount === i ? `0 0 15px ${currentTheme.accent === 'blue' ? '#3b82f6' : currentTheme.accent === 'purple' ? '#8b5cf6' : currentTheme.accent === 'orange' ? '#f59e0b' : '#10b981'}` : 'none'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
