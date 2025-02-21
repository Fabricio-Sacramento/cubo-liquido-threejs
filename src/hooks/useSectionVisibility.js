// src/hooks/useSectionVisibility.js
import { useState, useEffect } from 'react';

const useSectionVisibility = (ref, options = { threshold: 1 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.intersectionRatio >= options.threshold);
    }, options);

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isVisible;
};

export default useSectionVisibility;
