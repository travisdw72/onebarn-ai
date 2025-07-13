import { useEffect } from 'react';

/**
 * Custom hook to scroll to the top of the page
 * Used to ensure users start at the top of registration pages
 */
export const useScrollToTop = (trigger?: any) => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, [trigger]);
};

/**
 * Custom hook to immediately scroll to top (no animation)
 * Used for instant page transitions
 */
export const useScrollToTopImmediate = (trigger?: any) => {
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
  }, [trigger]);
};

/**
 * Custom hook for scroll restoration
 * Scrolls to top and manages scroll position state
 */
export const useScrollRestoration = () => {
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  const scrollToTopImmediate = () => {
    window.scrollTo(0, 0);
  };

  return {
    scrollToTop,
    scrollToTopImmediate
  };
}; 