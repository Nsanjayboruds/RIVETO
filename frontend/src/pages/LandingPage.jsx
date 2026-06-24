import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Heart,
  ChevronDown,
  ArrowRight,
  Check,
  Users,
  Package,
  TrendingUp,
  Award,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// ─── Animation Variants ───────────────────────────────────────────────────────

const ease = [0.25, 0.46, 0.45, 0.94];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: ShoppingBag,
    title: 'Curated Collections',
    description:
      'Hand-picked fashion pieces updated weekly, sourced from top designers and emerging brands worldwide.',
    color: '#2563EB',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200/60 dark:border-blue-500/20',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Style',
    description:
      'Our smart recommendation engine learns your preferences and suggests outfits that match your unique taste.',
    color: '#8B5CF6',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200/60 dark:border-purple-500/20',
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    description:
      'Fast and secure shipping with real-time tracking. Get your fashion fix delivered right to your door.',
    color: '#06B6D4',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200/60 dark:border-cyan-500/20',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description:
      'Not satisfied? Return within 30 days, no questions asked. We make every purchase completely risk-free.',
    color: '#EC4899',
    bg: 'bg-pink-50 dark:bg-pink-500/10',
    border: 'border-pink-200/60 dark:border-pink-500/20',
  },
];

const steps = [
  {
    title: 'Browse & Discover',
    description:
      'Explore thousands of premium fashion items across clothing, accessories, footwear, and more.',
    icon: ShoppingBag,
  },
  {
    title: 'Wishlist & Select',
    description:
      "Save your favorites to your wishlist and add items to your cart when you're ready to buy.",
    icon: Heart,
  },
  {
    title: 'Checkout Securely',
    description:
      'Complete your purchase with our encrypted, multi-payment checkout and track your order in real time.',
    icon: Shield,
  },
];

const stats = [
  { label: 'Premium Products', value: '10,000+', icon: Package },
  { label: 'Happy Customers', value: '500K+', icon: Users },
  { label: 'Fashion Brands', value: '200+', icon: Award },
  { label: 'Satisfaction Rate', value: '98.5%', icon: Star },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Fashion Blogger',
    avatar: 'SK',
    rating: 5,
    text: 'Riveto has completely transformed my wardrobe. The curated collections are always on-point and the quality is exceptional. I get compliments every time I wear something from here!',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Michael T.',
    role: 'Creative Director',
    avatar: 'MT',
    rating: 5,
    text: "The AI recommendations are scarily accurate — it's like having a personal stylist available 24/7. Plus the shipping is incredibly fast. Riveto is my go-to for everything fashion.",
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Emma R.',
    role: 'Lifestyle Influencer',
    avatar: 'ER',
    rating: 5,
    text: "I've tried every fashion platform out there, and Riveto stands head and shoulders above the rest. Exclusive collections, seamless UX, and exceptional customer service — unbeatable.",
    gradient: 'from-pink-500 to-orange-400',
  },
];

const benefits = [
  {
    title: 'Exclusive Collections',
    desc: 'Access limited-edition pieces and early drops before anyone else.',
  },
  {
    title: 'Price Match Guarantee',
    desc: "Find it cheaper elsewhere? We'll match the price, no questions asked.",
  },
  {
    title: 'Loyalty Rewards',
    desc: 'Earn points on every purchase and redeem them for discounts and perks.',
  },
  {
    title: 'Personalized Styling',
    desc: 'Get outfit recommendations tailored to your body type and preferences.',
  },
  {
    title: 'Community & Inspiration',
    desc: 'Join a community of fashion lovers. Share looks and discover daily inspiration.',
  },
];

