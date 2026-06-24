import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../utils/apiConfig';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import { shopDataContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FcGoogle } from 'react-icons/fc';
import {
  IoMail,
  IoLockClosed,
  IoEye,
  IoEyeOutline,
  IoArrowBack,
} from 'react-icons/io5';

gsap.registerPlugin(ScrollTrigger);

function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [preload, setPreload] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { getCurrentUser } = useContext(userDataContext);
  const { product } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(true);

  const leftPanelRef = useRef(null);
  const googleBtnRef = useRef(null);
  const emailOptRef = useRef(null);

  // Get featured product for background
  const featuredProduct = product && product.length > 0 ? product[0] : null;

  // Mouse parallax effect for left panel
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Apply parallax drift to left panel background
  useEffect(() => {
    if (leftPanelRef.current) {
      gsap.to(leftPanelRef.current.querySelector('.parallax-image'), {
        y: mousePosition.y * 6,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [mousePosition]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreload(false);
      // Animations after preload
      gsap.fromTo(
        '.login-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      // Staged CTA entry animations - with fallback visibility
      if (googleBtnRef.current) {
        gsap.set(googleBtnRef.current, { opacity: 0, y: 12 });
        gsap.to(googleBtnRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(1.2)',
        });
      }

      if (emailOptRef.current) {
        gsap.set(emailOptRef.current, { opacity: 0 });
        gsap.to(emailOptRef.current, {
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          ease: 'power2.out',
        });
      }

      gsap.fromTo(
        '.form-element',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }, 1000);

    // Safety fallback: ensure elements are visible after 3 seconds
    const safetyTimer = setTimeout(() => {
      if (googleBtnRef.current) {
        googleBtnRef.current.style.opacity = '1';
      }
      if (emailOptRef.current) {
        emailOptRef.current.style.opacity = '1';
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiConfig.post('/auth/login', formData);

      toast.success('🎉 Login successful! Welcome back to Riveto');
      setTimeout(() => {
        getCurrentUser();
        navigate('/');
      }, 500);
    } catch {
      // API errors are shown by the global interceptor.
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await apiConfig.post('/auth/googlelogin', {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      toast.success('🎉 Google login successful!');
      setTimeout(() => {
        getCurrentUser();
        navigate('/');
      }, 500);
    } catch (err) {
      // Firebase specific error codes
      const code = err?.code;

      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        toast.info("Login cancelled. Try again when you're ready.");
      } else if (code === 'auth/popup-blocked') {
        toast.warning(
          '⚠️ Popup was blocked by your browser. Please allow popups for this site and try again.'
        );
      } else if (code === 'auth/network-request-failed') {
        toast.error('🌐 Network error. Please check your internet connection.');
      } else if (code === 'auth/user-disabled') {
        toast.error(
          '🚫 This account has been disabled. Please contact support.'
        );
      } else if (err?.response) {
        // API errors are shown by the global interceptor.
      } else {
        toast.error(
          'Google login failed. Please try again or use email instead.'
        );
      }

      // eslint-disable-next-line no-console
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };
  if (preload) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-[#0B0F1A] flex items-center justify-center">
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.35), transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 animate-pulse">
            Riveto
          </h1>

          <div className="relative w-16 h-16 mb-6">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-4 border-cyan-500/20"
            ></div>

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin"></div>
          </div>

          <p
            role="status"
            aria-live="polite"
            className="text-cyan-100/80 text-lg font-medium tracking-wide"
          >
            Preparing your experience...
          </p>

          <p className="text-white/30 text-sm mt-2">
            Curated fashion. Elevated style.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F1A] transition-colors duration-300">
      {/* LEFT PANEL - Atmospheric Identity Panel */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Atmospheric Product Silhouette */}
        {featuredProduct && (
          <div className="absolute inset-0">
            <img
              src={featuredProduct.image1}
              alt="Fashion atmosphere"
              className="parallax-image w-full h-full object-cover transition-transform duration-500 ease-out"
              style={{
                filter: 'grayscale(70%) blur(12px)',
                opacity: 0.3,
              }}
            />
          </div>
        )}

        {/* Fallback gradient if no product */}
        {!featuredProduct && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#1e293b] to-[#2563EB]" />
        )}

        {/* Dark base layer */}
        <div className="absolute inset-0 bg-[#0B0F1A]/85" />

        {/* Brand Light Aura - Lit from within */}
        <div
          className="absolute w-[420px] h-[420px] top-[20%] left-[10%] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(79,140,255,0.45), transparent 70%)',
            filter: 'blur(120px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer mb-16"
            aria-label="Navigate Home"
          >
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Riveto
            </h1>
          </div>

          {/* Identity Ambience - Typographic Anchor */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl xl:text-6xl font-bold mb-6 leading-[1.1]">
                Your Style
                <br />
                Is Waiting.
              </h2>
              <p className="text-lg xl:text-xl text-gray-300 leading-relaxed max-w-md">
                Your favourites and saved picks are still in stock.
                <br />
                <span className="text-white/90 font-medium">
                  Pick up where you left off.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4 bg-white dark:bg-[#0B0F1A] relative">
        {/* Floating Back to Home Link */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-20 group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Back to Home"
        >
          <IoArrowBack className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gray-500 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          <span className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
            Back to Home
          </span>
        </button>

        <div className="login-container max-w-md w-full">
          {/* Mobile Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer mb-4 text-center lg:hidden"
            aria-label="Navigate Home"
          >
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Riveto
            </h1>
          </div>

          {/* Header */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Log in to resume checkout and track your orders.
            </p>
          </div>

          {/* Card Container */}
          <div className="space-y-4">
            {/* LAYER 1: Google Login - Primary CTA with Staged Entry */}
            <button
              ref={googleBtnRef}
              onClick={googleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl py-3 px-6 font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FcGoogle className="w-6 h-6" />
              )}
              Continue with Google
            </button>

            {/* Collapsible Email Form with Staged Entry */}
            <div ref={emailOptRef}>
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-cyan-400 transition-colors font-medium"
              >
                {showEmailForm ? 'Hide email options' : 'Use Email Instead'}
              </button>

              {showEmailForm && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {/* Divider */}
                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
                      OR
                    </span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Field */}
                    <div className="form-element">
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <IoMail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="form-element">
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                          type={show ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShow(!show)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-[#2563EB] transition-colors"
                          aria-label={show ? 'Hide password' : 'Show password'}
                        >
                          {show ? (
                            <IoEye className="w-5 h-5" />
                          ) : (
                            <IoEyeOutline className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Forgot Password */}
                    <div className="form-element text-right">
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm transition-colors font-medium"
                      >
                        Forgot your password?
                      </button>
                    </div>

                    {/* Submit Button - Outcome Driven */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="form-element w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Accessing...
                        </>
                      ) : (
                        'Continue Shopping'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Sign Up Link */}
            <div className="form-element text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
