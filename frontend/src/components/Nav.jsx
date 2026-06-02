import {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { useFocusTrap, useEscapeKey } from '../hooks/useDialogA11y';


import { IoMdHome } from 'react-icons/io';

import {
  HiOutlineCollection
} from 'react-icons/hi';

import { RiContactsLine } from 'react-icons/ri';


import { useNavigate, useLocation } from 'react-router-dom';

import apiConfig from '../utils/apiConfig';

import { userDataContext } from '../context/UserContext';
import { shopDataContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';

import gsap from 'gsap';

function Nav() {
  const { getCurrentUser, userData } = useContext(userDataContext);

  const {
    showSearch,
    setShowSearch,
    search,
    setSearch,
    getCartCount,
  } = useContext(shopDataContext);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const logoRef = useRef(null);
  const navRef = useRef(null);
  const iconsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const closeProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  useFocusTrap(showProfile, profileRef);
  useEscapeKey(showProfile, closeProfile);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initial animations
  useEffect(() => {
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (navRef.current?.children?.length) {
      gsap.from(navRef.current.children, {
        opacity: 0,
        y: -15,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out',
      });
    }

    if (iconsRef.current?.children?.length) {
      gsap.from(iconsRef.current.children, {
        opacity: 0,
        y: -15,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out',
      });
    }
  }, []);

  // Profile animation
  useEffect(() => {
    if (showProfile && profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power1.out',
        }
      );
    }
  }, [showProfile]);

  // Search animation
  useEffect(() => {
    if (showSearch && searchRef.current) {
      gsap.fromTo(
        searchRef.current,
        {
          opacity: 0,
          height: 0,
        },
        {
          opacity: 1,
          height: 'auto',
          duration: 0.4,
          ease: 'power2.out',
        }
      );
    }
  }, [showSearch]);

  const handleLogout = async () => {
    try {
      await apiConfig.post('/auth/logout');

      getCurrentUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const cartCount = getCartCount();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/collection' },
    { label: 'Contributors', path: '/contributors' },
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'shadow-lg bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-xl'
            : 'bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-md'
        } border-b border-gray-200/50 dark:border-gray-800/50`}
      >
        <div className="max-w-[1440px] mx-auto px-3 md:px-6 flex justify-between items-center h-16">

          {/* LOGO */}
          <button
            ref={logoRef}
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-5 bg-transparent border-0 p-0 cursor-pointer"
            aria-label="Riveto home"
          >
            <span
              className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Riveto
            </span>
          </button>

          {/* DESKTOP NAV */}
          <nav
            ref={navRef}
            className="hidden md:flex gap-12 text-sm font-medium"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#2563EB] font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#2563EB] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* ICONS */}
          <div
            ref={iconsRef}
            className="flex items-center gap-4 md:gap-5 relative"
          >

            {/* SEARCH */}
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch);

                if (!showSearch) {
                  navigate('/collection');
                }
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={showSearch ? 'Close search' : 'Open search'}
            >
              {showSearch ? (
                <IoSearchCircleOutline className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <BsSearch className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <BsSun className="text-yellow-400 text-lg" />
              ) : (
                <BsMoon className="text-gray-700 text-lg" />
              )}
            </button>

            {/* PROFILE */}
            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="User profile menu"
            >
              {!userData ? (
                <FaUserCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  {userData?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </button>

            {/* CART */}
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <MdOutlineShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {showSearch && (
          <div
            id="nav-search-panel"
            ref={searchRef}
            role="search"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 flex justify-center border-t border-gray-200 dark:border-gray-700"
          >
            <div className="w-full md:w-[60%] relative">

              <BsSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              />

              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* PROFILE DROPDOWN */}
        {showProfile && (
          <div
            ref={profileRef}
            className="absolute top-full right-4 mt-2 w-64 bg-white dark:bg-[#111c33] shadow-2xl rounded-xl border border-gray-200 dark:border-[#1f2a44] z-40 overflow-hidden"
          >

            {/* USER INFO */}
            {userData && (
              <div className="px-4 py-4 border-b border-gray-200 dark:border-[#1f2a44] bg-gray-50 dark:bg-[#0f172a]">
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userData?.name || 'User'}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MENU */}
            <div className="py-2">

              {/* LOGIN */}
              {!userData && (
                <button
                  className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#1a2332] flex items-center gap-3 transition-all"
                  onClick={() => {
                    navigate('/login');
                    setShowProfile(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                    <FiLogIn className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Login
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Access your account
                    </p>
                  </div>
                </button>
              )}

              {/* USER MENU */}
              {userData && (
                <>
                  {/* ORDERS */}
                  <button
                    className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#1a2332] flex items-center gap-3 transition-all"
                    onClick={() => {
                      navigate('/order');
                      setShowProfile(false);
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <BsBoxSeam className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Orders
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Track your purchases
                      </p>
                    </div>
                  </button>

                  {/* WISHLIST */}
                  <button
                    className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#1a2332] flex items-center gap-3 transition-all"
                    onClick={() => {
                      navigate('/wishlist');
                      setShowProfile(false);
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                      <FaHeart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Wishlist
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your saved products
                      </p>
                    </div>
                  </button>

                  {/* ABOUT */}
                  <button
                    className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#1a2332] flex items-center gap-3 transition-all"
                    onClick={() => {
                      navigate('/about');
                      setShowProfile(false);
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center">
                      <FiInfo className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        About
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Learn more about us
                      </p>
                    </div>
                  </button>

                  {/* LOGOUT */}
                  <button
                    className="w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-all"
                    onClick={handleLogout}
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <MdLogout className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Logout
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MOBILE NAV */}
      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-[72px] md:hidden z-[999] flex items-center justify-around rounded-[28px] border border-white/10 bg-[#0F172A]/80 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-3"
      >
        <div className="flex items-center justify-between w-full px-2">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            {[
              {
                icon: IoMdHome,
                label: 'Home',
                path: '/',
              },
              {
                icon: HiOutlineCollection,
                label: 'Collection',
                path: '/collection',
              },
            ].map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center pt-1 w-[58px] h-[58px] rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}
                  />

                  <span
                    className={`text-[10px] mt-0.5 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-16" />

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {[
              {
                icon: RiContactsLine,
                label: 'Contact',
                path: '/contact',
              },
            ].map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center pt-1 w-[58px] h-[58px] rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}
                  />

                  <span
                    className={`text-[10px] mt-0.5 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CART FAB */}
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-xl shadow-blue-500/40 flex items-center justify-center border-4 border-white dark:border-[#121826]"
        >
          <div className="flex flex-col items-center">
            <MdOutlineShoppingCart className="w-5 h-5 text-white" />

            <span className="text-[10px] text-white">
              Cart
            </span>
          </div>

          {cartCount > 0 && (
            <span className="absolute top-2 right-3 bg-[#EF4444] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
}

export default Nav;
