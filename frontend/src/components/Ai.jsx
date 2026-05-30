import { useCallback, useContext, useState, useEffect, useRef } from 'react';
import robot from '../assets/airobot.gif';
import { shopDataContext } from '../context/ShopContext';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import sound from '../assets/swift-sound.mp3';
import { X, Mic, MicOff, MessageCircle, Send } from 'lucide-react';

const placeholders = [
  'search',
  'collection',
  'about',
  'home',
  'cart',
  'contact',
  'order',
];
// ─── FAQ Knowledge Base ───────────────────────────────────────────────────────
const FAQ = [
  {
    keywords: ['return', 'refund', 'exchange'],
    answer:
      'We accept returns within 7 days of delivery. Items must be unused and in original packaging. Refunds are processed within 5–7 business days.',
  },
  {
    keywords: ['shipping', 'delivery', 'deliver', 'ship'],
    answer:
      'We offer standard delivery (5–7 days) and express delivery (2–3 days). Free shipping on orders above ₹999.',
  },
  {
    keywords: ['size', 'sizing', 'fit', 'measurement'],
    answer:
      'We follow standard Indian sizing (S, M, L, XL, XXL). Check the size chart on each product page for exact measurements.',
  },
  {
    keywords: ['payment', 'pay', 'razorpay', 'upi', 'card', 'cod'],
    answer:
      'We accept UPI, credit/debit cards, net banking via Razorpay, and Cash on Delivery (COD) for orders below ₹5000.',
  },
  {
    keywords: ['cancel', 'cancellation'],
    answer:
      'Orders can be cancelled within 24 hours of placing them. After that, please use the return process once delivered.',
  },
  {
    keywords: ['track', 'tracking', 'status', 'where is my order'],
    answer:
      'Log in and go to My Orders to track your order status in real time.',
  },
  {
    keywords: ['discount', 'coupon', 'promo', 'offer', 'sale'],
    answer:
      'We run seasonal sales and offer promo codes via email. Check the Collection page for current offers.',
  },
  {
    keywords: ['contact', 'support', 'help', 'customer'],
    answer:
      'Reach us at support@riveto.com or use the Contact page. Our team responds within 24 hours.',
  },
  {
    keywords: ['material', 'fabric', 'quality'],
    answer:
      'All RIVETO products use premium quality fabrics. Material details are listed on each product page.',
  },
  {
    keywords: ['wash', 'care', 'clean'],
    answer:
      'Care instructions are printed on the garment label. Most items are machine washable in cold water.',
  },
];

// ─── Quick Reply Sets ─────────────────────────────────────────────────────────
const GUEST_QUICK_REPLIES = [
  { label: '🔐 Login to Shop', value: 'login' },
  { label: '📦 Shipping Info', value: 'shipping info' },
  { label: '↩️ Return Policy', value: 'return policy' },
  { label: '💳 Payment Options', value: 'payment options' },
  { label: '📏 Size Guide', value: 'size guide' },
  { label: '📞 Contact Us', value: 'contact us' },
];

const USER_QUICK_REPLIES = [
  { label: '🛒 My Cart', value: 'cart' },
  { label: '📦 My Orders', value: 'my orders' },
  { label: '🛍️ Collection', value: 'collection' },
  { label: '🏠 Home', value: 'home' },
  { label: '↩️ Return Policy', value: 'return policy' },
  { label: '🚚 Shipping Info', value: 'shipping info' },
];

// ── Uncomment when Gemini quota is available ──
// const askGemini = async (message, speak, setIsTyping, VITE_API_URL) => {
//   setIsTyping(true);
//   try {
//     const res = await fetch(`${VITE_API_URL}/bot`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message }),
//     });
//     const data = await res.json();
//     setIsTyping(false);
//     speak(data.reply || "Sorry, I couldn't get a response.");
//   } catch (err) {
//     setIsTyping(false);
//     speak("Something went wrong. Please try again.");
//   }
// };

