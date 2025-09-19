import React, { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewLetterBox';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaInstagram, FaPaperPlane, FaUser, FaComment } from 'react-icons/fa';
// import CardSwap, { Card } from '../components/CardSwap';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Animations
    gsap.fromTo(".contact-section",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
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
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email",
      content: "admin@riveto.com",
      subContent: "support@riveto.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Address",
      content: "123 lorem ipsum Street",
      subContent: "lorem2, ipsum3, 10001",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM",
      subContent: "Sat: 10AM - 4PM",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, label: "Instagram", color: "hover:bg-pink-600" },
    { icon: <FaTwitter />, label: "Twitter", color: "hover:bg-blue-400" },
    { icon: <FaLinkedin />, label: "LinkedIn", color: "hover:bg-blue-600" }
  ];

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 overflow-x-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Title text1="GET IN" text2="TOUCH" />
          <p className="text-lg text-cyan-100 mt-4 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us through any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-section bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-cyan-300 font-medium">{item.content}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.subContent}</p>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="contact-section bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-section">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPaperPlane className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <FaUser className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <FaComment className="w-5 h-5" />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows="5"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CardSwap Component */}
        <div ref={cardRef} className="contact-section text-center mb-20">
          <h3 className="text-2xl font-bold text-white mb-8">Our Team in Action</h3>
          <div className="flex justify-center">
            {/* <div className="w-80 h-80 relative">
              <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={5000}
                pauseOnHover={true}
              >
                <Card>
                  <img 
                    src="https://i.pinimg.com/1200x/55/1f/78/551f78b5898b5dd5d1c8f5439910da21.jpg" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </Card>
                <Card>
                  <img 
                    src="https://i.pinimg.com/1200x/18/b6/9c/18b69ce65b153cd2e1fed976fe60a1f1.jpg" 
                    alt="Customer service" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </Card>
                <Card>
                  <img 
                    src="https://i.pinimg.com/736x/51/3c/f7/513cf7a010651bad3f639c2f594aa58a.jpg" 
                    alt="Office environment" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </Card>
              </CardSwap>
            </div> */}
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
  );
}

export default Contact;