import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCheckCircle, FaLock, FaRocket, FaShieldAlt, FaTruck, FaUserShield, FaUsers } from 'react-icons/fa';
import NewsletterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';
import Carousel from '../ui/Carousel';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const capabilitiesRef = useRef(null);

  const capabilities = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Quality Assurance',
      text: 'Every product undergoes rigorous quality checks to ensure durability, comfort, and exceptional craftsmanship that meets our high standards.',
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: 'Seamless Checkout',
      text: 'Enjoy intuitive navigation, fast loading times, and a streamlined checkout process designed for maximum convenience and satisfaction.',
    },
    {
      icon: <FaTruck className="w-6 h-6" />,
      title: 'Real-Time Tracking',
      text: 'Track your orders in real-time with instant notifications and transparent delivery updates from warehouse to your doorstep.',
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: 'Customer Support',
      text: 'Our dedicated support team provides personalized assistance, ensuring your shopping experience is nothing short of exceptional.',
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: 'Vendor Vetting',
      text: 'All vendors undergo strict verification processes to ensure authenticity, reliability, and commitment to quality standards.',
    },
    {
      icon: <FaLock className="w-6 h-6" />,
      title: 'Data Security',
      text: 'Industry-leading encryption and security protocols protect your personal information and payment data at every transaction.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Customers' },
    { number: '10K+', label: 'Products' },
    { number: '98%', label: 'SLA' },
    { number: '24/7', label: 'Support' },
  ];

  const trustBadges = [
    {
      icon: <FaCheckCircle className="w-4 h-4" />,
      text: 'Secure Transactions',
    },
    { icon: <FaTruck className="w-4 h-4" />, text: 'Fast Fulfillment' },
    { icon: <FaShieldAlt className="w-4 h-4" />, text: 'Verified Vendors' },
    { icon: <FaUserShield className="w-4 h-4" />, text: 'Customer Protection' },
  ];

  useEffect(() => {
    // Simple fade-in animations without excessive effects
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }
    );

    gsap.fromTo(
      statsRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      capabilitiesRef.current?.querySelectorAll('.capability-card'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: capabilitiesRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <>
      <div className="w-full min-h-screen pt-24 pb-0">
        {/* SECTION 1: Corporate Hero - bg-[#0b1220] */}
        <div className="bg-[#0b1220] dark:bg-[#0b1220] bg-gray-100 relative">
          {/* Depth mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>

          <div
            ref={heroRef}
            className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Headline and Trust */}
              <div>
                <h1
                  className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Enterprise-Level Commerce Experience
                </h1>
                <p
                  className="text-xl text-gray-700 dark:text-gray-200 mb-6 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Built for Reliability, Designed for Trust
                </p>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Riveto is a modern, responsive e-commerce platform designed to
                  deliver a seamless and intuitive shopping experience. We
                  combine cutting-edge technology with exceptional design to
                  create a shopping journey that's both enjoyable and efficient.
                </p>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3">
                  {trustBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-[#1a2332] border border-gray-200 dark:border-[#1f2a44] rounded-lg"
                    >
                      <div className="text-blue-500 dark:text-blue-400">
                        {badge.icon}
                      </div>
                      <span
                        className="text-sm text-gray-700 dark:text-gray-300"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {badge.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Visual */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-[#1f2a44]">
                  <Carousel
                    baseWidth={500}
                    autoplay={true}
                    autoplayDelay={3000}
                    pauseOnHover={true}
                    loop={true}
                    round={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Operational Overview - bg-[#0f172a] */}
        <div className="bg-gray-50 dark:bg-[#0f172a] py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2
              className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Operational Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#101a2f] border border-gray-200 dark:border-[#1f2a44] p-6 rounded-lg">
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Platform Stability
                </h3>
                <p
                  className="text-sm text-gray-400 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  99.9% uptime with enterprise-grade infrastructure ensuring
                  your shopping experience is always available when you need it.
                </p>
              </div>
              <div className="bg-[#101a2f] border border-[#1f2a44] p-6 rounded-lg">
                <h3
                  className="text-lg font-semibold text-white mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fulfillment Network
                </h3>
                <p
                  className="text-sm text-gray-400 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Strategic warehouse locations and vetted logistics partners
                  enable fast, reliable delivery across all regions.
                </p>
              </div>
              <div className="bg-[#101a2f] border border-[#1f2a44] p-6 rounded-lg">
                <h3
                  className="text-lg font-semibold text-white mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Customer Protection
                </h3>
                <p
                  className="text-sm text-gray-400 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Comprehensive buyer protection policies, secure payment
                  processing, and transparent return procedures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Scale Indicators - bg-[#111c33] Slab Strip */}
        <div
          ref={statsRef}
          className="bg-gray-100 dark:bg-[#111c33] border-y border-gray-200 dark:border-[#1f2a44]"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1f2a44] py-10 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="px-6">
                <div
                  className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-sm text-gray-400 uppercase tracking-wide"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Platform Capabilities - bg-[#0b1220] with Contained Zone */}
        <div className="bg-white dark:bg-[#0b1220] py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2
              className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Platform Capabilities
            </h2>

            {/* Contained Platform Zone */}
            <div
              ref={capabilitiesRef}
              className="bg-gray-100 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-2xl p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="capability-card bg-white dark:bg-[#101a2f] border border-gray-200 dark:border-[#1f2a44] p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-blue-400 mt-1">
                        {capability.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-base font-semibold text-gray-900 dark:text-white mb-2"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {capability.title}
                        </h3>
                        <p
                          className="text-sm text-gray-400 leading-relaxed"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {capability.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Core Principles - bg-[#0f172a] Pure Typography */}
        <div className="bg-gray-50 dark:bg-[#0f172a] py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2
              className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-12 text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Core Principles
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
              {[
                {
                  title: 'Innovation',
                  desc: 'Continuously pushing boundaries to deliver cutting-edge shopping experiences',
                },
                {
                  title: 'Integrity',
                  desc: 'Building trust through transparency and honest business practices',
                },
                {
                  title: 'Quality',
                  desc: 'Never compromising on the excellence of our products and services',
                },
                {
                  title: 'Community',
                  desc: 'Fostering connections and supporting the communities we serve',
                },
              ].map((principle, index) => (
                <div key={index}>
                  <h3
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {principle.title}
                  </h3>
                  <p
                    className="text-sm text-gray-400 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section with Scratch Card */}
      <div className="relative z-10">
        <NewsletterBox />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default About;
