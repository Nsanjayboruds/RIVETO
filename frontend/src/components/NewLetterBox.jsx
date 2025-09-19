import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaGift, FaCheckCircle, FaStar } from 'react-icons/fa';
import { MdEmail, MdOutlineDiscount } from "react-icons/md";
import gsap from 'gsap';
import { toast } from 'react-toastify';

function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Animations
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(".newsletter-feature",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
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

  return (
    <section ref={sectionRef} className="w-full min-h-screen px-4 py-16 md:py-24 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-cyan-600 to-blue-700 py-8 px-6 text-center">
            <div className="absolute top-4 left-4 opacity-20">
              <FaStar className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <FaStar className="w-8 h-8 text-white animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <MdEmail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Join Our Exclusive Newsletter
              </h2>
              <p className="text-cyan-100 text-sm md:text-base max-w-md">
                Be the first to know about new products, special offers, and insider deals
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Benefits Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Why Subscribe?</h3>
                
                <div className="newsletter-feature flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdOutlineDiscount className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Exclusive Discounts</h4>
                    <p className="text-gray-400 text-sm mt-1">Get special offers available only to subscribers</p>
                  </div>
                </div>

                <div className="newsletter-feature flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaGift className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Early Access</h4>
                    <p className="text-gray-400 text-sm mt-1">Be the first to shop new collections and limited editions</p>
                  </div>
                </div>

                <div className="newsletter-feature flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaStar className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">VIP Treatment</h4>
                    <p className="text-gray-400 text-sm mt-1">Receive personalized recommendations and content</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">10K+</div>
                    <div className="text-xs text-gray-400">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">25%</div>
                    <div className="text-xs text-gray-400">Exclusive Discount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">24H</div>
                    <div className="text-xs text-gray-400">Early Access</div>
                  </div>
                </div>
              </div>

              {/* Subscription Form */}
              <div className="newsletter-feature">
                {isSubscribed ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for subscribing. Check your inbox for a special welcome gift.
                    </p>
                    <button
                      onClick={() => setIsSubscribed(false)}
                      className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Subscribe Another Email
                    </button>
                  </div>
                ) : (
                  <div ref={formRef}>
                    <h3 className="text-xl font-bold text-white mb-6">Get Started Now</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          required
                        />
                        <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 group"
                      >
                        <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                        Subscribe Now
                      </button>
                    </form>

                    <p className="text-gray-500 text-xs text-center mt-4">
                      By subscribing, you agree to our Privacy Policy and consent to receive
                      our promotional communications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="bg-gray-800/50 py-4 px-6 text-center">
            <p className="text-gray-400 text-sm">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
    </section>
  );
}

export default NewsletterBox;