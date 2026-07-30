import React, { useContext, useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthProvider";
import { adminDataContext } from "../Context/AdminProvider";
import { toast } from "react-toastify";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl } = useContext(authDataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { adminData: _adminData, getAdmin } = useContext(adminDataContext);
  const navigate = useNavigate();

  const Adminlogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );

      console.log(result.data);
      toast.success("Admin login successful");
      getAdmin();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Admin login failed");
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 text-gray-900 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="flex w-full max-w-5xl mx-auto my-auto shadow-2xl rounded-3xl overflow-hidden bg-white z-10 min-h-[600px] border border-gray-100 m-6">
        
        {/* Left Panel: Brand info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
          
          {/* Glass Overlay for depth */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

          {/* Top: Logo Icon */}
          <div className="z-10 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wider">Riveto</span>
          </div>

          {/* Middle: Welcome Text */}
          <div className="z-10 flex flex-col gap-6">
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Riveto Admin
              </span>
            </h2>
            <p className="text-blue-100/90 text-lg max-w-md font-medium leading-relaxed">
              Manage your products, track user behavior, and analyze transactions. Experience seamless administration with our powerful dashboard.
            </p>
          </div>

          {/* Bottom: Copyright & Decorative */}
          <div className="z-10 text-blue-200/70 text-sm font-medium">
            © 2026 Riveto Inc. All rights reserved.
          </div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 border-[40px] border-white/10 rounded-full"></div>
          <div className="absolute -top-32 -left-32 w-80 h-80 border-[30px] border-white/10 rounded-full"></div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm flex flex-col gap-8">
            
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Sign In
              </h2>
              <p className="text-gray-500 font-medium">
                Enter your credentials to access the admin panel.
              </p>
            </div>

            <form onSubmit={Adminlogin} className="flex flex-col gap-6 w-full mt-2">
              {/* Error Message */}
              {error && (
                <div className="w-full flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="admin@riveto.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    required
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {show ? <IoEye className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
