import React, { useRef, useEffect } from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewLetterBox';
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

  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'QUALITY ASSURANCE',
      text: 'Every product undergoes rigorous quality checks to ensure durability, comfort, and exceptional craftsmanship that meets our high standards.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: 'SEAMLESS EXPERIENCE',
      text: 'Enjoy intuitive navigation, fast loading times, and a streamlined checkout process designed for maximum convenience and satisfaction.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'EXCEPTIONAL SERVICE',
      text: 'Our dedicated support team provides personalized assistance, ensuring your shopping experience is nothing short of exceptional.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: 'PREMIUM SELECTION',
      text: 'Curated collections featuring the latest trends and timeless classics, carefully selected to elevate your style and confidence.',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'CUSTOMER FOCUSED',
      text: 'Your satisfaction is our priority. We continuously evolve based on your feedback to deliver what you truly want and need.',
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: 'INNOVATION DRIVEN',
      text: 'Leveraging cutting-edge technology to create immersive shopping experiences that anticipate and exceed your expectations.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: '😊' },
    { number: '10K+', label: 'Products Available', icon: '🛍️' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
    { number: '24/7', label: 'Customer Support', icon: '🛡️' }
  ];

  useEffect(() => {
    // Animations
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(statsRef.current?.children,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(missionRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-16 px-4">
        <Title text1="ABOUT" text2="RIVETO" />
        <p className="text-lg text-cyan-100 mt-4 max-w-2xl mx-auto">
          Redefining online shopping with innovation, quality, and exceptional service
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Carousel */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/20">
            <Carousel
              baseWidth={400}
              autoplay={true}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </div>

          {/* Text Content */}
          <div ref={textRef} className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Riveto</span>
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Riveto is a modern, responsive e-commerce platform designed to deliver a seamless and intuitive shopping experience. 
              We combine cutting-edge technology with exceptional design to create a shopping journey that's both enjoyable and efficient.
            </p>

            <div ref={missionRef} className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-400 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">Our Mission</h3>
              <p className="text-gray-200">
                To make fashion accessible, affordable, and effortless — blending quality, technology, and personal expression 
                into everyday shopping experiences that inspire confidence and joy.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
              <div className="text-2xl mt-2">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Title text1="WHY" text2="CHOOSE US" />
            <p className="text-cyan-100 mt-4 max-w-2xl mx-auto">
              Discover what makes Riveto the preferred choice for discerning shoppers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.text}</p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8 md:p-12 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-cyan-100 max-w-2xl mx-auto">
              The principles that guide everything we do at Riveto
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4">
              <h4 className="text-cyan-300 font-semibold mb-2">Innovation</h4>
              <p className="text-gray-300 text-sm">Continuously pushing boundaries to deliver cutting-edge shopping experiences</p>
            </div>
            <div className="p-4">
              <h4 className="text-cyan-300 font-semibold mb-2">Quality</h4>
              <p className="text-gray-300 text-sm">Never compromising on the excellence of our products and services</p>
            </div>
            <div className="p-4">
              <h4 className="text-cyan-300 font-semibold mb-2">Integrity</h4>
              <p className="text-gray-300 text-sm">Building trust through transparency and honest business practices</p>
            </div>
            <div className="p-4">
              <h4 className="text-cyan-300 font-semibold mb-2">Community</h4>
              <p className="text-gray-300 text-sm">Fostering connections and supporting the communities we serve</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10">
        <NewsletterBox/>
      </div>
    </div>
  );
}

export default About;