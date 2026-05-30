import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function Hero({ heroData, heroCount, setHeroCount }) {
  const navigate = useNavigate();
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const dotsRef = useRef([]);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const _particlesRef = useRef(null);
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
      ease: 'power2.out',
    });
  }, [mousePosition]);

  // Initial CTA button animation - runs only once on mount
  useEffect(() => {
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.6, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        delay: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      }
    );
  }, []);

  useEffect(() => {
    // Animate entire container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Animate text with more polished effects
    gsap.fromTo(
      text1Ref.current,
      { opacity: 0, y: 60, rotateX: 45, filter: 'blur(15px)' },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
      }
    );

    gsap.fromTo(
      text2Ref.current,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        delay: 0.4,
        duration: 0.9,
        ease: 'power3.out',
      }
    );

    // Animate dots with staggered effect
    dotsRef.current.forEach((dot, i) => {
      gsap.fromTo(
        dot,
        { scale: 0, opacity: 0, rotation: -180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          delay: 0.9 + 0.12 * i,
          duration: 0.5,
          ease: 'back.out(2)',
        }
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
    { primary: 'from-emerald-500 via-teal-400 to-cyan-500', accent: 'emerald' },
  ];

  const _currentTheme = colorThemes[heroCount];

  // Precompute particles once to avoid re-randomizing on each render
  const _particles = useMemo(() => {
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
      {/* Layer 1: Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {[heroData.image, heroData.image, heroData.image, heroData.image].map(
          (img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === heroCount ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.85)',
              }}
            />
          )
        )}
      </div>

      {/* Layer 2: Overlay Gradient - Reduced for better visibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B0F1A]/30 via-[#0B0F1A]/40 to-[#0B0F1A]/50" />

      {/* Layer 2.5: Directional Edge Vignette - Reduced for better visibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
          linear-gradient(to right,
            rgba(11,15,26,0.35) 0%,
            rgba(11,15,26,0.15) 12%,
            rgba(11,15,26,0) 30%,
            rgba(11,15,26,0) 70%,
            rgba(11,15,26,0.15) 88%,
            rgba(11,15,26,0.35) 100%
          ),
          linear-gradient(to bottom,
            rgba(11,15,26,0.30) 0%,
            rgba(11,15,26,0) 40%,
            rgba(11,15,26,0) 60%,
            rgba(11,15,26,0.45) 100%
          )
        `,
        }}
      />

      {/* Layer 3: Content Container */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 md:px-10">
        {/* Animated Text Container */}
        <div
          ref={containerRef}
          className="space-y-5 md:space-y-7 text-center relative flex flex-col items-center"
        >
          {/* Title with localized backdrop */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-0 bg-[#0B0F1A]/20 backdrop-blur-[8px] rounded-[14px] -m-3 md:-m-5 z-0" />
            <p
              ref={text1Ref}
              className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white px-4 py-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {heroData.text1}
            </p>
          </div>

          {/* Subtitle with localized backdrop */}
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-0 bg-[#0B0F1A]/18 backdrop-blur-[6px] rounded-[12px] -m-3 md:-m-4 z-0" />
            <p
              ref={text2Ref}
              className="relative z-10 text-lg md:text-xl lg:text-2xl font-medium text-gray-100 tracking-wide px-3 py-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {heroData.text2}
            </p>
          </div>
        </div>

        {/* Static CTA Button - Right below text, not animated */}
        <div className="text-center pt-8">
          <button
            ref={ctaRef}
            onClick={() => navigate('/collection')}
            className="relative bg-[#2563EB] hover:bg-[#1d4ed8] px-10 py-4 text-white font-bold rounded-full group overflow-hidden"
            style={{
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 0 0px rgba(79,140,255,0.4)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
          >
            <span className="flex items-center gap-2 relative z-10">
              {/* Shopping bag icon - slides in on hover */}
              <BsHandbag className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              Shop Now
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            {/* Light bloom effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 24px rgba(79,140,255,0.25)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Navigation Arrows - Outside content card */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <FaChevronLeft className="text-white text-lg" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <FaChevronRight className="text-white text-lg" />
      </button>

      {/* Pill Style Carousel Indicator - Outside content card */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setHeroCount(i)}
            className="focus:outline-none transition-all duration-300"
          >
            <div
              ref={(el) => (dotsRef.current[i] = el)}
              className={`transition-all duration-300 rounded-full ${
                heroCount === i
                  ? 'w-7 h-2.5 bg-[#2563EB]'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Hero;
