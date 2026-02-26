import React, { useRef, useEffect, useState } from 'react';
import Title from './Title';
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport, BiShield, BiHappy, BiRocket } from "react-icons/bi";
import { FaShippingFast, FaAward } from "react-icons/fa";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={counterRef}>{count}{suffix}</span>;
}

function OurPolicy() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const statsRef = useRef([]);
  const topStatsRef = useRef([]);
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const policies = [
    {
      icon: <RiExchangeFundsLine className="w-10 h-10" />,
      title: "Easy Exchange Policy",
      desc: "Exchange Made Easy - Quick, Simple, and Customer-friendly Process.",
      features: ["14-day exchange window", "No hidden fees", "Quick processing"],
      color: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      glowColor: "cyan"
    },
    {
      icon: <TbRosetteDiscountCheckFilled className="w-10 h-10" />,
      title: "7-Day Return Policy",
      desc: "Shop with Confidence - 7 Days Easy Return Guarantee.",
      features: ["Full refund guarantee", "Free return shipping", "No questions asked"],
      color: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      glowColor: "emerald"
    },
    {
      icon: <BiSupport className="w-10 h-10" />,
      title: "24/7 Customer Support",
      desc: "Trusted Customer Support - Your Satisfaction Is Our Priority.",
      features: ["24/7 live chat", "Phone & email support", "Expert assistance"],
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      glowColor: "amber"
    },
    {
      icon: <FaShippingFast className="w-10 h-10" />,
      title: "Fast & Free Shipping",
      desc: "Free shipping on all orders over $50. Delivery within 2-3 business days.",
      features: ["Free over $50", "2-3 day delivery", "Real-time tracking"],
      color: "from-purple-500 to-indigo-600",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      glowColor: "purple"
    },
    {
      icon: <BiShield className="w-10 h-10" />,
      title: "Secure Payments",
      desc: "Your payments are 100% secure with our advanced encryption technology.",
      features: ["SSL encryption", "Multiple payment options", "Fraud protection"],
      color: "from-red-500 to-pink-600",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      glowColor: "red"
    },
    {
      icon: <FaAward className="w-10 h-10" />,
      title: "Quality Guarantee",
      desc: "We stand behind the quality of our products with a comprehensive warranty.",
      features: ["1-year warranty", "Quality assurance", "Premium materials"],
      color: "from-yellow-500 to-amber-600",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      glowColor: "yellow"
    }
  ];

  const topStats = [
    { value: "10K+", label: "Units Sold", color: "text-cyan-400" },
    { value: "98%", label: "Satisfaction Rate", color: "text-emerald-400" },
    { value: "4.9/5", label: "Average Rating", color: "text-amber-400" },
    { value: "24H", label: "Fast Shipping", color: "text-purple-400" }
  ];

  const bottomStats = [
    { value: 99, suffix: "%", label: "Customer Satisfaction", color: "from-cyan-500 to-blue-500" },
    { value: 24, suffix: "/7", label: "Support Availability", color: "from-emerald-500 to-green-500" },
    { value: 1.2, suffix: "M+", label: "Happy Customers", color: "from-purple-500 to-pink-500" },
    { value: 5, suffix: "★", label: "Average Rating", color: "from-yellow-500 to-amber-500" }
  ];

  // Mouse move for parallax
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

  useEffect(() => {
    // Animate cards on scroll with stagger
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 80,
            scale: 0.85,
            rotateX: 20
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate top stats
    topStatsRef.current.forEach((stat, i) => {
      if (stat) {
        gsap.fromTo(stat,
          { opacity: 0, y: -40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate bottom stats
    statsRef.current.forEach((stat, i) => {
      if (stat) {
        gsap.fromTo(stat,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.12,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: stat,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate title
    gsap.fromTo(".policy-title",
      { opacity: 0, y: -50, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle card hover animation
  const handleCardHover = (index, isEnter) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: isEnter ? 1.03 : 1,
        y: isEnter ? -10 : 0,
        duration: 0.4,
        ease: isEnter ? "power2.out" : "power3.out"
      });
    }
  };

  return (
    <section ref={sectionRef} className="w-full min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0a0a0f] dark:via-[#0d1117] dark:to-[#0a0f1a] py-20 px-4 md:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-morph"
          style={{
            top: '-10%',
            right: '-5%',
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] animate-morph"
          style={{
            bottom: '-10%',
            left: '-5%',
            animationDelay: '-3s',
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[80px] animate-morph"
          style={{
            top: '40%',
            left: '30%',
            animationDelay: '-6s',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'][i % 4],
              boxShadow: `0 0 ${10 + Math.random() * 15}px ${['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'][i % 4]}`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {topStats.map((stat, i) => (
            <div
              key={i}
              ref={el => topStatsRef.current[i] = el}
              className="relative group"
            >
              <div className="text-center py-4 px-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1 cursor-default shadow-sm dark:shadow-none">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)' }}
                />
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1 animate-gradient-text`} style={{ backgroundSize: '200% auto' }}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="policy-title">
            <Title text1="OUR" text2="POLICIES" />
            <p className="text-base md:text-lg text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Customer-Centric Policies Designed for Your Peace of Mind and Complete Satisfaction
            </p>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {policies.map((policy, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              onMouseEnter={() => handleCardHover(i, true)}
              onMouseLeave={() => handleCardHover(i, false)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-cyan-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-700">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 3s linear infinite',
                    filter: 'blur(2px)'
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 group-hover:border-transparent transition-all duration-500 h-full">
                {/* Top gradient accent line */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${policy.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                {/* Icon container with glow */}
                <div className="mb-6 relative">
                  <div className={`w-14 h-14 ${policy.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}>
                    <div className={policy.iconColor}>
                      {policy.icon}
                    </div>
                    {/* Icon glow */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow: `0 0 30px ${policy.glowColor === 'cyan' ? 'rgba(6, 182, 212, 0.4)' : 
                                              policy.glowColor === 'emerald' ? 'rgba(16, 185, 129, 0.4)' : 
                                              policy.glowColor === 'amber' ? 'rgba(245, 158, 11, 0.4)' : 
                                              policy.glowColor === 'purple' ? 'rgba(139, 92, 246, 0.4)' : 
                                              policy.glowColor === 'red' ? 'rgba(239, 68, 68, 0.4)' : 
                                              'rgba(234, 179, 8, 0.4)'}`
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-500">
                  {policy.title}
                </h3>
                <p className="text-gray-400 mb-5 leading-relaxed text-sm md:text-base">{policy.desc}</p>

                {/* Features list */}
                <ul className="space-y-2.5">
                  {policy.features.map((feature, j) => (
                    <li 
                      key={j} 
                      className="flex items-center gap-3 text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                      style={{ transitionDelay: `${j * 50}ms` }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${policy.color} group-hover:scale-150 transition-transform duration-300`} 
                        style={{ transitionDelay: `${j * 100}ms` }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bottomStats.map((stat, i) => (
            <div
              key={i}
              ref={el => statsRef.current[i] = el}
              className="group relative"
            >
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, ${stat.color.includes('cyan') ? '#06b6d4' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('purple') ? '#8b5cf6' : '#f59e0b'}, transparent)`,
                }}
              />
              
              <div className="text-center p-6 md:p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 group-hover:border-transparent transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                {/* Bottom glow line */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${stat.color} transform origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.suffix === '%' ? <AnimatedCounter end={stat.value} suffix="%" /> :
                   stat.suffix === '/7' ? <><AnimatedCounter end={stat.value} />/7</> :
                   stat.suffix === 'M+' ? <><AnimatedCounter end={stat.value} duration={1.5} />.2M+</> :
                   <><AnimatedCounter end={stat.value} />★</>}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(6, 182, 212, 0.1)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center relative">
          <div className="relative group">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s linear infinite',
                filter: 'blur(8px)',
              }}
            />
            
            <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/98 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 animate-gradient-text" style={{ display: 'inline-block' }}>
                Still Have Questions?
              </h3>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Our customer support team is here to help you with any questions about our policies or products.
              </p>
              <button 
                className="cta-button px-10 py-4 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 cursor-pointer relative overflow-hidden group/btn"
                onClick={() => navigate('/contact')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Contact Support
                  <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner glows */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-2xl" />
    </section>
  );
}

export default OurPolicy;