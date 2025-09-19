import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import background1 from '../assets/ban7.jpg';
import background2 from '../assets/ban9.png';
import background3 from '../assets/ban10.png';
import background4 from '../assets/ban11.png';

function Background({ heroCount }) {
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const [prevHeroCount, setPrevHeroCount] = useState(0);

  // Select image based on heroCount
  const backgrounds = [background1, background2, background3, background4];
  const currentBackground = backgrounds[heroCount] || background1;

  useEffect(() => {
    // Determine animation direction
    const direction = heroCount > prevHeroCount ? 1 : -1;
    
    // Create a more sophisticated animation sequence
    const tl = gsap.timeline();
    
    // First, fade out the current image with a slight zoom
    tl.to(bgRef.current, {
      opacity: 0,
      scale: direction > 0 ? 1.05 : 0.95,
      duration: 0.6,
      ease: 'power2.inOut'
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
      duration: 1,
      ease: 'power3.out'
    })
    // Add a subtle overlay animation for depth
    .fromTo(overlayRef.current,
      { opacity: 0.3 },
      { opacity: 0.1, duration: 0.8, ease: 'sine.out' },
      '-=0.5'
    );

    // Update previous hero count
    setPrevHeroCount(heroCount);

    return () => {
      tl.kill();
    };
  }, [heroCount, currentBackground, prevHeroCount]);

  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 overflow-hidden">
      <img
        ref={bgRef}
        src={currentBackground}
        alt="Hero Background"
        className="w-full h-full object-cover absolute top-0 left-0 will-change-transform"
      />
      {/* Gradient overlay for better text readability */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"
      />
      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-20 mix-blend-soft-light" />
    </div>
  );
}

export default Background;