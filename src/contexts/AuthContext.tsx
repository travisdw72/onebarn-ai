import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface IUser {
  email: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
  tenantId?: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, role: string) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthState = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');

      if (isAuthenticated && userRole && userEmail) {
        setUser({
          email: userEmail,
          name: userEmail.split('@')[0], // Use email prefix as name for now
          role: userRole,
          isAuthenticated: true
        });
      }
      
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const login = (email: string, role: string) => {
    const userData = {
      email,
      name: email.split('@')[0], // Use email prefix as name for now
      role,
      isAuthenticated: true
    };
    
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionExpires');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: user?.isAuthenticated ?? false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 