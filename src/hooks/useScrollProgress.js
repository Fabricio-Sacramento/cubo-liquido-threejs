import { useState, useEffect } from 'react';

const useScrollProgress = (start, end) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progressValue = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
      setProgress(progressValue);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [start, end]);

  return progress;
};

export default useScrollProgress;
