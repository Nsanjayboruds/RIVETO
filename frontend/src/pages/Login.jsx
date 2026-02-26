import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEye, IoMail, IoLockClosed, IoLogoGoogle } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [preload, setPreload] = useState(true);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreload(false);
      // Animations after preload
      gsap.fromTo(".login-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(".form-element",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
      await axios.post(
        `${serverUrl}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      
      toast.success("🎉 Login successful! Welcome back to Riveto");
      setTimeout(() => {
        getCurrentUser();
        navigate("/");
      }, 500);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      
      await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        },
        { withCredentials: true }
      );
      
      toast.success("🎉 Google login successful!");
      setTimeout(() => {
        getCurrentUser();
        navigate("/");
      }, 500);
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (preload) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading Riveto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] px-4 py-8 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="login-container max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate("/")}
            className="cursor-pointer mb-6 inline-block"
            aria-label="Navigate Home"
          >
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Riveto
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-600 dark:text-cyan-100">Sign in to continue your shopping journey</p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-2xl transition-colors duration-300">
          {/* Google Login Button */}
          <button
            onClick={googleLogin}
            disabled={googleLoading}
            className="form-element w-full flex items-center justify-center gap-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-700 dark:text-white font-medium transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-600 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="w-5 h-5" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="form-element">
              <label className="block text-gray-300 text-sm mb-2">Email Address</label>
              <div className="relative">
                <IoMail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="form-element">
              <label className="block text-gray-300 text-sm mb-2">Password</label>
              <div className="relative">
                <IoLockClosed className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <IoEye className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="form-element text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="form-element w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="form-element text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="form-element mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-400 text-sm">🔒</span>
            </div>
            <p className="text-gray-400 text-xs">Secure Login</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-400 text-sm">🛡️</span>
            </div>
            <p className="text-gray-400 text-xs">Data Protected</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-cyan-400 text-sm">⚡</span>
            </div>
            <p className="text-gray-400 text-xs">Fast Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
