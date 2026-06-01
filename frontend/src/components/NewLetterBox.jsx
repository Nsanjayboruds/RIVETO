import { useState, useRef, useEffect } from 'react';

import { toast } from 'react-toastify';

function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scratchPercentageRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Set canvas size
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(2, 2);

    // Create scratch overlay with texture
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(0.5, '#cbd5e1');
    gradient.addColorStop(1, '#94a3b8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add texture pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(
        Math.random() * rect.width,
        Math.random() * rect.height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Add "Scratch Here" text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 24px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', rect.width / 2, rect.height / 2);
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Exclusive Membership', rect.width / 2, rect.height / 2 + 30);
  }, []);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(
      (x - rect.left) * scaleX,
      (y - rect.top) * scaleY,
      30 * scaleX,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Check scratch percentage
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    scratchPercentageRef.current = percentage;

    // If 40% scratched, reveal completely
    if (percentage > 40 && !isScratched) {
      setIsScratched(true);
    }
  };

  const handleMouseDown = () => setIsScratching(true);
  const handleMouseUp = () => setIsScratching(false);

  const handleMouseMove = (e) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleTouchStart = () => setIsScratching(true);
  const handleTouchEnd = () => setIsScratching(false);

  const handleTouchMove = (e) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      toast.success('Welcome to exclusive membership!');

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }, 1000);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-[#0B0F1A] dark:to-[#0B0F1A] px-4 py-16 md:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Split Editorial Layout */}
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
          {/* LEFT: Visual Scene */}
          <div
            ref={containerRef}
            className="relative bg-gradient-to-br from-[#2563EB] via-[#1d4ed8] to-[#1e40af] p-8 md:p-12 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]"
          >
            {/* Scratch Card Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-500 z-20 ${
                isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              style={{ touchAction: 'none' }}
            />

            {/* Ambient Gradient Orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Crown Icon - Content to be revealed */}
            <div
              className={`relative z-10 text-center transition-all duration-700 ${
                isScratched ? 'scale-100 opacity-100' : 'scale-95 opacity-80'
              }`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <FaCrown className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Members Only
              </h3>
              <p
                className="text-blue-100 text-sm md:text-base"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join 10,000+ style insiders
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-12 left-12 w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/3 right-12 w-2 h-2 bg-white/50 rounded-full"></div>
          </div>

          {/* RIGHT: Membership Copy */}
          <div className="bg-white dark:bg-[#121826] p-8 md:p-12 flex flex-col justify-center">
            {isSubscribed ? (
              // Success State
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/20">
                  <FaCheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  You're In!
                </h3>
                <p
                  className="text-gray-600 dark:text-gray-400"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  First drops are heading your way
                </p>
              </div>
            ) : (
              <>
                {/* Headline */}
                <div className="mb-6">
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Get Early Access
                  </h2>
                  <p
                    className="text-gray-600 dark:text-gray-400 text-base md:text-lg"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Members receive exclusive privileges others won't
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaBolt className="w-3 h-3 text-[#2563EB]" />
                    </div>
                    <p
                      className="text-gray-700 dark:text-gray-300 text-sm md:text-base"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <span className="font-semibold">First access</span> to
                      seasonal drops
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaGift className="w-3 h-3 text-[#2563EB]" />
                    </div>
                    <p
                      className="text-gray-700 dark:text-gray-300 text-sm md:text-base"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <span className="font-semibold">Exclusive deals</span> up
                      to 30% off launch week
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaStar className="w-3 h-3 text-[#2563EB]" />
                    </div>
                    <p
                      className="text-gray-700 dark:text-gray-300 text-sm md:text-base"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <span className="font-semibold">VIP invites</span> to
                      private sale events
                    </p>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0B0F1A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] 
                          transition-all duration-200"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl 
                        transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap active:scale-95"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Unlock Access
                    </button>
                  </div>

                  <p
                    className="text-gray-500 dark:text-gray-500 text-xs"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    No spam. Unsubscribe anytime. See our privacy policy.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-8 text-center">
          <p
            className="text-gray-500 dark:text-gray-400 text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Trusted by{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              10,000+
            </span>{' '}
            members worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

export default NewsletterBox;
