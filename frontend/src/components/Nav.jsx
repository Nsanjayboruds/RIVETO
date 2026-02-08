import React, { useContext, useState, useRef, useEffect } from 'react';
import logo from '../assets/logof.png';
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { RiContactsLine } from "react-icons/ri";
import { BsMoon, BsSun, BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';
import gsap from 'gsap';

function Nav() {
  const { getCurrentUser, userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const logoRef = useRef(null);
  const navRef = useRef(null);
  const iconsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial animations
  useEffect(() => {
    gsap.from(logoRef.current, { opacity: 0, x: -30, duration: 0.8, ease: 'power2.out' });
    gsap.from(navRef.current?.children, { 
      opacity: 0, 
      y: -15, 
      duration: 0.6, 
      stagger: 0.1, 
      delay: 0.3, 
      ease: 'power2.out' 
    });
    gsap.from(iconsRef.current?.children, { 
      opacity: 0, 
      y: -15, 
      duration: 0.6, 
      stagger: 0.1, 
      delay: 0.5, 
      ease: 'power2.out' 
    });
  }, []);

  // Profile dropdown animation
  useEffect(() => {
    if (showProfile && profileRef.current) {
      gsap.fromTo(profileRef.current, 
        { opacity: 0, y: -10, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power1.out' }
      );
    }
  }, [showProfile]);

  // Search bar animation
  useEffect(() => {
    if (showSearch && searchRef.current) {
      gsap.fromTo(searchRef.current, 
        { opacity: 0, height: 0 }, 
        { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [showSearch]);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      getCurrentUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-black/20 ' : 'shadow-md shadow-black/10'} backdrop-blur-md bg-white/60 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800/40`}>
      <div className="max-w-[1440px] mx-auto px-3 md:px-6 flex justify-between items-center h-15">
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-5 cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Riveto
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden md:flex gap-12 text-sm font-medium cursor-pointer">
          {['Home', 'Collection', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => navigate(`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`)}
              className="relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors group cursor-pointer"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Icons Section */}
        <div ref={iconsRef} className="flex items-center gap-4 md:gap-5 relative">
          {/* Search Icon */}
          <button 
            onClick={() => { 
              setShowSearch(!showSearch); 
              if (!showSearch) navigate("/collection"); 
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Search"
          >
            {showSearch ? (
              <IoSearchCircleOutline className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <BsSearch className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <BsSun className="text-yellow-400 text-lg" />
            ) : (
              <BsMoon className="text-gray-700 text-lg" />
            )}
          </button>

          {/* User Profile */}
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="User Profile"
          >
            {!userData ? (
              <FaUserCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs flex items-center justify-center rounded-full">
                {userData.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </button>

          {/* Shopping Cart */}
          <button 
            onClick={() => navigate("/cart")}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <MdOutlineShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div ref={searchRef} className="w-full px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex justify-center border-t border-gray-200 dark:border-gray-700">
          <div className="w-full md:w-[60%] relative">
            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div 
          ref={profileRef} 
          className="absolute top-full right-4 mt-2 w-56 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-40 overflow-hidden"
        >
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            {!userData ? (
              <li 
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => { navigate("/login"); setShowProfile(false); }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Login
              </li>
            ) : (
              <li 
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => { handleLogout(); setShowProfile(false); }}
              >
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Logout
              </li>
            )}
            <li 
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
              onClick={() => { navigate("/order"); setShowProfile(false); }}
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Orders
            </li>
            <li 
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
              onClick={() => { navigate("/about"); setShowProfile(false); }}
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              About
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full md:hidden h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-40 shadow-lg">
        {[
          { icon: IoMdHome, label: "Home", path: "/" },
          { icon: HiOutlineCollection, label: "Collection", path: "/collection" },
          { icon: RiContactsLine, label: "Contact", path: "/contact" },
        ].map((item, index) => (
          <button 
            key={index}
            onClick={() => navigate(item.path)} 
            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item.label}</span>
          </button>
        ))}
        
        <button 
          className="relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => navigate("/cart")}
        >
          <MdOutlineShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Cart</span>
          {getCartCount() > 0 && (
            <span className="absolute top-2 right-4 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Nav;