const faqs = [
  {
    question: 'How do I create an account?',
    answer:
      "Click 'Sign Up' at the top of the page and follow the simple registration steps. You can also sign up instantly using your Google account.",
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, Amex) as well as digital wallets. All transactions are secured with 256-bit SSL encryption.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Standard delivery takes 3–5 business days. Express delivery options (1–2 days) are available at checkout for most locations.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer hassle-free returns within 30 days of purchase. Items must be in original condition with tags attached. Initiate a return from your order history page.',
  },
  {
    question: 'How do the AI recommendations work?',
    answer:
      'Our AI analyses your browsing history, purchase patterns, saved items, and style preferences to suggest products tailored specifically to you. The more you shop, the smarter it gets.',
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="border border-gray-200/60 dark:border-gray-700/50 rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-4"
      >
        <span className="font-semibold text-gray-900 dark:text-white">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-blue-500 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, eyebrowColor, title, highlight, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className="text-center mb-16"
    >
      {eyebrow && (
        <motion.p
          variants={fadeInUp}
          className={`font-semibold text-sm uppercase tracking-widest mb-3 ${eyebrowColor}`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {title}
        {highlight && (
          <>
            <br />
            <span className="text-[#2563EB]">{highlight}</span>
          </>
        )}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A] text-gray-900 dark:text-white overflow-x-hidden">
      {/* ── LANDING NAV ─────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-extrabold text-gray-900 dark:text-white bg-transparent border-0 p-0 cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            aria-label="Riveto — back to top"
          >
            Riveto
          </button>

          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium"
            aria-label="Landing navigation"
          >
            {[
              { label: 'Features', id: 'features' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Reviews', id: 'testimonials' },
              { label: 'FAQ', id: 'faq' },
            ].map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className=" group relative  px-3 py-2 overflow-visible transition-all  duration-30  "
              >
                {/* Soft Aura */}
                <span className="  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 opacity-0 blur-lg rounded-full bg-gradient-to-r from-[#3B82F6]/15  via-[#6366F1]/20  to-[#8B5CF6]/15 transition-all  duration-500  group-hover:w-20  group-hover:h-7 group-hover:opacity-100" />

                {/* Text */}
                <span className=" relative z-10 text-gray-300 transition-all  duration-300 group-hover:text-[#b9b4cc]">
                  {label}
                </span>

                {/* Underline */}
                <span className=" absolute left-0  -bottom-1 h-[1.5px] w-0 rounded-full bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#A78BFA] transition-all duration-500 group-hover:w-[85%] " />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
  {/* THEME TOGGLE */}
  <button
    type="button"
    onClick={toggleTheme}
    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {theme === 'dark' ? (
      <BsSun className="text-yellow-400 text-lg" />
    ) : (
      <BsMoon className="text-gray-700 text-lg" />
    )}
  </button>
  <button
    type="button"
    onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors px-3 py-2 hidden sm:block"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
              animationDelay: '2s',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)',
            }}
          />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full px-4 py-2 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Premium Fashion for Every Occasion
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Elevate Your Style.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #8B5CF6 100%)',
                }}
              >
                Define Your World.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Discover thousands of premium fashion pieces hand-picked for the
              modern trendsetter. Smart recommendations, fast delivery, and an
              effortless shopping experience.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
            >
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started — It&apos;s Free
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:text-blue-400 font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up Free
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 font-medium px-2 py-4 text-base transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Already have an account? Login
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex -space-x-2.5" aria-hidden="true">
                {[
                  { initials: 'AB', bg: '#2563EB' },
                  { initials: 'CD', bg: '#8B5CF6' },
                  { initials: 'EF', bg: '#06B6D4' },
                  { initials: 'GH', bg: '#EC4899' },
                  { initials: 'IJ', bg: '#10B981' },
                ].map(({ initials, bg }, i) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-[#0B0F1A] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: bg, zIndex: 5 - i }}
                  >
                    {initials[0]}
                  </div>
                ))}
              </div>
              <div>
                <span className="text-yellow-400" aria-label="5 stars">
                  ★★★★★
                </span>
                <span className="ml-2">
                  Loved by{' '}
                  <strong className="text-gray-900 dark:text-white">
                    500,000+
                  </strong>{' '}
                  fashion enthusiasts
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          type="button"
          onClick={() => scrollTo('stats')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-0 focus:outline-none"
          aria-label="Scroll down"
        >
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </motion.div>
        </motion.button>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section
        id="stats"
        className="py-16 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map(({ label, value, icon: Icon }) => (
              <motion.div
                key={label}
                variants={scaleIn}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl mb-3 mx-auto">
                  <Icon
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <p
                  className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Why Riveto"
            eyebrowColor="text-blue-600 dark:text-blue-400"
            title="Everything You Need to"
            highlight="Shop with Confidence"
            subtitle="From discovery to delivery, we've built the most seamless fashion shopping experience."
          />
          <span id="features-heading" className="sr-only">
            Key Features
          </span>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map(
              ({ icon: Icon, title, description, color, bg, border }) => (
                <motion.article
                  key={title}
                  variants={scaleIn}
                  className={`group relative p-6 rounded-2xl bg-white dark:bg-gray-900/80 border ${border} hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${bg}`}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.article>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 bg-gray-50 dark:bg-gray-900/40"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Simple & Fast"
            eyebrowColor="text-cyan-600 dark:text-cyan-400"
            title="How Riveto Works"
            subtitle="Getting started is easy. Here's how you go from browsing to owning your next favourite outfit."
          />
          <span id="how-it-works-heading" className="sr-only">
            How It Works
          </span>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 list-none"
          >
            {steps.map(({ title, description, icon: Icon }, i) => (
              <motion.li
                key={title}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 dark:from-blue-500/25 dark:to-cyan-500/25" />
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-[#0B0F1A] flex items-center justify-center shadow-inner">
                    <Icon
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-extrabold flex items-center justify-center shadow-md"
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto text-sm">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 text-center"
          >
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Shopping Now
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual panel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="relative"
              aria-hidden="true"
            >
              <div
                className="relative rounded-3xl overflow-hidden p-[2px]"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
                }}
              >
                <div className="rounded-[22px] bg-gray-900 p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <span
                      className="text-4xl"
                      role="img"
                      aria-label="Shopping bags"
                    >
                      🛍️
                    </span>
                    <p
                      className="text-white text-2xl font-bold mt-3 mb-1"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Your Style Journey
                    </p>
                    <p className="text-gray-400 text-sm">
                      Personalised just for you
                    </p>
                  </div>

                  <div className="relative z-10 space-y-3 mt-6">
                    {[
                      {
                        label: 'New Arrivals',
                        sub: '200+ this week',
                        emoji: '✨',
                        color: '#2563EB',
                      },
                      {
                        label: 'My Wishlist',
                        sub: '12 saved items',
                        emoji: '❤️',
                        color: '#EC4899',
                      },
                      {
                        label: 'Orders',
                        sub: '3 on the way',
                        emoji: '📦',
                        color: '#06B6D4',
                      },
                    ].map(({ label, sub, emoji, color }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <span className="text-lg">{emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {label}
                          </p>
                          <p className="text-gray-400 text-xs">{sub}</p>
                        </div>
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                <Shield className="w-5 h-5 text-green-500" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    100% Secure
                  </p>
                  <p className="text-xs text-gray-500">SSL Encrypted</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                <TrendingUp
                  className="w-5 h-5 text-blue-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    AI Powered
                  </p>
                  <p className="text-xs text-gray-500">Smart Recommendations</p>
                </div>
              </div>
            </motion.div>

            {/* Benefits list */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p
                variants={fadeInUp}
                className="text-purple-600 dark:text-purple-400 font-semibold text-sm uppercase tracking-widest mb-3"
              >
                Benefits
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Why Millions Choose{' '}
                <span className="text-[#2563EB]">Riveto</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-500 dark:text-gray-400 mb-8 text-lg leading-relaxed"
              >
                More than just a shopping platform — Riveto is a complete style
                ecosystem built around your needs.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-4">
                {benefits.map(({ title, desc }) => (
                  <motion.li
                    key={title}
                    variants={fadeInUp}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <Check
                        className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {desc}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeInUp} className="mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="group inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Join for Free
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-24 bg-gray-50 dark:bg-gray-900/40"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            eyebrowColor="text-pink-600 dark:text-pink-400"
            title="What Our Customers Say"
            subtitle="Don't just take our word for it — hear from the people who shop with Riveto every day."
          />
          <span id="testimonials-heading" className="sr-only">
            Customer Testimonials
          </span>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map(
              ({ name, role, avatar, rating, text, gradient }) => (
                <motion.article
                  key={name}
                  variants={scaleIn}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className="text-5xl font-serif text-blue-100 dark:text-blue-900/50 leading-none mb-3 select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5 text-sm">
                    {text}
                  </p>
                  <div
                    className="flex gap-0.5 mb-4"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}
                      aria-hidden="true"
                    >
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {name}
                      </p>
                      <p className="text-gray-400 text-xs">{role}</p>
                    </div>
                  </div>
                </motion.article>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            eyebrow="FAQ"
            eyebrowColor="text-cyan-600 dark:text-cyan-400"
            title="Frequently Asked Questions"
            subtitle="Have questions? We've got answers. If you can't find what you're looking for, reach out to our support team."
          />
          <h2 id="faq-heading" className="sr-only">
            Frequently Asked Questions
          </h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="space-y-3"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden text-center"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 py-16 px-6 sm:px-12">
              <h2
                id="cta-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Ready to Transform
                <br />
                Your Wardrobe?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto">
                Join 500,000+ fashion lovers who've made Riveto their go-to
                shopping destination. Sign up free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-full transition-all hover:shadow-2xl text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Create Your Free Account
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="border-2 border-white/50 text-white hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-16 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <span
                className="text-2xl font-extrabold text-gray-900 dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Riveto
              </span>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed text-sm">
                The modern fashion e-commerce platform for style-conscious
                shoppers. Discover, shop, and express yourself.
              </p>
              <div className="mt-4 flex items-center gap-3">
               {[
  {
    Icon: FaInstagram,
    label: 'Instagram',
    url: 'https://www.instagram.com',
    color: 'hover:text-pink-500',
    shadow: 'hover:shadow-[0_0_20px_rgba(225,48,108,0.45)]',
  },
  {
    Icon: FaXTwitter,
    label: 'X',
    url: 'https://www.x.com',
    color: 'hover:text-slate-100',
    shadow: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]',
  },
  {
    Icon: FaFacebook,
    label: 'Facebook',
    url: 'https://www.facebook.com',
    color: 'hover:text-blue-500',
    shadow: 'hover:shadow-[0_0_20px_rgba(24,119,242,0.45)]',
  },
].map(({ Icon, label, url, color, shadow }) => (
  <a
    key={label}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Follow Riveto on ${label}`}
                    className={`w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-400 hover:scale-125 ${color} ${shadow}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'Get Started', onClick: () => navigate('/signup') },
                  { label: 'Login', onClick: () => navigate('/login') },
                  { label: 'Sign Up', onClick: () => navigate('/signup') },
                  { label: 'FAQ', onClick: () => scrollTo('faq') },
                ].map(({ label, onClick }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={onClick}
                      className="group text-sm text-gray-500 dark:text-gray-400 hover:text-sky-300 transition-all duration-300 hover:translate-x-0.5"
                    >
                      <span className="relative">
                        {label}
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[0.5px] w-0  bg-teal-400/70 transition-all duration-600 ease-out group-hover:w-full"></span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', path: '/privacypolicy' },
                  { label: 'Terms of Service', path: '/terms' },
                  { label: 'Cookie Policy', path: '/cookie-policy' },
                  { label: 'Size Guide', path: '/size-guide' },
                  { label: 'Contributors', path: '/contributors' },
                ].map(({ label, path }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => navigate(path)}
                      className="group text-sm text-gray-500 dark:text-gray-400 hover:text-sky-300 transition-all duration-300 hover:translate-x-0.5"
                    >
                      <span className="relative">
                        {label}
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[0.5px] w-0  bg-teal-400/70 transition-all duration-600 ease-out group-hover:w-full"></span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Riveto. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => navigate('/privacypolicy')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="hover:text-cyan-300 transition-all duration-300 underline-offset-4 hover:underline"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => navigate('/contributors')}
                className="hover:text-cyan-300 transition-all duration-300 underline-offset-4 hover:underline"
              >
                Contributors
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
