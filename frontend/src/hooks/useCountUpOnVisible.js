import { useEffect, useMemo, useRef, useState } from 'react';

const parseStatNumber = (value) => {
  const normalized = String(value).trim();
  const match = /^([0-9]+)(.*)$/.exec(normalized);
  return {
    target: match ? Number(match[1]) : 0,
    suffix: match ? match[2] : '',
  };
};

const formatCount = (value, suffix) => `${value}${suffix}`;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const useCountUpOnVisible = (
  values = [],
  triggerRef,
  options = {}
) => {
  const { duration = 1000, threshold = 0.25, rootMargin = '0px 0px -20% 0px' } = options;
  const [displayValues, setDisplayValues] = useState(() =>
    values.map((value) => {
      const { suffix } = parseStatNumber(value);
      return formatCount(0, suffix);
    })
  );

  const hasAnimated = useRef(false);

  const statDefinitions = useMemo(
    () => values.map((value) => parseStatNumber(value)),
    [values]
  );

  useEffect(() => {
    const element = triggerRef?.current;
    if (!element || hasAnimated.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        hasAnimated.current = true;
        observer.disconnect();

        const startTime = performance.now();

        const step = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutCubic(progress);

          setDisplayValues(
            statDefinitions.map(({ target, suffix }) =>
              formatCount(Math.round(target * easedProgress), suffix)
            )
          );

          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };

        window.requestAnimationFrame(step);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef, duration, rootMargin, threshold, statDefinitions]);

  return displayValues;
};

export default useCountUpOnVisible;
