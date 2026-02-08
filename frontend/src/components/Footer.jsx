import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { RiCustomerService2Fill } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Animate footer elements on scroll
    gsap.fromTo(".footer-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 border-t border-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        
        {/* Brand Info */}
        <div className="footer-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              RIVETO
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 mb-6">
            RIVETO is a premium e-commerce platform built for the modern shopper. Experience seamless shopping with cutting-edge technology and exceptional service.
          </p>
          
          {/* Social Media */}
          <div className="flex gap-3">
            {[
              { icon: <FaFacebookF className="w-4 h-4" />, color: "hover:bg-blue-600" },
              { icon: <FaTwitter className="w-4 h-4" />, color: "hover:bg-cyan-500" },
              { icon: <FaInstagram className="w-4 h-4" />, color: "hover:bg-pink-600" },
              { icon: <FaLinkedinIn className="w-4 h-4" />, color: "hover:bg-blue-700" }
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                aria-label={`Follow us on ${social.icon.type.displayName}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <RiCustomerService2Fill className="text-cyan-400" />
            Quick Links
          </h3>
          <ul className="space-y-3">
            {['Home', 'About Us', 'Products', 'Collections', 'New Arrivals', 'Best Sellers'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BiSupport className="text-cyan-400" />
            Support
          </h3>
          <ul className="space-y-3">
            {[
              { name: 'Contact Us', to: '/contact' },
              { name: 'Size Guide', to: '/size-guide' },
              { name: 'FAQs', to: '/faq' },
              { name: 'Privacy Policy', to: '/privicypolicy' },
              { name: 'Terms of Service', to: '/termsandservices' },
            ].map((item, index) => (
              <li key={index}>
                <Link to={item.to} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-white mb-6">Get in Touch</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaPhone className="w-3 h-3 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Phone</p>
                <p className="text-sm text-gray-400">+91 93073 42318</p>
                <p className="text-sm text-gray-400">+1 123 456 7890</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaEnvelope className="w-3 h-3 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Email</p>
                <p className="text-sm text-gray-400">contact@riveto.com</p>
                <p className="text-sm text-gray-400">support@riveto.com</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaMapMarkerAlt className="w-3 h-3 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Address</p>
                <p className="text-sm text-gray-400">123 lorem ipsum Street</p>
                <p className="text-sm text-gray-400">lorem2, ipsum3, 10001</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
              <p className="text-sm text-gray-400">Subscribe to our newsletter for exclusive offers and updates</p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {currentYear} <span className="text-cyan-400 font-medium">RIVETO</span> — All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Cookie Policy</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Made with</span>
            <FaHeart className="text-rose-500 animate-pulse" />
            <span>for our customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;