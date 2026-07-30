/* eslint-disable no-console */
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Home, 
  LayoutGrid, 
  Users, 
  Sparkles, 
  Info, 
  Phone, 
  Heart, 
  ShoppingCart, 
  Package, 
  MapPin, 
  HelpCircle, 
  Shield, 
  FileText, 
  Ruler, 
  Cookie, 
  Bell, 
  Sun, 
  Moon, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Check, 
  LogOut, 
  LogIn, 
  UserPlus, 
  CornerDownLeft,
  Clock
} from 'lucide-react';

import { userDataContext } from '../context/UserContext';
import { shopDataContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';
import { notificationContext } from '../context/NotificationContext';
import apiConfig from '../utils/apiConfig';
import { toast } from 'react-toastify';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState([]);
  
  const { userData, getCurrentUser } = useContext(userDataContext);
  const { 
    product, 
    cartItem, 
    setCartItem, 
    UpdateQuantity, 
    currency 
  } = useContext(shopDataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { markAllAsRead } = useContext(notificationContext);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const activeRef = useRef(null);

  // Load recents on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('command-palette-recents');
      if (stored) {
        setRecents(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen to open/close global event or keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, [isOpen]);

  // Handle focus and body scroll when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  const saveToRecents = (item) => {
    if (item.category === 'Products' || item.category === 'Recent') return;
    
    setRecents((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      const updated = [{ id: item.id, title: item.title, category: item.category }, ...filtered].slice(0, 5);
      localStorage.setItem('command-palette-recents', JSON.stringify(updated));
      return updated;
    });
  };

  const pages = [
    { id: 'page-home', title: 'Home', description: 'Go to the homepage', path: '/home', icon: Home },
    { id: 'page-collection', title: 'Collection', description: 'Browse product collections', path: '/collection', icon: LayoutGrid },
    { id: 'page-contributors', title: 'Contributors', description: 'View the project contributors', path: '/contributors', icon: Users },
    { id: 'page-recommendations', title: 'Recommendations', description: 'Personalized product picks', path: '/recommendations', icon: Sparkles },
    { id: 'page-about', title: 'About Us', description: 'Learn more about Riveto', path: '/about', icon: Info },
    { id: 'page-contact', title: 'Contact Us', description: 'Get in touch with support', path: '/contact', icon: Phone },
    { id: 'page-wishlist', title: 'Wishlist', description: 'View your saved items', path: '/wishlist', icon: Heart },
    { id: 'page-cart', title: 'Cart', description: 'View shopping cart items', path: '/cart', icon: ShoppingCart },
    { id: 'page-orders', title: 'Orders', description: 'Track your purchases', path: '/order', icon: Package, authRequired: true },
    { id: 'page-addresses', title: 'Saved Addresses', description: 'Manage delivery addresses', path: '/saved-addresses', icon: MapPin, authRequired: true },
    { id: 'page-faq', title: 'FAQ', description: 'Frequently asked questions', path: '/faq', icon: HelpCircle },
    { id: 'page-privacy', title: 'Privacy Policy', description: 'View privacy guidelines', path: '/privacypolicy', icon: Shield },
    { id: 'page-terms', title: 'Terms of Service', description: 'Terms and services agreement', path: '/terms', icon: FileText },
    { id: 'page-sizeguide', title: 'Size Guide', description: 'Find the right fit size', path: '/size-guide', icon: Ruler },
    { id: 'page-cookie', title: 'Cookie Policy', description: 'Cookie policy details', path: '/cookie-policy', icon: Cookie },
    { id: 'page-notifications', title: 'Notifications', description: 'View all user notifications', path: '/notifications', icon: Bell, authRequired: true },
  ];

  const actions = [
    { 
      id: 'action-theme', 
      title: 'Toggle Dark/Light Mode', 
      description: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`, 
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme() 
    },
    { 
      id: 'action-scroll-top', 
      title: 'Scroll to Top', 
      description: 'Smoothly scroll to top of page', 
      icon: ArrowUp,
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    { 
      id: 'action-scroll-bottom', 
      title: 'Scroll to Bottom', 
      description: 'Smoothly scroll to bottom of page', 
      icon: ArrowDown,
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    },
    { 
      id: 'action-clear-cart', 
      title: 'Clear Shopping Cart', 
      description: 'Remove all items from your cart', 
      icon: Trash2,
      action: async () => {
        setCartItem({});
        if (userData) {
          for (const itemId in cartItem) {
            for (const size in cartItem[itemId]) {
              try {
                await UpdateQuantity(itemId, size, 0);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
        toast.success('Shopping cart cleared');
      }
    },
    { 
      id: 'action-read-notifications', 
      title: 'Mark All Notifications as Read', 
      description: 'Mark all unread notifications as read', 
      icon: Check,
      authRequired: true,
      action: () => markAllAsRead()
    },
    { 
      id: 'action-logout', 
      title: 'Sign Out', 
      description: 'Logout of your account', 
      icon: LogOut,
      authRequired: true,
      action: async () => {
        try {
          await apiConfig.post('/auth/logout');
          getCurrentUser();
          navigate('/login');
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Logout failed');
        }
      }
    },
    { 
      id: 'action-login', 
      title: 'Sign In', 
      description: 'Login to your account', 
      icon: LogIn,
      authRequired: false,
      action: () => navigate('/login')
    },
    { 
      id: 'action-signup', 
      title: 'Create Account', 
      description: 'Register a new user account', 
      icon: UserPlus,
      authRequired: false,
      action: () => navigate('/signup')
    },
  ];

  const isAuthFiltered = (item) => {
    if (item.authRequired === true && !userData) return false;
    if (item.authRequired === false && userData) return false;
    return true;
  };

  const filteredPages = pages.filter(isAuthFiltered);
  const filteredActions = actions.filter(isAuthFiltered);

  const productsList = (product || []).map((p) => ({
    id: `product-${p._id}`,
    title: p.name,
    description: `${currency}${p.price} - Click to view detail`,
    image: p.image && p.image[0],
    category: 'Products',
    path: `/productdetail/${p._id}`,
    icon: ShoppingCart
  }));

  const allItems = [
    ...filteredPages.map(p => ({ ...p, category: 'Pages' })),
    ...filteredActions.map(a => ({ ...a, category: 'Actions' })),
    ...productsList
  ];

  const getFuzzyMatchIndices = (text, query) => {
    const cleanText = text.toLowerCase();
    const cleanQuery = query.toLowerCase();
    const indices = [];
    let queryIdx = 0;
    
    for (let i = 0; i < cleanText.length; i++) {
      if (queryIdx < cleanQuery.length && cleanText[i] === cleanQuery[queryIdx]) {
        indices.push(i);
        queryIdx++;
      }
    }
    
    return queryIdx === cleanQuery.length ? indices : null;
  };

  let filteredItems = [];
  
  if (!searchQuery) {
    const recentItems = recents
      .map((r) => allItems.find((item) => item.id === r.id))
      .filter(Boolean)
      .map((item) => ({ ...item, category: 'Recent' }));

    filteredItems = [
      ...recentItems,
      ...filteredPages.slice(0, 4).map(p => ({ ...p, category: 'Pages' })),
      ...filteredActions.slice(0, 3).map(a => ({ ...a, category: 'Actions' }))
    ];
  } else {
    filteredItems = allItems
      .map((item) => {
        const titleIndices = getFuzzyMatchIndices(item.title, searchQuery);
        const descIndices = getFuzzyMatchIndices(item.description || '', searchQuery);
        
        if (titleIndices || descIndices) {
          return {
            ...item,
            titleIndices: titleIndices || [],
            descIndices: descIndices || [],
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Bound index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  // Handle arrow navigation and select
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev >= filteredItems.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? filteredItems.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          handleTriggerItem(filteredItems[activeIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filteredItems, activeIndex]);

  const handleTriggerItem = (item) => {
    saveToRecents(item);
    setIsOpen(false);
    
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const highlightText = (text, indices) => {
    if (!indices || indices.length === 0) return <span>{text}</span>;
    
    const elements = [];
    let lastIndex = 0;
    
    for (let idx of indices) {
      if (idx > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, idx)}</span>);
      }
      elements.push(
        <strong key={`match-${idx}`} className="text-[#2563EB] dark:text-[#3B82F6] font-extrabold">
          {text[idx]}
        </strong>
      );
      lastIndex = idx + 1;
    }
    
    if (lastIndex < text.length) {
      elements.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }
    
    return <>{elements}</>;
  };

  // Group by category for visual sections
  const categories = {};
  filteredItems.forEach((item, index) => {
    const cat = item.category;
    if (!categories[cat]) {
      categories[cat] = [];
    }
    categories[cat].push({ ...item, flatIndex: index });
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 md:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            className="relative w-full max-w-2xl bg-white dark:bg-[#0B0F1A] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={isOpen}
                aria-controls="command-palette-listbox"
                aria-autocomplete="list"
                aria-activedescendant={
                  filteredItems[activeIndex] ? `palette-item-${filteredItems[activeIndex].id}` : undefined
                }
                placeholder="Search pages, actions, and products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none py-2"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-5 select-none items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  ESC
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Commands"
              className="max-h-[50vh] overflow-y-auto p-3"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500 select-none">
                  No matching results found for "{searchQuery}"
                </div>
              ) : (
                Object.entries(categories).map(([catName, items]) => (
                  <div key={catName} className="mb-4 last:mb-0">
                    <h3 className="px-3 mb-2 text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase select-none flex items-center gap-1.5">
                      {catName === 'Recent' && <Clock className="w-3.5 h-3.5" />}
                      {catName}
                    </h3>
                    <div role="group" aria-label={catName} className="space-y-1">
                      {items.map((item) => {
                        const isSelected = item.flatIndex === activeIndex;
                        const IconComponent = item.icon;
                        
                        return (
                          <button
                            key={item.id}
                            id={`palette-item-${item.id}`}
                            role="option"
                            aria-selected={isSelected}
                            ref={isSelected ? activeRef : null}
                            onClick={() => handleTriggerItem(item)}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all outline-none border border-transparent cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* ICON / THUMBNAIL */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected 
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-[#3B82F6]' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                              }`}>
                                {item.image ? (
                                  <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <IconComponent className="w-4 h-4" />
                                )}
                              </div>
                              
                              {/* TEXT */}
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  isSelected ? 'text-[#2563EB] dark:text-white' : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                  {highlightText(item.title, item.titleIndices)}
                                </p>
                                {item.description && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                    {highlightText(item.description, item.descIndices)}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* ACTION INDICATOR */}
                            {isSelected && (
                              <div className="flex items-center gap-1.5 text-xs text-[#2563EB] dark:text-[#3B82F6] font-medium shrink-0 animate-fadeIn">
                                <span>Open</span>
                                <CornerDownLeft className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Help Area */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-[#0B0F1A]/85 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 shrink-0 select-none">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 rounded shadow-sm">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 rounded shadow-sm">Enter</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 rounded shadow-sm">Esc</kbd> Close
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1">
                <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 rounded shadow-sm">Ctrl + K</kbd> / <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 rounded shadow-sm">⌘ + K</kbd>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
