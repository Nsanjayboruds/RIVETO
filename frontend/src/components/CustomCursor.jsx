import { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Main shopping bag icon */}
      <div className="relative animate-float">
        <BsHandbag
          className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          size={32}
        />
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-30 rounded-full scale-150"></div>
      </div>
    </div>
  );
}

export default CustomCursor;
