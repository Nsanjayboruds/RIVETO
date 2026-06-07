import { useState, useRef } from 'react';
import { FaCheckCircle, FaClock, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhone } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import NewsletterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sectionRef = useRef(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white dark:bg-[#0b1220] pt-24 pb-20 overflow-x-hidden relative">
        <div
          ref={sectionRef}
          className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10"
        >
          {/* Customer Support Center Hero */}
          <div className="contact-title text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Customer Support Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6">
              Our support team is available to assist with orders, product
              inquiries, and account management. Select your preferred contact
              method below.
            </p>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg">
                <FaClock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Avg. Response: 2 hours
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg">
                <FaCheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  98% Satisfaction Rate
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg">
                <HiSparkles className="w-4 h-4 text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  24/7 Email Support
                </span>
              </div>
            </div>
          </div>

          {/* Contact Methods Slab */}
          <div className="mb-16 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-[#1f2a44]">
              {/* Phone */}
              <div className="p-6 hover:bg-gray-100 dark:hover:bg-[#111c33] transition-colors duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-lg flex items-center justify-center mb-3">
                    <FaPhone className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Phone
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    +91-9307342318
                  </p>
                  <p className="text-gray-500 text-sm">Mon-Fri 9AM-6PM</p>
                </div>
              </div>

              {/* Email */}
              <div className="p-6 hover:bg-gray-100 dark:hover:bg-[#111c33] transition-colors duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-lg flex items-center justify-center mb-3">
                    <FaEnvelope className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    admin@riveto.com
                  </p>
                  <p className="text-gray-500 text-sm">24/7 Support</p>
                </div>
              </div>

              {/* Address */}
              <div className="p-6 hover:bg-gray-100 dark:hover:bg-[#111c33] transition-colors duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-lg flex items-center justify-center mb-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Visit Us
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    123 lorem ipsum Street
                  </p>
                  <p className="text-gray-500 text-sm">lorem2, ipsum3, 10001</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-6 hover:bg-gray-100 dark:hover:bg-[#111c33] transition-colors duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-lg flex items-center justify-center mb-3">
                    <FaClock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Hours
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    Mon - Fri: 9AM - 6PM
                  </p>
                  <p className="text-gray-500 text-sm">Sat: 10AM - 4PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Panel */}
          <div className="mb-20">
            <div className="max-w-6xl mx-auto bg-gray-50 dark:bg-[#111c33] border border-gray-200 dark:border-[#1f2a44] rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Left: Support Topics */}
                <div className="lg:border-r border-gray-200 dark:border-[#1f2a44] p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    How can we help?
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Order Status & Tracking',
                      'Product Information',
                      'Returns & Exchanges',
                      'Account Management',
                      'Technical Support',
                      'General Inquiry',
                    ].map((topic) => (
                      <button
                        key={topic}
                        className="w-full text-left px-4 py-3 bg-white dark:bg-[#0f172a] hover:bg-gray-100 dark:hover:bg-[#1a2332] border border-gray-200 dark:border-[#1f2a44] rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-blue-500/40 transition-all duration-200"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="lg:col-span-2 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Submit a Request
                  </h3>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Request Submitted
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        We'll respond to your inquiry within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="form-field">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Full Name"
                          className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Describe your inquiry..."
                          rows="6"
                          className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#1f2a44] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="form-field w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-[#111c33]"
                      >
                        <FaPaperPlane className="w-4 h-4" />
                        Submit Request
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
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
