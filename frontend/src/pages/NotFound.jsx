import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Smooth entrance animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('opacity-100', 'translate-y-0');
        containerRef.current.classList.remove('opacity-0', 'translate-y-8');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] flex items-center justify-center overflow-hidden px-4">

      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Main card */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-2xl opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-[#1f2a44] rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-blue-500/5">

          {/* 🔵 Project Branding (INSIDE BOX - top) */}
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              RIVETO
            </h2>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6"></div>

          {/* ❗ Error Code (smaller than brand) */}
          <div className="mb-4">
            <span className="inline-block text-[80px] md:text-[100px] font-bold leading-none bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Page Not Found
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto mb-8">
            The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
            >
              <FaHome className="w-4 h-4" />
              Back to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111c33] hover:bg-[#1a2332] border border-[#1f2a44] text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-[#1f2a44]">
            <p className="text-sm text-gray-500 mb-3">Popular pages</p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: 'Collections', path: '/collection' },
                { label: 'New Arrivals', path: '/new-arrivals' },
                { label: 'Best Sellers', path: '/best-sellers' },
                { label: 'Contact', path: '/contact' },
                { label: 'FAQ', path: '/faq' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-gray-800 hover:border-cyan-500/30 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm mt-6">
          If you believe this is a mistake, please{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            contact support
          </button>
        </p>
      </div>
    </div>
  );
}

export default NotFound;