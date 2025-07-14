import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { brandConfig } from './config/brandConfig';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Core providers
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { QueryProvider } from './providers/QueryProvider';
import { AIProvider } from './contexts/AIContext';
import { NavigationProvider } from './contexts/NavigationContext';

// Types
import { AppRoute } from './types/routes';

// Core components
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleBasedDashboard } from './components/layout/RoleBasedDashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { Login } from './pages/auth/Login';
import { RegistrationLanding } from './pages/registration/RegistrationLanding';
import { OwnerProfile } from './pages/registration/OwnerProfile';
import { RegisterHorses } from './pages/registration/RegisterHorses';
import { RegisterFacility } from './pages/registration/RegisterFacility';
import RegisterPlanSelection from './pages/registration/RegisterPlanSelection';
import RegisterPayment from './pages/registration/RegisterPayment';
import RegisterConfirmation from './pages/registration/RegisterConfirmation';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import './App.css';
import './styles/animated-logo.css';

// Create theme based on brandConfig
const theme = createTheme({
  palette: {
    primary: {
      main: brandConfig.colors.stableMahogany,
    },
    secondary: {
      main: brandConfig.colors.hunterGreen,
    },
    background: {
      default: brandConfig.colors.arenaSand,
      paper: brandConfig.colors.arenaSand,
    },
    error: {
      main: brandConfig.colors.victoryRose,
    },
    warning: {
      main: brandConfig.colors.alertAmber,
    },
    success: {
      main: brandConfig.colors.pastureSage,
    },
    info: {
      main: brandConfig.colors.ribbonBlue,
    },
  },
  typography: {
    fontFamily: brandConfig.typography.fontPrimary,
    h1: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
    h2: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
    h3: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
    h4: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
    h5: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
    h6: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
    },
  },
});

// Smart redirect component that checks auth status
const SmartRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.barnWhite,
        fontFamily: brandConfig.typography.fontPrimary,
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{
          marginLeft: brandConfig.spacing.md,
          fontSize: brandConfig.typography.fontSizeLg,
          color: brandConfig.colors.midnightBlack,
        }}>
          Loading...
        </span>
      </div>
    );
  }
  
  if (user && user.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
};

// Navigation bridge component that connects old navigation to React Router
const NavigationBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const navigateTo = (route: AppRoute) => {
    const routeMap: Partial<Record<AppRoute, string>> = {
      'home': '/home',
      'login': '/login',
      'register': '/register',
      'features': '/features',
      'about': '/about',
      'contact': '/contact',
      'smart-dashboard': '/dashboard',
      'client-dashboard': '/dashboard',
      'employee-dashboard': '/dashboard',
      'admin-dashboard': '/dashboard',
      'manager-dashboard': '/dashboard',
      'register-owner': '/register/owner',
      'register-horses': '/register/horses',
      'register-facility': '/register/facility',
      'register-plans': '/register/plans',
      'register-payment': '/register/payment',
      'register-confirmation': '/register/confirmation',
    };
    
    const path = routeMap[route] || '/dashboard';
    navigate(path);
  };
  
  return (
    <NavigationProvider currentRoute={'home'} navigateTo={navigateTo}>
      {children}
    </NavigationProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <AuthProvider>
            <TenantProvider>
              <AIProvider>
                <Router>
                  <NavigationBridge>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<SmartRedirect />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      
                      {/* Registration Flow - Fully Functional */}
                      <Route path="/register" element={<RegistrationLanding />} />
                      <Route path="/register/owner" element={<OwnerProfile />} />
                      <Route path="/register/horses" element={<RegisterHorses />} />
                      <Route path="/register/facility" element={<RegisterFacility />} />
                      <Route path="/register/plans" element={<RegisterPlanSelection />} />
                      <Route path="/register/payment" element={<RegisterPayment />} />
                      <Route path="/register/confirmation" element={<RegisterConfirmation />} />
                      
                      {/* Main Dashboard - Role-based routing */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute requiredRoles={[
                            'db_admin', 'it_manager', 'it_support', 'partners', 'end_users',
                            'admin', 'administrator', 'manager', 'employee', 'client', 'veterinarian', 'support'
                          ]}>
                            <RoleBasedDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Admin Dashboard - Full access */}
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requiredRoles={['db_admin', 'admin', 'administrator']}>
                            <RoleBasedDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Fallback - redirect to login for unknown routes */}
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                  </NavigationBridge>
                </Router>
                </AIProvider>
            </TenantProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
