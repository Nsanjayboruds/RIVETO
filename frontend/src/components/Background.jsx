import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap'; 
import background1 from '../assets/ban7.jpg';
import background2 from '../assets/ban9.png';
import background3 from '../assets/ban10.png';
import background4 from '../assets/ban11.png';

function Background({ heroCount }) {
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const particleContainerRef = useRef(null);
  const [prevHeroCount, setPrevHeroCount] = useState(0);

  // Select image based on heroCount
  const backgrounds = [background1, background2, background3, background4];
  const currentBackground = backgrounds[heroCount] || background1;

  // Color themes for each slide
  const colorThemes = [
    { primary: '#3b82f6', secondary: '#06b6d4' },
    { primary: '#8b5cf6', secondary: '#ec4899' },
    { primary: '#f59e0b', secondary: '#ef4444' },
    { primary: '#10b981', secondary: '#06b6d4' }
  ];

  useEffect(() => {
    // Determine animation direction
    const direction = heroCount > prevHeroCount ? 1 : -1;
    
    // Create a more sophisticated animation sequence
    const tl = gsap.timeline();
    
    // First, fade out the current image with a slight zoom and rotation
    tl.to(bgRef.current, {
      opacity: 0,
      scale: direction > 0 ? 1.1 : 0.9,
      rotation: direction > 0 ? 2 : -2,
      duration: 0.7,
      ease: 'power3.inOut'
    })
    // Change the image source
    .add(() => {
      if (bgRef.current) {
        bgRef.current.src = currentBackground;
      }
    })
    // Fade in the new image with a more dynamic effect
    .to(bgRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
    // Add a subtle overlay animation for depth
    .fromTo(overlayRef.current,
      { opacity: 0.4 },
      { opacity: 0.15, duration: 1, ease: 'sine.out' },
      '-=0.8'
    );

    // Animate particles on slide change
    if (particleContainerRef.current) {
      const particles = particleContainerRef.current.children;
      gsap.fromTo(particles, 
        { opacity: 0, scale: 0 },
        { 
          opacity: 0.6, 
          scale: 1, 
          stagger: 0.05, 
          duration: 0.5, 
          ease: 'back.out(2)',
          delay: 0.3
        }
      );
    }

    // Update previous hero count
    setPrevHeroCount(heroCount);

    return () => {
      tl.kill();
    };
  }, [heroCount, currentBackground, prevHeroCount]);

  // Generate floating particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    color: i % 2 === 0 ? colorThemes[heroCount].primary : colorThemes[heroCount].secondary
  }));

  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 overflow-hidden">
      {/* Main Background Image */}
      <img
        ref={bgRef}
        src={currentBackground}
        alt="Hero Background"
        className="w-full h-full object-cover absolute top-0 left-0 will-change-transform"
      />

      {/* Animated Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 animate-aurora"
        style={{
          background: `linear-gradient(135deg, ${colorThemes[heroCount].primary}20, transparent, ${colorThemes[heroCount].secondary}20)`,
        }}
      />

      {/* Dark gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Floating Particles */}
      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-morph"
        style={{
          background: `radial-gradient(circle, ${colorThemes[heroCount].primary}, transparent)`,
          left: '-10%',
          top: '-20%',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-morph"
        style={{
          background: `radial-gradient(circle, ${colorThemes[heroCount].secondary}, transparent)`,
          right: '-10%',
          bottom: '-20%',
          animationDelay: '-5s',
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${colorThemes[heroCount].primary}20 1px, transparent 1px),
            linear-gradient(90deg, ${colorThemes[heroCount].primary}20 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

export default Background;
