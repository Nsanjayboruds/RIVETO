import React from 'react'
import { FaHeart, FaExchangeAlt, FaBan, FaFileAlt, FaCreditCard, FaEnvelope } from "react-icons/fa";
import Footer from '../components/Footer';


const faqPage = () => {

const faqs = [
  {
    question: "What is RIVETO?",
    answer:
      "RIVETO is a platform that helps users track, manage, and understand their crypto assets with simple tools, clean insights, and a user-friendly experience.",
    icon: FaHeart,
  },
  {
    question: "Is RIVETO free to use?",
    answer:
      "Yes, RIVETO offers free features for basic usage. Some advanced tools and premium features may require a paid plan in the future.",
    icon: FaExchangeAlt,
  },
  {
    question: "Is my data safe on RIVETO?",
    answer:
      "Absolutely. We follow strong security practices and never share your personal data. Your privacy and safety are our top priority.",
    icon: FaBan,
  },
  {
    question: "Does RIVETO support real-time crypto prices?",
    answer:
      "Yes, RIVETO provides real-time or near real-time market data so you can stay updated with the latest price movements.",
    icon: FaFileAlt,
  },
  {
    question: "How does billing work for paid features?",
    answer:
      "If you choose a paid plan, billing is simple and transparent. Payments are processed securely, and you can cancel anytime.",
    icon: FaCreditCard,
  },
  {
    question: "How can I contact the RIVETO team?",
    answer:
      "You can reach us anytime via email or GitHub. Our team is happy to help with questions, feedback, or support requests.",
    icon: FaEnvelope,
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-1 text-slate-900 dark:text-white">
         <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-gray-400 md:mt-5 md:text-xl">Everything you need to know about the product and billing. </p>
                </div>
 
                <div className="mt-12 md:mt-16">
                    <dl className="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
                        {faqs.map((item, index) => (
                            <div key={index}>
                                <div className="flex max-w-sm flex-col items-center text-center">
                                    <div className="p-4 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-slate-200 dark:border-gray-700">
                                        <item.icon className="text-3xl text-cyan-400" />
                                    </div>
 
                                    <dt className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{item.question}</dt>
                                    <dd className="mt-2 text-base text-slate-700 dark:text-gray-300">{item.answer}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
 
                          <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl bg-white/85 dark:bg-gray-800/50 backdrop-blur-md border border-slate-200 dark:border-gray-700 px-6 py-8 text-center md:mt-16 md:gap-8 md:px-8 md:py-10">
                    <div className="flex items-end -space-x-4">
                        <img
                            src="https://www.untitledui.com/images/avatars/marco-kelly?fm=webp&q=80"
                            alt="Marco Kelly"
                            className="w-12 h-12 rounded-full ring-2 ring-slate-300 dark:ring-white"
                        />
                        <img
                            src="https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80"
                            alt="Amelie Laurent"
                            className="w-16 h-16 rounded-full ring-2 ring-slate-300 dark:ring-white z-10"
                        />
                        <img
                            src="https://www.untitledui.com/images/avatars/jaya-willis?fm=webp&q=80"
                            alt="Jaya Willis"
                            className="w-12 h-12 rounded-full ring-2 ring-slate-300 dark:ring-white"
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Still have questions?</h4>
                        <p className="mt-2 text-base md:text-lg text-slate-700 dark:text-gray-300">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    </div>
                    <a 
                        href='https://github.com/Nsanjayboruds' 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </section>
         {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
   </div>
  )
}


export default faqPage