import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AppRoute } from '../types/routes';

interface NavigationContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
  scrollToTop: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{
  children: ReactNode;
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
}> = ({ children, currentRoute, navigateTo }) => {
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  const enhancedNavigateTo = (route: AppRoute) => {
    navigateTo(route);
    // Scroll to top after navigation
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  return (
    <NavigationContext.Provider value={{ 
      currentRoute, 
      navigateTo: enhancedNavigateTo,
      scrollToTop 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}; 