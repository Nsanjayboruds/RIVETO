import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { 
  FaShieldAlt, 
  FaUserCheck, 
  FaLock, 
  FaMoneyBillWave, 
  FaCopyright, 
  FaExclamationTriangle,
  FaEdit,
  FaEnvelope,
  FaGithub,
  FaCheckCircle,
  FaArrowRight,
  FaFileContract
} from "react-icons/fa";

const sections = [
  {
    id: "introduction",
    icon: <FaFileContract className="text-3xl" />,
    title: "Introduction",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Welcome to <span className="text-cyan-400 font-semibold">RIVETO</span>, your trusted e-commerce platform. 
          These Terms and Services govern your use of our website and services.
        </p>
        <div className="bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300/60 dark:border-cyan-500/30 rounded-xl p-4">
          <p className="text-cyan-700 dark:text-cyan-200">
            By accessing or using our platform, you agree to be bound by these terms. 
            Please read them carefully before proceeding.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "use-of-service",
    icon: <FaUserCheck className="text-3xl" />,
    title: "Use of Service",
    content: (
      <div className="space-y-4">
        <p>
          You agree to use our services only for lawful purposes and in accordance with these Terms.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Must be at least 18 years old",
            "Maintain account security",
            "No illegal activities",
            "Respect intellectual property"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-100 dark:bg-gray-700/30 p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700/50 transition-all duration-300">
              <FaCheckCircle className="text-green-400 mt-1 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "privacy-policy",
    icon: <FaLock className="text-3xl" />,
    title: "Privacy Policy",
    content: (
      <div className="space-y-4">
        <p>
          Your privacy is our top priority. We implement industry-standard security measures 
          to protect your personal information.
        </p>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-purple-300 mb-3">What we collect:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Personal identification information</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Payment and transaction data</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Browsing behavior and preferences</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "payment-terms",
    icon: <FaMoneyBillWave className="text-3xl" />,
    title: "Payment Terms",
    content: (
      <div className="space-y-4">
        <p>
          All payments are processed securely through our trusted payment partners including 
          <span className="text-cyan-400 font-semibold"> Razorpay</span>.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Currency", value: "INR (₹)", color: "cyan" },
            { label: "Payment Methods", value: "Card, UPI, Net Banking", color: "green" },
            { label: "Processing Time", value: "Instant", color: "yellow" },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10 border border-${item.color}-500/30 rounded-xl p-4 text-center`}>
              <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">{item.label}</p>
              <p className={`text-${item.color}-300 font-semibold`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "intellectual-property",
    icon: <FaCopyright className="text-3xl" />,
    title: "Intellectual Property",
    content: (
      <div className="space-y-4">
        <p>
          All content, trademarks, logos, and other intellectual property on this platform 
          are owned by <span className="text-cyan-400 font-semibold">RIVETO</span> or its licensors.
        </p>
        <div className="bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <FaExclamationTriangle className="text-red-400 text-xl mt-1 shrink-0" />
          <p className="text-red-700 dark:text-red-200">
            Unauthorized use, reproduction, or distribution of any content is strictly prohibited 
            and may result in legal action.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "limitation-liability",
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Limitation of Liability",
    content: (
      <div className="space-y-4">
        <p>
          RIVETO shall not be liable for any indirect, incidental, special, consequential, 
          or punitive damages resulting from your use or inability to use the service.
        </p>
        <div className="bg-orange-100 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-xl p-4">
          <p className="text-orange-700 dark:text-orange-200">
            This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "changes-to-terms",
    icon: <FaEdit className="text-3xl" />,
    title: "Changes to Terms",
    content: (
      <div className="space-y-4">
        <p>
          We reserve the right to modify these terms at any time. Material changes will be 
          communicated through email or prominent notice on our platform.
        </p>
        <div className="bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-700 dark:text-blue-200">
            Continued use of our services after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    ),
  },
];

const TableOfContents = ({ activeSection, onSectionClick }) => (
  <div className="lg:sticky lg:top-28 bg-white/85 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <FaFileContract className="text-cyan-400" />
      Quick Navigation
    </h3>
    <nav className="space-y-2">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
            activeSection === section.id
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
              : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <span className={`text-sm ${activeSection === section.id ? "text-white" : "text-cyan-400"}`}>
            {section.icon}
          </span>
          <span className="text-sm font-medium">{section.title}</span>
          {activeSection === section.id && <FaArrowRight className="ml-auto text-sm" />}
        </button>
      ))}
    </nav>
  </div>
);

const Section = ({ section, isActive }) => (
  <section 
    id={section.id}
    className={`scroll-mt-28 transform transition-all duration-500 ${
      isActive ? "scale-100 opacity-100" : "scale-95 opacity-90"
    }`}
  >
    <div className={`bg-white/85 dark:bg-gray-800/30 rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
      isActive ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10" : "border-slate-200 dark:border-gray-700"
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          isActive 
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" 
            : "bg-slate-200 dark:bg-gray-700/50 text-cyan-500 dark:text-cyan-400"
        }`}>
          {section.icon}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
          <div className={`h-1 w-20 rounded-full mt-2 transition-all duration-300 ${
            isActive ? "bg-cyan-400" : "bg-slate-400 dark:bg-gray-600"
          }`}></div>
        </div>
      </div>
      <div className="text-slate-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
        {section.content}
      </div>
    </div>
  </section>
);

const TermsAndServices = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Hero Header */}
        <div className="mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
          <div className="relative bg-white/85 dark:bg-gray-800/50 rounded-3xl backdrop-blur-md border border-slate-200 dark:border-gray-700 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-4">
                  Legal Document
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                  Terms & Services
                </h1>
                <p className="text-slate-600 dark:text-gray-400 text-lg">
                  Last updated: <span className="text-cyan-400 font-semibold">February 4, 2026</span>
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl p-6 border border-cyan-500/30">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-gray-300 text-sm mb-2">Total Sections</p>
                  <p className="text-4xl font-bold text-cyan-400">{sections.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block w-80">
            <TableOfContents activeSection={activeSection} onSectionClick={scrollToSection} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {sections.map((section) => (
              <Section 
                key={section.id} 
                section={section} 
                isActive={activeSection === section.id}
              />
            ))}

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-white to-slate-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-gray-700 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
                  <FaEnvelope className="text-3xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Get In Touch</h2>
                  <div className="h-1 w-20 bg-cyan-400 rounded-full mt-2"></div>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-gray-300 text-lg mb-6">
                Have questions about our Terms and Services? We're here to help.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="mailto:support@riveto.com"
                  className="group bg-slate-100 dark:bg-gray-700/30 hover:bg-slate-200 dark:hover:bg-gray-700/50 rounded-xl p-6 border border-slate-300 dark:border-gray-600 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500 transition-all duration-300">
                      <FaEnvelope className="text-2xl text-cyan-400 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-gray-400 text-sm">Email Us</p>
                      <p className="text-slate-900 dark:text-white font-semibold">nishantborude555@gmail.com</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/Nsanjayboruds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-slate-100 dark:bg-gray-700/30 hover:bg-slate-200 dark:hover:bg-gray-700/50 rounded-xl p-6 border border-slate-300 dark:border-gray-600 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500 transition-all duration-300">
                      <FaGithub className="text-2xl text-cyan-400 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-gray-400 text-sm">GitHub</p>
                      <p className="text-slate-900 dark:text-white font-semibold">@Nsanjayboruds</p>
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
    
  );
};

export default TermsAndServices;