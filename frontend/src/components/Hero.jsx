import React, { useEffect, useRef } from "react";
import { FaCircle } from "react-icons/fa";
import gsap from "gsap";

// UPDATED: Hero is now presentation-only
function Hero({ heroData, activeIndex, onDotClick }) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const dotsRef = useRef([]);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);

  // UPDATED: Animate only when hero text changes
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    gsap.fromTo(
      text1Ref.current,
      { opacity: 0, y: 40, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
    );

    gsap.fromTo(
      text2Ref.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, delay: 0.3, duration: 0.8 }
    );

    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, delay: 0.6, duration: 0.5 }
    );

    dotsRef.current.forEach((dot, i) => {
      gsap.fromTo(
        dot,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, delay: 0.8 + i * 0.1, duration: 0.4 }
      );
    });
  }, [heroData]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="w-full md:w-[70%] lg:w-[50%] bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10 shadow-2xl">

        {/* Hero Text */}
        <div className="text-center space-y-5">
          <p
            ref={text1Ref}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400"
          >
            {heroData.text1}
          </p>

          <p
            ref={text2Ref}
            className="text-lg md:text-xl text-gray-700"
          >
            {heroData.text2}
          </p>

          <div ref={ctaRef}>
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold">
              Learn More
            </button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-white/70 px-4 py-2 rounded-full">
          {[0, 1, 2, 3].map((i) => (
            <button key={i} onClick={() => onDotClick(i)}>
              <FaCircle
                ref={(el) => (dotsRef.current[i] = el)}
                className={`w-3 h-3 ${
                  activeIndex === i ? "text-blue-600" : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Hero;
