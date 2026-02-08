import React, { useEffect, useState, useRef } from 'react';
import Background from '../components/Background';
import Hero from '../components/Hero';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import NewLetterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroData = [
    { text1: "30% OFF LIMITED TIME OFFER", text2: "Style Your Home with Our Products" },
    { text1: "Discover the best of bold fashion", text2: "LIMITED TIME OFFER ONLY!" },
    { text1: "Explore our best collection", text2: "Shop Now and Save Big!" },
    { text1: "Choose your perfect Fashion", text2: "Now is the perfect time to shop!" }
  ];

  const [heroCount, setHeroCount] = useState(0);
  const productRef = useRef(null);
  const policyRef = useRef(null);
  const newsletterRef = useRef(null);
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Advanced scroll-triggered animations
  useEffect(() => {
    // Product section animation
    if (productRef.current) {
      gsap.fromTo(productRef.current.children,
        { 
          opacity: 0, 
          y: 100, 
          scale: 0.9,
          rotateX: 15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: productRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Policy section animation
    if (policyRef.current) {
      gsap.fromTo(policyRef.current,
        { 
          opacity: 0, 
          x: -80,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: policyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Newsletter section animation
    if (newsletterRef.current) {
      gsap.fromTo(newsletterRef.current,
        { 
          opacity: 0, 
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Footer animation
    if (footerRef.current) {
      gsap.fromTo(footerRef.current,
        { 
          opacity: 0, 
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Cleanup ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className='overflow-x-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f] min-h-screen'>
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-10"
          style={{
            background: 'radial-gradient(circle, #3b82f6, transparent)',
            left: '10%',
            top: '20%',
            transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent)',
            right: '5%',
            bottom: '30%',
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-8"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent)',
            left: '50%',
            top: '60%',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className='relative w-screen h-screen overflow-hidden'>
        <Background heroCount={heroCount} />
        <Hero heroCount={heroCount} heroData={heroData[heroCount]} setHeroCount={setHeroCount} />
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-scale">
          <span className="text-white/60 text-sm mb-2 tracking-widest">SCROLL</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
        
      {/* Animated Product Section */}
      <div ref={productRef} className="relative z-10">
        <Product />
      </div>

      {/* Animated Policy Section */}
      <div ref={policyRef} className="relative z-10">
        <OurPolicy />
      </div>

      {/* Animated Newsletter Section */}
      <div ref={newsletterRef} className="relative z-10">
        <NewLetterBox />
      </div>

      {/* Animated Footer Section */}
      <div ref={footerRef} className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
