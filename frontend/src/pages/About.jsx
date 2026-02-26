import React, { useRef, useEffect, useState } from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';
import Carousel from '../ui/Carousel';
import { FaRocket, FaShieldAlt, FaUsers, FaAward, FaHeart, FaLightbulb } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const textRef = useRef(null);
  const cardsRef = useRef([]);
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'QUALITY ASSURANCE',
      text: 'Every product undergoes rigorous quality checks to ensure durability, comfort, and exceptional craftsmanship that meets our high standards.',
      color: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glow: 'hover:shadow-violet-500/30'
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: 'SEAMLESS EXPERIENCE',
      text: 'Enjoy intuitive navigation, fast loading times, and a streamlined checkout process designed for maximum convenience and satisfaction.',
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      glow: 'hover:shadow-cyan-500/30'
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'EXCEPTIONAL SERVICE',
      text: 'Our dedicated support team provides personalized assistance, ensuring your shopping experience is nothing short of exceptional.',
      color: 'from-amber-400 via-orange-500 to-red-500',
      glow: 'hover:shadow-amber-500/30'
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: 'PREMIUM SELECTION',
      text: 'Curated collections featuring the latest trends and timeless classics, carefully selected to elevate your style and confidence.',
      color: 'from-emerald-400 via-teal-500 to-cyan-500',
      glow: 'hover:shadow-emerald-500/30'
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'CUSTOMER FOCUSED',
      text: 'Your satisfaction is our priority. We continuously evolve based on your feedback to deliver what you truly want and need.',
      color: 'from-pink-400 via-rose-500 to-red-500',
      glow: 'hover:shadow-pink-500/30'
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: 'INNOVATION DRIVEN',
      text: 'Leveraging cutting-edge technology to create immersive shopping experiences that anticipate and exceed your expectations.',
      color: 'from-yellow-400 via-amber-500 to-orange-500',
      glow: 'hover:shadow-yellow-500/30'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: '😊', color: 'from-pink-500 to-rose-500' },
    { number: '10K+', label: 'Products Available', icon: '🛍️', color: 'from-cyan-500 to-blue-500' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐', color: 'from-amber-500 to-yellow-500' },
    { number: '24/7', label: 'Customer Support', icon: '🛡️', color: 'from-emerald-500 to-teal-500' }
  ];

  // Mouse move handler for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Hero entrance animation
    gsap.fromTo(heroRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power4.out"
      }
    );

    // Text animation with split effect
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 80, rotateX: 15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Cards with staggered 3D effect
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 100, rotateY: -15, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );

    // Stats counter animation
    gsap.fromTo(statsRef.current?.children,
      { opacity: 0, y: 50, scale: 0.5, rotateZ: -5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Mission section with slide effect
    gsap.fromTo(missionRef.current,
      { opacity: 0, x: -100, skewX: -5 },
      {
        opacity: 1,
        x: 0,
        skewX: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Values section animation
    gsap.fromTo(valuesRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Floating animation for background elements
    gsap.to(".floating-orb", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

  }, []);

  return (
    <>
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-950 dark:via-[#0a0f1a] dark:to-[#071525] pt-24 pb-20 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div
          className="floating-orb absolute -top-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div
          className="floating-orb absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
        ></div>
        <div
          className="floating-orb absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-emerald-500/8 via-teal-500/5 to-transparent rounded-full blur-3xl"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        ></div>
        <div
          className="floating-orb absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gradient-to-l from-pink-500/8 via-rose-500/5 to-transparent rounded-full blur-3xl"
          style={{ transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)` }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      </div>

      {/* Header Section */}
      <div ref={heroRef} className="relative z-10 text-center mb-16 px-4">
        <div className="inline-block">
          <Title text1="ABOUT" text2="RIVETO" />
        </div>
        <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-300 dark:via-blue-300 dark:to-purple-300 mt-4 max-w-2xl mx-auto font-medium">
          Redefining online shopping with innovation, quality, and exceptional service
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Carousel */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
              <Carousel
                baseWidth={400}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Text Content */}
          <div ref={textRef} className="space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              <span className="text-slate-900 dark:text-white">Welcome to </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent animate-pulse">Riveto</span>
            </h2>

            <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed">
              Riveto is a modern, responsive e-commerce platform designed to deliver a seamless and intuitive shopping experience.
              We combine cutting-edge technology with exceptional design to create a shopping journey that's both enjoyable and efficient.
            </p>

            <div
              ref={missionRef}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"></div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-300 bg-clip-text text-transparent mb-3">Our Mission</h3>
                <p className="text-slate-700 dark:text-gray-200">
                  To make fashion accessible, affordable, and effortless — blending quality, technology, and personal expression
                  into everyday shopping experiences that inspire confidence and joy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
              <div className="relative text-center p-6 bg-white/85 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-500`}></div>
                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-slate-700 dark:text-gray-300 text-sm font-medium">{stat.label}</div>
                <div className="text-3xl mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <Title text1="WHY" text2="CHOOSE US" />
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-300 dark:to-purple-300 mt-4 max-w-2xl mx-auto font-medium">
              Discover what makes Riveto the preferred choice for discerning shoppers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className={`group relative cursor-pointer perspective-1000`}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-700`}></div>
                <div className={`relative bg-white/85 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all duration-700 group-hover:-translate-y-3 group-hover:shadow-2xl ${feature.glow} overflow-hidden h-full`}>
                  {/* Animated gradient border */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

                  {/* Glow effect on hover */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>

                  {/* Icon with animation */}
                  <div className={`relative w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl transition-all duration-500`}>
                    {feature.icon}
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.text}
                  </p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <svg className="w-4 h-4 text-slate-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div ref={valuesRef} className="relative group mb-24">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
          <div className="relative bg-white/85 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5"></div>

            <div className="relative text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-700 to-violet-700 dark:from-white dark:via-cyan-200 dark:to-violet-200 bg-clip-text text-transparent mb-4">
                Our Core Values
              </h2>
              <p className="text-slate-700 dark:text-gray-300 max-w-2xl mx-auto">
                The principles that guide everything we do at Riveto
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Innovation', desc: 'Continuously pushing boundaries to deliver cutting-edge shopping experiences', color: 'from-violet-500 to-purple-500' },
                { title: 'Quality', desc: 'Never compromising on the excellence of our products and services', color: 'from-cyan-500 to-blue-500' },
                { title: 'Integrity', desc: 'Building trust through transparency and honest business practices', color: 'from-emerald-500 to-teal-500' },
                { title: 'Community', desc: 'Fostering connections and supporting the communities we serve', color: 'from-pink-500 to-rose-500' }
              ].map((value, index) => (
                <div key={index} className="group/item relative p-6 rounded-xl bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${value.color} rounded-l-xl transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-500 origin-top`}></div>
                  <h4 className={`font-bold text-lg mb-2 bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}>
                    {value.title}
                  </h4>
                  <p className="text-slate-600 dark:text-gray-400 text-sm group-hover/item:text-slate-700 dark:group-hover/item:text-gray-300 transition-colors duration-300">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10">
        <NewsletterBox/>
      </div>

    </div>
      {/* Footer */}
      <Footer />
      </>
  );
}

export default About;