function Ai() {
  const { showSearch, setShowSearch, product } = useContext(shopDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [activeAi, setActiveAi] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userChat, setUserchat] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);
  const openingSoundRef = useRef(new Audio(sound));
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!showChat) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [showChat]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // ─── Message helpers ──────────────────────────────────────────────────────
  const addUserMessage = (text) => {
    setChatMessages((prev) => [
      ...prev,
      { text, sender: 'user', timestamp: new Date() },
    ]);
  };

  const addBotMessage = (text, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { text, sender: 'ai', timestamp: new Date() },
      ]);
    }, delay);
  };

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
    addBotMessage(message);
  };

  // ─── FAQ Matcher ──────────────────────────────────────────────────────────
  const matchFAQ = (transcript) => {
    for (const item of FAQ) {
      if (item.keywords.some((kw) => transcript.includes(kw))) {
        return item.answer;
      }
    }
    return null;
  };

  // ─── Product Search ───────────────────────────────────────────────────────
  const searchProducts = (transcript) => {
    if (!product || product.length === 0) return null;
    const words = transcript
      .replace(/search|find|show|look for|i want|buy/g, '')
      .trim();
    if (words.length < 2) return null;
    const results = product
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(words) ||
          p.category?.toLowerCase().includes(words) ||
          p.subCategory?.toLowerCase().includes(words)
      )
      .slice(0, 3);
    if (results.length > 0) {
      navigate('/collection');
      setShowSearch(true);
      return `Found ${results.length} result(s) for "${words}": ${results.map((p) => p.name).join(', ')}. Taking you to the collection!`;
    }
    return null;
  };

  // ─── Navigate or redirect to login ───────────────────────────────────────
  const navigateOrLogin = (path, message) => {
    if (!userData) {
      addBotMessage(
        'Please log in first to access this page. Redirecting to login...'
      );
      setTimeout(() => navigate('/login', { state: { from: path } }), 1500);
      return;
    }
    speak(message);
    navigate(path);
    setShowSearch(false);
  };

  // ─── Main processor ───────────────────────────────────────────────────────
  const processTranscript = (transcript) => {
    // Greeting
    if (
      transcript.includes('hi') ||
      transcript.includes('hello') ||
      transcript.includes('hey')
    ) {
      speak(
        userData
          ? `Hey ${userData.name}! How can I help you today?`
          : `Hey there! I'm RIVETO Assistant. Ask me about shipping, returns, sizing, or log in to start shopping!`
      );
      return;
    }

    // About RIVETO
    if (
      transcript.includes('who are you') ||
      transcript.includes('what is riveto') ||
      transcript.includes('about us') ||
      transcript.includes('about riveto')
    ) {
      speak(
        'RIVETO is a modern fashion e-commerce store offering premium quality clothing. We provide trending styles with secure payments, fast delivery, and easy returns.'
      );
      return;
    }

    // Login
    if (transcript.includes('login') || transcript.includes('sign in')) {
      addBotMessage('Redirecting you to the login page...');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    // Navigation — all protected, use navigateOrLogin
    if (
      transcript.includes('collection') ||
      transcript.includes('products') ||
      transcript.includes('shop')
    ) {
      navigateOrLogin('/collection', 'Taking you to our collection page');
      return;
    }
    if (transcript.includes('about')) {
      navigateOrLogin('/about', "Here's our about page");
      return;
    }
    if (transcript.includes('home') || transcript.includes('main')) {
      navigateOrLogin('/', 'Going to the home page');
      return;
    }
    if (transcript.includes('contact')) {
      navigateOrLogin('/contact', 'Taking you to our contact page');
      return;
    }
    if (transcript.includes('cart') || transcript.includes('basket')) {
      navigateOrLogin('/cart', 'Opening your shopping cart');
      return;
    }
    if (transcript.includes('order') || transcript.includes('my orders')) {
      navigateOrLogin('/order', 'Showing your orders');
      return;
    }

    // Search open/close
    if (
      transcript.includes('search') &&
      transcript.includes('open') &&
      !showSearch
    ) {
      if (!userData) {
        addBotMessage('Please log in first. Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      speak('Opening search for you');
      setShowSearch(true);
      navigate('/collection');
      return;
    }
    if (
      transcript.includes('search') &&
      transcript.includes('close') &&
      showSearch
    ) {
      speak('Closing search');
      setShowSearch(false);
      return;
    }

    // Product search
    if (
      transcript.includes('search') ||
      transcript.includes('find') ||
      transcript.includes('looking for')
    ) {
      const result = searchProducts(transcript);
      if (result) {
        speak(result);
        return;
      }
    }

    // FAQ
    const faqAnswer = matchFAQ(transcript);
    if (faqAnswer) {
      speak(faqAnswer);
      return;
    }

    // Fallback
    // ── When Gemini quota is available, replace speak() below with: askGemini(transcript, speak, setIsTyping, import.meta.env.VITE_API_URL) ──
    speak(
      "I'm not sure about that. Try asking about shipping, returns, sizing, payment, or say 'go to collection'."
    );
    toast.info("Try: 'return policy', 'shipping info', 'go to cart'");
  };

  // ─── Text command ─────────────────────────────────────────────────────────
  const handleTextcommand = (inputValue) => {
    const text = (inputValue || userChat || '').trim();
    if (!text) return;
    const transcript = text.toLowerCase();
    addUserMessage(text);
    setUserchat('');
    processTranscript(transcript);
  };

  const handleVoiceCommand = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast.error('Speech recognition not supported');
      return;
    }
    setIsListening(true);
    openingSoundRef.current.play();
    setActiveAi(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      addUserMessage(transcript);
      processTranscript(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setActiveAi(false);
      if (event.error === 'not-allowed')
        toast.error('Please allow microphone access');
    };
    recognition.onend = () => {
      setIsListening(false);
      setActiveAi(false);
    };
    recognition.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Robot click ──────────────────────────────────────────────────────────
  const handleRobotClick = () => {
    setShowChat((prev) => !prev);
    if (!hasWelcomed && !showChat) {
      const greeting = userData
        ? `Welcome back ${userData.name}! How can I help you today?`
        : `Hi! I'm RIVETO Assistant. Please log in to browse and shop. I can answer questions about shipping, returns, sizing and payments!`;
      addBotMessage(greeting, 300);
      setHasWelcomed(true);
    }
  };

  const quickReplies = userData ? USER_QUICK_REPLIES : GUEST_QUICK_REPLIES;

  return (
    <div className="fixed bottom-28 md:bottom-6 right-5 z-40">
      {/* Robot */}
      <div className="relative cursor-pointer group" onClick={handleRobotClick}>
        <div className="absolute -top-2 -right-2 bg-[#EF4444] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
          <MessageCircle size={17} />
        </div>
        <img
          src={robot}
          alt="AI Assistant"
          className="w-20 h-20 transition-all duration-300"
          style={{
            filter: activeAi
              ? 'drop-shadow(0 4px 6px rgba(37,99,235,0.4))'
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          }}
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AI Assistant
        </div>
      </div>

      {/* Chat window */}
      {showChat && (
        <div
          className="absolute bottom-24 right-0 w-80 bg-white dark:bg-[#121826] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="bg-[#2563EB] text-white py-2 px-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-sm">RIVETO Assistant</h3>
              {!userData && (
                <span className="text-xs bg-blue-400 px-1.5 py-0.5 rounded-full">
                  Guest
                </span>
              )}
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 space-y-2"
          >
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-6">
                <p className="font-medium text-sm">
                  Hi! I'm your RIVETO assistant.
                </p>
                <p className="text-xs mt-1">
                  Ask me anything or pick an option below.
                </p>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addUserMessage(qr.label);
                    processTranscript(qr.value);
                  }}
                  className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center gap-1.5 flex-shrink-0">
            <input
              value={userChat}
              onChange={(e) => setUserchat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextcommand(userChat);
              }}
              type="text"
              placeholder={placeholders[index]}
              className="flex-1 placeholder:text-gray-400 text-black dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleTextcommand(userChat)}
              className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
            >
              <Send size={15} />
            </button>
            <button
              onClick={handleVoiceCommand}
              disabled={isListening}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ai;
