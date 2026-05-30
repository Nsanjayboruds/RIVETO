import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const SCROLL_THRESHOLD = 300;

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-20 right-4 z-50 transition-all duration-300 sm:bottom-24 sm:right-6 ${
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="group flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <FaArrowUp className="text-sm text-cyan-300 transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="hidden text-sm font-semibold sm:inline">Top</span>
      </button>
    </div>
  );
}

export default BackToTop;
