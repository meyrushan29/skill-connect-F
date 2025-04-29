import { useEffect, useState } from 'react';

// Custom hook that uses Intersection Observer API
const useIntersectionObserver = (ref, options = {}, once = true) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (once && entry.isIntersecting) {
        setIsVisible(true);
      } else if (!once && entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options, once]);

  return isVisible;
};

export default useIntersectionObserver;
