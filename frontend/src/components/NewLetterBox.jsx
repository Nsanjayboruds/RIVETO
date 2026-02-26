import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaGift, FaCheckCircle, FaStar } from 'react-icons/fa';
import { MdEmail, MdOutlineDiscount } from "react-icons/md";
import { HiSparkles } from 'react-icons/hi2';
import gsap from 'gsap';
import { toast } from 'react-toastify';

function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Floating background animations
    gsap.to(".nl-floating-1", {
      y: -25,
      x: 15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".nl-floating-2", {
      y: 20,
      x: -20,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".nl-floating-3", {
      y: -15,
      x: -10,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Sparkle rotation
    gsap.to(".nl-sparkle", {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: "linear"
    });

    // Main section animation
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(".newsletter-feature",
      { opacity: 0, x: -40, rotateY: -10 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );

    // Stats counter animation
    gsap.fromTo(".stat-item",
      { opacity: 0, y: 20, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      toast.success('🎉 Successfully subscribed to our newsletter!');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }, 1000);
  };

  const features = [
    {
      icon: <MdOutlineDiscount className="w-5 h-5" />,
      title: "Exclusive Discounts",
      description: "Get special offers available only to subscribers",
      color: "from-emerald-400 to-cyan-500",
      shadowColor: "group-hover:shadow-emerald-500/30"
    },
    {
      icon: <FaGift className="w-5 h-5" />,
      title: "Early Access",
      description: "Be the first to shop new collections and limited editions",
      color: "from-purple-400 to-pink-500",
      shadowColor: "group-hover:shadow-purple-500/30"
    },
    {
      icon: <FaStar className="w-5 h-5" />,
      title: "VIP Treatment",
      description: "Receive personalized recommendations and content",
      color: "from-amber-400 to-orange-500",
      shadowColor: "group-hover:shadow-amber-500/30"
    }
  ];

  return (
    <section ref={sectionRef} className="w-full min-h-screen bg-white dark:bg-transparent px-4 py-16 md:py-24 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="nl-floating-1 absolute -top-24 -right-24 w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="nl-floating-2 absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="nl-floating-3 absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Animated particles */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div 
          className={`bg-white dark:bg-gradient-to-br dark:from-gray-900/95 dark:to-gray-800/95 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm
            shadow-2xl transition-all duration-700 ${isHovered ? 'shadow-cyan-500/20 border-gray-300 dark:border-gray-600/70 scale-[1.01]' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-10 px-6 text-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%)] bg-[size:30px_30px] animate-pulse"></div>
            
            {/* Floating stars */}
            <div className="absolute top-4 left-4 opacity-30">
              <FaStar className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute top-6 left-16 opacity-20">
              <FaStar className="w-4 h-4 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-4 right-4 opacity-30">
              <FaStar className="w-8 h-8 text-white animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="absolute top-8 right-16 opacity-20">
              <FaStar className="w-5 h-5 text-white animate-bounce" style={{ animationDelay: '0.7s' }} />
            </div>
            <div className="absolute bottom-4 left-1/4 opacity-20">
              <HiSparkles className="nl-sparkle w-6 h-6 text-yellow-300" />
            </div>
            <div className="absolute bottom-6 right-1/4 opacity-20">
              <HiSparkles className="nl-sparkle w-5 h-5 text-yellow-300" style={{ animationDelay: '2s' }} />
            </div>
            
            <div className="flex flex-col items-center relative">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 
                border border-white/20 shadow-lg shadow-white/10
                transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-xl hover:shadow-white/20 group">
                <MdEmail className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Join Our Exclusive Newsletter
              </h2>
              <p className="text-cyan-100/90 text-sm md:text-base max-w-md leading-relaxed">
                Be the first to know about new products, special offers, and insider deals
              </p>
              
              {/* Animated underline */}
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
            </div>
          </div>

          <div className="p-8 md:p-12 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Benefits Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  Why Subscribe?
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                </h3>
                
                {features.map((feature, index) => (
                  <div key={index} className="newsletter-feature group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 text-white
                      shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.shadowColor} group-hover:shadow-xl`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-100 transition-colors duration-300">{feature.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}

                {/* Stats */}
                <div className="stats-grid grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="stat-item text-center p-3 rounded-xl bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/30
                    transition-all duration-300 hover:scale-105 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group">
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all">10K+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Subscribers</div>
                  </div>
                  <div className="stat-item text-center p-3 rounded-xl bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/30
                    transition-all duration-300 hover:scale-105 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all">25%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Exclusive Discount</div>
                  </div>
                  <div className="stat-item text-center p-3 rounded-xl bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/30
                    transition-all duration-300 hover:scale-105 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer group">
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-orange-300 transition-all">24H</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Early Access</div>
                  </div>
                </div>
              </div>

              {/* Subscription Form */}
              <div className="newsletter-feature">
                {isSubscribed ? (
                  <div className="text-center py-8 animate-fadeIn">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 
                      animate-pulse border border-green-500/30">
                      <FaCheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Aboard! 🎉</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for subscribing. Check your inbox for a special welcome gift.
                    </p>
                    <button
                      onClick={() => setIsSubscribed(false)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white rounded-xl 
                        hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 
                        hover:scale-105 hover:shadow-lg border border-gray-300 dark:border-gray-600/50"
                    >
                      Subscribe Another Email
                    </button>
                  </div>
                ) : (
                  <div ref={formRef} className="bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50
                    transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600/70 hover:shadow-xl hover:shadow-cyan-500/5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      Get Started Now
                      <FaPaperPlane className="w-4 h-4 text-cyan-400 animate-bounce" />
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className={`relative group transition-all duration-300 ${focusedInput ? 'scale-[1.02]' : ''}`}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput(true)}
                          onBlur={() => setFocusedInput(false)}
                          placeholder="Enter your email address"
                          className="w-full px-5 py-4 bg-white dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 
                            focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 
                            transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 pr-12"
                          required
                        />
                        <MdEmail className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-300
                          ${focusedInput ? 'text-cyan-400' : ''}`} />
                        
                        {/* Focus glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 pointer-events-none transition-opacity duration-300
                          ${focusedInput ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 
                          text-white font-semibold py-4 px-6 rounded-xl 
                          transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30 
                          flex items-center justify-center gap-3 group
                          before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400 before:via-blue-400 before:to-purple-500 
                          before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          Subscribe Now
                        </span>
                      </button>
                    </form>

                    <p className="text-gray-500 text-xs text-center mt-5 leading-relaxed">
                      🔒 By subscribing, you agree to our Privacy Policy and consent to receive
                      our promotional communications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/80 to-gray-800/50 py-4 px-6 text-center border-t border-gray-700/30">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}

export default NewsletterBox;