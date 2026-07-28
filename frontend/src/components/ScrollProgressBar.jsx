import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct = docHeight > 0
        ? Math.round((scrollTop / docHeight) * 100)
        : 0;
      setProgress(pct);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-black/10 dark:bg-white/10 z-[9999]">
      <div
        style={{ width: `${progress}%`, transition: "width 0.08s linear" }}
        className="h-full rounded-r-sm bg-gradient-to-r from-blue-500 to-purple-500"
      />
    </div>
  );
};

export default ScrollProgressBar;