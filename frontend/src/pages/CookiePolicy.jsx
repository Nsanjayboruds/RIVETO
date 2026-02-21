import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { 
  FaCookie, 
  FaShieldAlt, 
  FaCog, 
  FaUserCog, 
  FaCheckCircle,
  FaArrowRight,
  FaInfoCircle,
  FaChartLine,
  FaLock,
  FaExclamationTriangle
} from "react-icons/fa";

const sections = [
  {
    id: "introduction",
    icon: <FaCookie className="text-3xl" />,
    title: "What Are Cookies?",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Cookies are small text files that are placed on your device when you visit <span className="text-cyan-400 font-semibold">RIVETO</span>. 
          They help us provide you with a better, faster, and safer experience.
        </p>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-cyan-200">
            By using our website, you consent to our use of cookies in accordance with this Cookie Policy. 
            You can manage your cookie preferences at any time.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "types-of-cookies",
    icon: <FaInfoCircle className="text-3xl" />,
    title: "Types of Cookies We Use",
    content: (
      <div className="space-y-4">
        <p>
          We use different types of cookies to ensure optimal performance and user experience:
        </p>
        <div className="grid gap-4">
          {[
            {
              title: "Essential Cookies",
              description: "Required for the website to function properly. These enable core functionality like security, authentication, and shopping cart.",
              color: "green"
            },
            {
              title: "Performance Cookies",
              description: "Help us understand how visitors interact with our website by collecting anonymous information.",
              color: "blue"
            },
            {
              title: "Functional Cookies",
              description: "Remember your preferences and choices (like language, region, or theme) to provide enhanced features.",
              color: "purple"
            },
            {
              title: "Targeting/Advertising Cookies",
              description: "Track your browsing habits to deliver relevant ads and measure campaign effectiveness.",
              color: "pink"
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-r from-${item.color}-500/10 to-${item.color}-600/10 border border-${item.color}-500/30 rounded-xl p-5 hover:border-${item.color}-400/50 transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <FaCheckCircle className={`text-${item.color}-400 mt-1 flex-shrink-0`} />
                <div>
                  <h4 className={`font-semibold text-lg text-${item.color}-300 mb-2`}>{item.title}</h4>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "why-we-use",
    icon: <FaChartLine className="text-3xl" />,
    title: "Why We Use Cookies",
    content: (
      <div className="space-y-4">
        <p>
          Cookies help us improve your shopping experience and website performance:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Keep you logged in during your session",
            "Remember items in your shopping cart",
            "Understand your preferences and settings",
            "Analyze website traffic and performance",
            "Personalize content and recommendations",
            "Improve website security and fraud prevention",
            "Enable social media features",
            "Deliver relevant advertisements"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <FaArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "third-party",
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Third-Party Cookies",
    content: (
      <div className="space-y-4">
        <p>
          We may use third-party services that set cookies on our website to provide enhanced functionality:
        </p>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-orange-300 mb-3">Third-party services include:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span><strong>Analytics:</strong> Google Analytics for website performance tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span><strong>Payment Processors:</strong> Stripe, PayPal, and Razorpay for secure transactions</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span><strong>Social Media:</strong> Facebook, Twitter, Instagram integration</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span><strong>Advertising Networks:</strong> Google Ads and other ad platforms</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">
          Please note that we do not control these third-party cookies. We recommend reviewing their privacy policies.
        </p>
      </div>
    ),
  },
  {
    id: "manage-cookies",
    icon: <FaCog className="text-3xl" />,
    title: "Managing Your Cookie Preferences",
    content: (
      <div className="space-y-4">
        <p>
          You have full control over cookies. Here's how you can manage them:
        </p>
        
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-cyan-300 mb-4">Browser Settings</h4>
          <p className="mb-4">Most web browsers allow you to control cookies through their settings:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
              <span><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
              <span><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
              <span><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
              <span><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
          <FaExclamationTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <h5 className="font-semibold text-yellow-300 mb-2">Important Note</h5>
            <p className="text-gray-300">
              If you disable cookies, some features of our website may not function properly. 
              You may experience limited functionality, especially with the shopping cart and checkout process.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "user-choices",
    icon: <FaUserCog className="text-3xl" />,
    title: "Your Choices & Controls",
    content: (
      <div className="space-y-4">
        <p>
          You have several options to control how cookies are used on your device:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
            <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <FaCookie className="text-cyan-400" />
              Accept All Cookies
            </h4>
            <p className="text-sm text-gray-300">
              Allow all cookies for the best user experience, including personalized content and recommendations.
            </p>
          </div>

          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
            <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
              <FaCog className="text-orange-400" />
              Manage Preferences
            </h4>
            <p className="text-sm text-gray-300">
              Choose which types of cookies you want to accept. Essential cookies cannot be disabled.
            </p>
          </div>

          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
            <h4 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-400" />
              Reject Non-Essential
            </h4>
            <p className="text-sm text-gray-300">
              Only allow essential cookies needed for basic website functionality. This may limit features.
            </p>
          </div>

          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
            <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <FaLock className="text-purple-400" />
              Do Not Track
            </h4>
            <p className="text-sm text-gray-300">
              Enable "Do Not Track" in your browser settings to signal your privacy preferences.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "updates",
    icon: <FaArrowRight className="text-3xl" />,
    title: "Policy Updates",
    content: (
      <div className="space-y-4">
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices.
        </p>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-blue-300 mb-3">Stay Informed</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Check this page regularly for updates</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Last updated: February 2026</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Major changes will be communicated via email</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">
          Continued use of our website after changes constitutes acceptance of the updated Cookie Policy.
        </p>
      </div>
    ),
  }
];

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-cyan-500/30 animate-bounce-slow">
              <FaCookie className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn about how we use cookies to improve your experience on <span className="text-cyan-400 font-semibold">RIVETO</span>
            </p>
            <div className="mt-6 text-sm text-gray-400">
              Last Updated: February 18, 2026
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                <FaInfoCircle />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    <span className={activeSection === section.id ? "text-white" : "text-cyan-400"}>
                      {section.icon}
                    </span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="space-y-12">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-xl hover:border-cyan-500/30 transition-all duration-500 scroll-mt-24"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
                      <span className="text-cyan-400">{section.icon}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="text-gray-300 leading-relaxed">{section.content}</div>
                </section>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <FaInfoCircle className="text-purple-400" />
                Questions About Cookies?
              </h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about our Cookie Policy or how we handle your data, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                >
                  Contact Us
                  <FaArrowRight />
                </a>
                <a
                  href="/privicypolicy"
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaLock />
                  Privacy Policy
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
