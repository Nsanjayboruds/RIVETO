import React, { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaInstagram, FaPaperPlane, FaUser, FaComment } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Floating background animation
    gsap.to(".floating-bg-1", {
      y: -30,
      x: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".floating-bg-2", {
      y: 25,
      x: -15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".floating-bg-3", {
      y: -20,
      x: -25,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Title animation
    gsap.fromTo(".contact-title",
      { opacity: 0, y: -30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }
    );

    // Contact sections animation
    gsap.fromTo(".contact-section",
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Contact cards staggered animation
    gsap.fromTo(".contact-card",
      { opacity: 0, y: 40, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".contact-cards-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(cardRef.current,
      { scale: 0.8, opacity: 0, rotation: -5 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Form fields animation
    gsap.fromTo(".form-field",
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <FaPhone className="w-5 h-5" />,
      title: "Phone",
      content: "+91-9307342318",
      subContent: "+1-234-567-8900",
      color: "from-emerald-400 via-green-500 to-teal-600",
      hoverBg: "group-hover:bg-gradient-to-br group-hover:from-emerald-500/10 group-hover:to-teal-500/5",
      iconGlow: "group-hover:shadow-emerald-400/60",
      borderGlow: "hover:border-emerald-500/40",
      textGlow: "group-hover:text-emerald-300"
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email",
      content: "admin@riveto.com",
      subContent: "support@riveto.com",
      color: "from-blue-400 via-cyan-500 to-sky-600",
      hoverBg: "group-hover:bg-gradient-to-br group-hover:from-cyan-500/10 group-hover:to-blue-500/5",
      iconGlow: "group-hover:shadow-cyan-400/60",
      borderGlow: "hover:border-cyan-500/40",
      textGlow: "group-hover:text-cyan-300"
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Address",
      content: "123 lorem ipsum Street",
      subContent: "lorem2, ipsum3, 10001",
      color: "from-rose-400 via-pink-500 to-fuchsia-600",
      hoverBg: "group-hover:bg-gradient-to-br group-hover:from-pink-500/10 group-hover:to-rose-500/5",
      iconGlow: "group-hover:shadow-pink-400/60",
      borderGlow: "hover:border-pink-500/40",
      textGlow: "group-hover:text-pink-300"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM",
      subContent: "Sat: 10AM - 4PM",
      color: "from-amber-400 via-orange-500 to-red-600",
      hoverBg: "group-hover:bg-gradient-to-br group-hover:from-orange-500/10 group-hover:to-amber-500/5",
      iconGlow: "group-hover:shadow-orange-400/60",
      borderGlow: "hover:border-orange-500/40",
      textGlow: "group-hover:text-orange-300"
    }
  ];

  const socialLinks = [
    { icon: <FaInstagram className="w-5 h-5" />, label: "Instagram", color: "from-pink-500 via-rose-500 to-orange-400", ringColor: "hover:ring-pink-500/50", glowColor: "hover:shadow-pink-500/40" },
    { icon: <FaTwitter className="w-5 h-5" />, label: "Twitter", color: "from-blue-400 via-sky-500 to-cyan-400", ringColor: "hover:ring-sky-500/50", glowColor: "hover:shadow-sky-500/40" },
    { icon: <FaLinkedin className="w-5 h-5" />, label: "LinkedIn", color: "from-blue-600 via-blue-500 to-indigo-500", ringColor: "hover:ring-blue-500/50", glowColor: "hover:shadow-blue-500/40" }
  ];

  return (
    <>
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-950 dark:via-[#0a1628] dark:to-[#0c3a5e] pt-24 pb-20 overflow-x-hidden relative'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="floating-bg-1 absolute -top-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="floating-bg-2 absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="floating-bg-3 absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-emerald-500/8 via-teal-500/5 to-transparent rounded-full blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Animated particles */}
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="contact-title text-center mb-16">
          <Title text1="GET IN" text2="TOUCH" />
          <p className="text-lg text-slate-600 dark:text-cyan-100/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out to us through any of these channels.
          </p>
          <div className="flex justify-center mt-4">
            <HiSparkles className="w-6 h-6 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="contact-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className={`contact-card group relative bg-gradient-to-br from-white/95 to-slate-100/90 dark:from-gray-800/90 dark:to-gray-900/95 p-6 rounded-2xl border border-slate-200 dark:border-gray-700/50 backdrop-blur-sm cursor-pointer
                    transition-all duration-500 ease-out
                    hover:scale-[1.05] hover:-translate-y-3 ${item.borderGlow}
                    hover:shadow-2xl hover:shadow-black/30 ${item.hoverBg}
                    ${hoveredCard === index ? 'ring-2 ring-white/10' : ''}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated gradient border effect */}
                  <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10`}></div>

                  {/* Inner glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.08] transition-all duration-700`}></div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shimmer"></div>
                  </div>

                  {/* Icon with animated glow */}
                  <div className={`relative w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white
                    shadow-lg transition-all duration-500
                    group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-2xl ${item.iconGlow}`}>
                    <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/20 transition-all duration-300"></div>
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-50 blur-md transition-all duration-500`}></div>
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  </div>

                  <h3 className={`text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-all duration-300 ${item.textGlow}`}>{item.title}</h3>
                  <p className="text-cyan-700 dark:text-cyan-300/90 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-all duration-300">{item.content}</p>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-all duration-300">{item.subContent}</p>

                  {/* Corner decorations */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${item.color} opacity-0 group-hover:opacity-[0.07] rounded-tr-2xl rounded-bl-[100px] transition-all duration-700`}></div>
                  <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${item.color} opacity-0 group-hover:opacity-[0.05] rounded-bl-2xl rounded-tr-[60px] transition-all duration-700 delay-100`}></div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="contact-section group/social bg-gradient-to-br from-white/95 to-slate-100/90 dark:from-gray-800/90 dark:to-gray-900/95 p-6 rounded-2xl border border-slate-200 dark:border-gray-700/50 backdrop-blur-sm
              hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10
              hover:bg-gradient-to-br hover:from-slate-100/95 hover:to-purple-100/40 dark:hover:from-gray-800/95 dark:hover:to-purple-900/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 group-hover/social:text-purple-700 dark:group-hover/social:text-purple-100 transition-colors duration-300">
                Follow Us
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`group relative w-14 h-14 bg-gradient-to-br from-slate-200/90 to-slate-300/70 dark:from-gray-700/80 dark:to-gray-800/90 rounded-xl flex items-center justify-center
                      transition-all duration-500 ease-out hover:scale-125 hover:-translate-y-2 hover:rotate-6
                      hover:shadow-2xl ${social.glowColor}
                      overflow-hidden border border-slate-300/70 dark:border-gray-600/50 hover:border-transparent
                      hover:ring-2 ${social.ringColor}`}
                    aria-label={social.label}
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-100 transition-all duration-400 scale-0 group-hover:scale-100`}></div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <span className="relative z-10 text-slate-600 dark:text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-lg">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-section">
            <div className="group/form relative bg-gradient-to-br from-white/95 to-slate-100/90 dark:from-gray-800/90 dark:to-gray-900/95 p-8 rounded-2xl border border-slate-200 dark:border-gray-700/50 backdrop-blur-sm
              hover:border-cyan-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden
              hover:bg-gradient-to-br hover:from-slate-100/95 hover:to-cyan-100/40 dark:hover:from-gray-800/95 dark:hover:to-cyan-900/10">

              {/* Animated gradient border */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover/form:opacity-60 transition-opacity duration-700 blur-sm -z-10"></div>

              {/* Form background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-bl-[120px] pointer-events-none transition-all duration-700 group-hover/form:from-cyan-400/20 group-hover/form:w-56 group-hover/form:h-56"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent rounded-tr-[100px] pointer-events-none transition-all duration-700 group-hover/form:from-purple-400/20 group-hover/form:w-48 group-hover/form:h-48"></div>

              {/* Floating particles */}
              <div className="absolute top-10 right-20 w-2 h-2 bg-cyan-400/60 rounded-full opacity-0 group-hover/form:opacity-100 group-hover/form:animate-ping transition-opacity duration-500"></div>
              <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-purple-400/60 rounded-full opacity-0 group-hover/form:opacity-100 group-hover/form:animate-pulse transition-opacity duration-500 delay-200"></div>

              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 group-hover/form:text-cyan-700 dark:group-hover/form:text-cyan-50 transition-colors duration-300">
                Send us a Message
                <FaPaperPlane className="w-5 h-5 text-cyan-400 animate-bounce group-hover/form:text-cyan-300 group-hover/form:drop-shadow-lg group-hover/form:drop-shadow-cyan-400/50" />
              </h3>

              {isSubmitted ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4
                    animate-pulse shadow-xl shadow-green-500/30 ring-2 ring-green-400/30">
                    <FaPaperPlane className="w-12 h-12 text-green-400 drop-shadow-lg" />
                  </div>
                  <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                  <p className="text-slate-600 dark:text-gray-300">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="form-field relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 group-hover/input:text-slate-700 dark:group-hover/input:text-gray-300 transition-all duration-300 group-focus-within/input:scale-110">
                      <FaUser className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-700/60 border-2 border-slate-300 dark:border-gray-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400
                        focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:shadow-lg focus:shadow-cyan-500/20
                        transition-all duration-400 hover:border-slate-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-700/70 hover:shadow-md"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 group-focus-within/input:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <div className="form-field relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 group-focus-within/input:text-blue-500 dark:group-focus-within/input:text-blue-400 group-hover/input:text-slate-700 dark:group-hover/input:text-gray-300 transition-all duration-300 group-focus-within/input:scale-110">
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-700/60 border-2 border-slate-300 dark:border-gray-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400
                        focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:shadow-lg focus:shadow-blue-500/20
                        transition-all duration-400 hover:border-slate-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-700/70 hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="form-field relative group/input">
                    <div className="absolute left-4 top-4 text-slate-500 dark:text-gray-400 group-focus-within/input:text-purple-500 dark:group-focus-within/input:text-purple-400 group-hover/input:text-slate-700 dark:group-hover/input:text-gray-300 transition-all duration-300 group-focus-within/input:scale-110">
                      <FaComment className="w-5 h-5" />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows="5"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-700/60 border-2 border-slate-300 dark:border-gray-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400
                        focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:shadow-lg focus:shadow-purple-500/20
                        transition-all duration-400 resize-none hover:border-slate-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-700/70 hover:shadow-md"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="form-field group/btn w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600
                      text-white font-semibold py-4 px-6 rounded-xl
                      transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/40
                      flex items-center justify-center gap-3
                      hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500
                      active:scale-95 active:shadow-inner"
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    {/* Glow ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-xl opacity-0 group-hover/btn:opacity-50 blur-md transition-opacity duration-500"></div>

                    <span className="relative z-10 flex items-center gap-2">
                      <FaPaperPlane className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 group-hover/btn:rotate-12 transition-all duration-500" />
                      Send Message
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CardSwap Component */}
        <div ref={cardRef} className="contact-section text-center mb-20">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center justify-center gap-3">
            Our Team in Action
            <span className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></span>
          </h3>
          <div className="flex justify-center">
            {/* CardSwap placeholder */}
          </div>
        </div>


        {/* <div className="contact-section bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Visit Our Office</h3>
              <p className="text-gray-300 mb-6">
                Come see us in person! Our friendly team is ready to welcome you and discuss how we can help with your needs.
              </p>
              <div className="space-y-2">
                <p className="text-cyan-300 font-medium">123 Commerce Street</p>
                <p className="text-cyan-300 font-medium">Business District, 10001</p>
                <p className="text-gray-400">Free parking available</p>
              </div>
            </div>
            <div className="bg-gray-700 min-h-[300px] flex items-center justify-center">
              <div className="text-center p-8">
                <FaMapMarkerAlt className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-gray-300">Interactive map would be displayed here</p>
                <button className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10">
        <NewsletterBox />
      </div>
    </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Contact;
