import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandConfig } from '../../config/brandConfig';
import { Header } from '../../components/layout/Header';
import { SecureAuthUtils, authConfig } from '../../config/authConfig';
import { useAuth } from '../../contexts/AuthContext';

interface ILoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<ILoginFormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'production' | 'demo' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAuthMode(null);

    try {
      // Use the new dual-mode authentication
      const authResult = await SecureAuthUtils.validateCredentials(
        formData.email,
        formData.password
      );
      
      if (authResult.isValid) {
        const userRole = authResult.userRole;
        
        // Set the auth mode for display
        setAuthMode(authResult.authMode);
        
        // Store session token if we have one from production auth
        if (authResult.authMode === 'production' && authResult.userData?.session_token) {
          localStorage.setItem('sessionToken', authResult.userData.session_token);
          localStorage.setItem('sessionExpires', authResult.userData.session_expires || '');
        }
        
        // Secure logging - no sensitive data
        SecureAuthUtils.secureLog('login_attempt', {
          email: formData.email,
          role: userRole,
          success: true,
          authMode: authResult.authMode
        });
        
        // Use AuthContext to set authentication state
        login(formData.email, userRole!);
        
        // Redirect all users to dashboard - role-based content is handled internally
        navigate('/dashboard');
      } else {
        // Secure logging for failed attempts
        SecureAuthUtils.secureLog('login_attempt', {
          email: formData.email,
          role: null,
          success: false
        });
        
        setError(`Invalid email or password. ${getCredentialsHint()}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get credentials hint based on current configuration
  const getCredentialsHint = (): string => {
    if (authConfig.production.enabled && authConfig.enableDemoFallback) {
      return 'Try production credentials or demo credentials below.';
    } else if (authConfig.production.enabled) {
      return 'Please use your production credentials.';
    } else {
      return 'Please use the demo credentials provided below.';
    }
  };

  // Credentials management removed for security
  // Authentication must be handled via proper login process

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)', // Account for header height
      padding: '1rem',
    },
    loginCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      borderLeft: `6px solid ${brandConfig.colors.stableMahogany}`,
      padding: '3rem',
      maxWidth: '500px', // Slightly wider for auth mode display
      width: '100%',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    title: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      margin: '0 0 0.5rem 0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    subtitle: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.sterlingSilver,
      margin: '0',
    },
    authModeIndicator: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeSm,
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      marginTop: '1rem',
      textAlign: 'center' as const,
      fontWeight: brandConfig.typography.weightMedium,
    },
    productionMode: {
      backgroundColor: '#10B981',
      color: '#FFFFFF',
    },
    demoMode: {
      backgroundColor: '#F59E0B',
      color: '#FFFFFF',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    label: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.midnightBlack,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
    },
    input: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      padding: '0.875rem 1rem',
      border: `2px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: '#FFFFFF',
      color: brandConfig.colors.midnightBlack,
      transition: 'border-color 0.2s ease',
      minHeight: '48px',
    },
    inputFocus: {
      borderColor: brandConfig.colors.stableMahogany,
      outline: 'none',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: brandConfig.colors.stableMahogany,
    },
    button: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      padding: '1rem 2rem',
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '48px',
      textTransform: 'none' as const,
    },
    buttonHover: {
      backgroundColor: '#5A3124',
      transform: 'translateY(-1px)',
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.errorRed,
      padding: '0.75rem 1rem',
      backgroundColor: '#FEF2F2',
      borderLeft: `4px solid ${brandConfig.colors.errorRed}`,
      borderRadius: '4px',
      margin: '1rem 0',
    },
    // Credentials styling removed for security
  };

  return (
    <div style={styles.pageContainer}>
      <Header />
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>One Barn</h1>
            <p style={styles.subtitle}>Enter your credentials to access the platform</p>
            
            {/* Authentication Mode Indicator */}
            {authConfig.production.enabled && (
              <div 
                style={{
                  ...styles.authModeIndicator,
                  ...styles.productionMode
                }}
              >
                🔐 Production Mode Active
                {authConfig.enableDemoFallback && " (with demo fallback)"}
              </div>
            )}
            
            {!authConfig.production.enabled && (
              <div 
                style={{
                  ...styles.authModeIndicator,
                  ...styles.demoMode
                }}
              >
                🔧 Demo Mode Active
              </div>
            )}
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <strong>Login Failed:</strong> {error}
            </div>
          )}

          {authMode && (
            <div 
              style={{
                ...styles.authModeIndicator,
                ...(authMode === 'production' ? styles.productionMode : styles.demoMode)
              }}
            >
              ✅ Authenticated via {authMode === 'production' ? 'Production Database' : 'Demo Mode'}
            </div>
          )}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                style={styles.input}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <input
                style={styles.input}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <div style={styles.checkboxContainer}>
              <input
                style={styles.checkbox}
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label style={styles.label} htmlFor="remember">
                Remember me
              </label>
            </div>

            <button
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonLoading : {})
              }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          {/* Registration Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem 0',
            borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
          }}>
            <p style={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontSize: brandConfig.typography.fontSizeBase,
              color: brandConfig.colors.neutralGray,
              margin: '0 0 1rem 0',
            }}>
              New to One Barn?
            </p>
            <button
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightMedium,
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: brandConfig.colors.stableMahogany,
                border: `2px solid ${brandConfig.colors.stableMahogany}`,
                borderRadius: brandConfig.layout.borderRadius,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '48px',
                textTransform: 'none',
              }}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = brandConfig.colors.stableMahogany;
                e.currentTarget.style.color = brandConfig.colors.arenaSand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = brandConfig.colors.stableMahogany;
              }}
            >
              Create New Account
            </button>
          </div>

          {/* Credentials auto-populate removed for security */}
        </div>
      </div>
    </div>
  );
}; 