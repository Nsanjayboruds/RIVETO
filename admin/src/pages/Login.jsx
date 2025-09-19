import React, { useContext, useState } from 'react';
import axios from 'axios';
import Logo from '../assets/logof.png';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import { adminDataContext } from '../Context/AdminContext';
import {toast} from 'react-toastify'
import Loading from '../components/Loading';
function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {serverUrl}=useContext(authDataContext)
  const [loading, setLoading] = useState(false); // NEW
  const [error, setError] = useState(''); // NEW
  const {adminData, getAdmin} = useContext(adminDataContext);
  const navigate = useNavigate();
  
  const Adminlogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ressult = await axios.post(serverUrl + '/api/auth/adminlogin',
         {email,
          password },
                 { withCredentials: true });

    console.log(ressult.data);
    toast.success("Adminlogin Sucessfully ")
    getAdmin()
    navigate("/")
    } catch (err) {
      console.error(err);
      toast.error("Adminlogin failed")
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-bl from-slate-900 via-blue-900 to-slate-900 text-white font-sans relative overflow-hidden'>
      
      {/* Background Circles */}
      <div className="absolute w-[300px] h-[300px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-spin-slow top-[60%] left-[80%]"></div>

      {/* Logo */}
      <div className='w-full h-[80px] px-6 flex items-center gap-4 cursor-pointer z-10'>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide'>
         RIVETO
        </h1>
      </div>

      {/* Heading */}
      <div className='text-center my-6 z-10'>
        <h2 className='text-4xl font-bold tracking-tight mb-2'>Welcome Back!</h2>
        <p className='text-gray-300'>Apply to Admin login</p>
      </div>

      {/* Form */}
      <form onSubmit={Adminlogin} className='w-[90%] max-w-[500px] px-8 py-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-6 z-10'>

        {/* Error Message */}
        {error && (
          <div className="w-full text-center text-red-300 bg-red-500/10 px-4 py-2 rounded-lg border border-red-400/50 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className='w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'
          required
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className='w-full relative'>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className='w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {show ? (
            <IoEye className='absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer' onClick={() => setShow(false)} />
          ) : (
            <IoEyeOutline className='absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer' onClick={() => setShow(true)} />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className='w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold text-white tracking-wide shadow-lg disabled:opacity-50'
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
