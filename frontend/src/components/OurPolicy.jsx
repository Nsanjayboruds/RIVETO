import React, { useRef, useEffect } from 'react';
import Title from './Title';
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport, BiShield, BiHappy, BiRocket } from "react-icons/bi";
import { FaShippingFast, FaAward } from "react-icons/fa";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

function OurPolicy() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  const policies = [
    {
      icon: <RiExchangeFundsLine className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Easy Exchange Policy",
      desc: "Exchange Made Easy - Quick, Simple, and Customer-friendly Process.",
      features: ["14-day exchange window", "No hidden fees", "Quick processing"],
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <TbRosetteDiscountCheckFilled className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "7-Day Return Policy",
      desc: "Shop with Confidence - 7 Days Easy Return Guarantee.",
      features: ["Full refund guarantee", "Free return shipping", "No questions asked"],
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: <BiSupport className="w-12 h-12 text-amber-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "24/7 Customer Support",
      desc: "Trusted Customer Support - Your Satisfaction Is Our Priority.",
      features: ["24/7 live chat", "Phone & email support", "Expert assistance"],
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: <FaShippingFast className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Fast & Free Shipping",
      desc: "Free shipping on all orders over $50. Delivery within 2-3 business days.",
      features: ["Free over $50", "2-3 day delivery", "Real-time tracking"],
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <BiShield className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Secure Payments",
      desc: "Your payments are 100% secure with our advanced encryption technology.",
      features: ["SSL encryption", "Multiple payment options", "Fraud protection"],
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <FaAward className="w-12 h-12 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Quality Guarantee",
      desc: "We stand behind the quality of our products with a comprehensive warranty.",
      features: ["1-year warranty", "Quality assurance", "Premium materials"],
      color: "from-yellow-500 to-amber-600"
    }
  ];

  useEffect(() => {
    // Animate cards on scroll
    gsap.fromTo(cardsRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Animate title
    gsap.fromTo(".policy-title",
      {
        opacity: 0,
        y: -30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="policy-title">
            <Title text1="OUR" text2="POLICIES" />
            <p className="text-lg md:text-xl text-cyan-100 mt-4 max-w-2xl mx-auto leading-relaxed">
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
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden p-8 border border-gray-700 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${policy.color}`}></div>
              
              {/* Icon container */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {policy.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{policy.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{policy.desc}</p>

              {/* Features list */}
              <ul className="space-y-2">
                {policy.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-cyan-100">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">99%</div>
            <div className="text-gray-400 text-sm">Customer Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Support Availability</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">1.2M+</div>
            <div className="text-gray-400 text-sm">Happy Customers</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">5★</div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help you with any questions about our policies or products.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1  cursor-pointer"
            onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
    </section>
  );
}

export default OurPolicy;