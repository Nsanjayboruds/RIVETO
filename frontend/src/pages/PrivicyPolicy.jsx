import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaLock, 
  FaCookie, 
  FaDatabase, 
  FaUserCog,
  FaGavel,
  FaEnvelope,
  FaGithub,
  FaArrowRight,
  FaFile,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const sections = [
  {
    id: "information-we-collect",
    icon: <FaDatabase className="text-3xl" />,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          We collect various types of information to provide and improve our services to you.
        </p>
        
        <div className="space-y-4">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-lg text-cyan-300 mb-3 flex items-center gap-2">
              <FaUserShield className="text-xl" />
              Personal Information
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span>Name, email address, and contact information</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span>Account credentials and authentication data</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span>Billing and payment information</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-lg text-purple-300 mb-3">Usage Data</h4>
            <ul className="space-y-2 text-slate-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Browsing behavior and interaction patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Device information and IP addresses</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Browser type, operating system, and timestamps</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "how-we-use-information",
    icon: <FaUserCog className="text-3xl" />,
    title: "How We Use Your Information",
    content: (
      <div className="space-y-4">
        <p>
          Your information helps us provide, maintain, and improve our services in the following ways:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Process transactions and orders",
            "Provide customer support",
            "Send important updates and notifications",
            "Improve user experience and features",
            "Prevent fraud and enhance security",
            "Analyze usage patterns and trends"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-100 dark:bg-gray-700/30 p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700/50 transition-all duration-300">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
              <span className="text-slate-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "data-protection",
    icon: <FaLock className="text-3xl" />,
    title: "Data Protection & Security",
    content: (
      <div className="space-y-4">
        <p>
          We implement robust security measures to protect your personal information from unauthorized access, 
          alteration, disclosure, or destruction.
        </p>
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-green-300 mb-4">Our Security Measures:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-300">
                <FaShieldAlt />
                <span className="font-semibold">SSL Encryption</span>
              </div>
              <p className="text-slate-700 dark:text-gray-300 text-sm">All data transmitted is encrypted using industry-standard SSL/TLS protocols.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-300">
                <FaLock />
                <span className="font-semibold">Secure Storage</span>
              </div>
              <p className="text-slate-700 dark:text-gray-300 text-sm">Your data is stored in secure, encrypted databases with restricted access.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-300">
                <FaUserShield />
                <span className="font-semibold">Access Control</span>
              </div>
              <p className="text-slate-700 dark:text-gray-300 text-sm">Strict authentication and authorization protocols protect your account.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-300">
                <FaCheckCircle />
                <span className="font-semibold">Regular Audits</span>
              </div>
              <p className="text-slate-700 dark:text-gray-300 text-sm">We conduct regular security audits and updates to maintain protection.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "cookies-tracking",
    icon: <FaCookie className="text-3xl" />,
    title: "Cookies & Tracking",
    content: (
      <div className="space-y-4">
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience 
          and analyze site usage.
        </p>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-orange-300 mb-3">Types of Cookies We Use:</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div>
                <p className="font-semibold text-orange-200">Essential Cookies</p>
                <p className="text-slate-700 dark:text-gray-300 text-sm">Required for basic site functionality and security.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div>
                <p className="font-semibold text-orange-200">Analytics Cookies</p>
                <p className="text-slate-700 dark:text-gray-300 text-sm">Help us understand how visitors interact with our site.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div>
                <p className="font-semibold text-orange-200">Preference Cookies</p>
                <p className="text-slate-700 dark:text-gray-300 text-sm">Remember your settings and preferences for a personalized experience.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          You can manage cookie preferences through your browser settings. Note that disabling certain 
          cookies may impact site functionality.
        </p>
      </div>
    ),
  },
  {
    id: "data-sharing",
    icon: <FaUserShield className="text-3xl" />,
    title: "Data Sharing & Third Parties",
    content: (
      <div className="space-y-4">
        <p>
          We do not sell your personal information. We may share data with trusted third parties only 
          in specific circumstances:
        </p>
        <div className="space-y-3">
          {[
            {
              title: "Service Providers",
              description: "Payment processors (Razorpay), cloud storage (Cloudinary), and analytics tools that help us operate our platform.",
              color: "blue"
            },
            {
              title: "Legal Requirements",
              description: "When required by law, regulation, or legal process to protect our rights or comply with authorities.",
              color: "yellow"
            },
            {
              title: "Business Transfers",
              description: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.",
              color: "purple"
            }
          ].map((item, i) => (
            <div key={i} className={`bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg p-4`}>
              <h5 className={`font-semibold text-${item.color}-300 mb-2`}>{item.title}</h5>
              <p className="text-slate-700 dark:text-gray-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "your-rights",
    icon: <FaGavel className="text-3xl" />,
    title: "Your Rights & Choices",
    content: (
      <div className="space-y-4">
        <p>
          You have control over your personal information and can exercise the following rights:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "👁️", title: "Access", desc: "Request a copy of your personal data" },
            { icon: "✏️", title: "Correction", desc: "Update or correct inaccurate information" },
            { icon: "🗑️", title: "Deletion", desc: "Request deletion of your account and data" },
            { icon: "📥", title: "Portability", desc: "Export your data in a portable format" },
            { icon: "🚫", title: "Object", desc: "Opt-out of certain data processing activities" },
            { icon: "⏸️", title: "Restriction", desc: "Limit how we process your information" }
          ].map((item, i) => (
            <div key={i} className="bg-slate-100 dark:bg-gray-700/30 rounded-lg p-5 hover:bg-slate-200 dark:hover:bg-gray-700/50 transition-all duration-300">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h5 className="font-semibold text-cyan-300 mb-1">{item.title}</h5>
              <p className="text-slate-700 dark:text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300/60 dark:border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
          <FaExclamationCircle className="text-cyan-400 text-xl mt-1 flex-shrink-0" />
          <p className="text-cyan-700 dark:text-cyan-200">
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:nishantborude555@gmail.com" className="font-semibold underline hover:text-cyan-300">
              nishantborude555@gmail.com
            </a>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "policy-updates",
    icon: <FaFile className="text-3xl" />,
    title: "Policy Updates",
    content: (
      <div className="space-y-4">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, 
          technology, legal requirements, or other factors.
        </p>
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-lg text-blue-300 mb-3">How We Notify You:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Email notification for significant changes</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Prominent notice on our website</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Updated "Last Modified" date at the top of this page</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Continued use of our services after policy updates constitutes acceptance of the changes.
        </p>
      </div>
    ),
  },
];

const TableOfContents = ({ activeSection, onSectionClick }) => (
  <div className="lg:sticky lg:top-28 bg-white/85 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <FaFile className="text-cyan-400" />
      Quick Navigation
    </h3>
    <nav className="space-y-2">
      {sections.map((section) => (
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

const PrivicyPolicy = () => {
  const [activeSection, setActiveSection] = useState("information-we-collect");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-1">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Hero Header */}
        <div className="mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl"></div>
          <div className="relative bg-white/85 dark:bg-gray-800/50 rounded-3xl backdrop-blur-md border border-slate-200 dark:border-gray-700 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-block px-4 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-4">
                  Your Privacy Matters
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-500 to-cyan-600 dark:from-green-400 dark:to-cyan-500 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-slate-600 dark:text-gray-400 text-lg">
                  Last updated: <span className="text-cyan-400 font-semibold">February 4, 2026</span>
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl p-6 border border-green-500/30">
                <div className="text-center">
                  <FaShieldAlt className="text-5xl text-green-400 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-gray-300 text-sm">Protected & Secure</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Questions About Privacy?</h2>
                  <div className="h-1 w-20 bg-cyan-400 rounded-full mt-2"></div>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-gray-300 text-lg mb-6">
                If you have any questions or concerns about our Privacy Policy, please don't hesitate to reach out.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="mailto:nishantborude555@gmail.com"
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
  )
}

export default PrivicyPolicy;