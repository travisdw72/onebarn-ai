import React, { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../common/Logo';

interface ITab {
  id: string;
  label: string;
  icon: React.ReactNode;
  dropdown?: IDropdownItem[];
}

interface IDropdownItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  showNavigation?: boolean;
  dashboardTabs?: ITab[];
  selectedTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  showNavigation = true, 
  dashboardTabs = [], 
  selectedTab = 'overview',
  onTabChange 
}) => {
  const { currentRoute, navigateTo } = useNavigation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const styles = {
    header: {
      backgroundColor: brandConfig.colors.midnightBlack,
      color: brandConfig.colors.arenaSand,
      padding: '1rem 0',
      boxShadow: brandConfig.layout.boxShadow,
      position: 'relative' as const,
    },
    headerContent: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      padding: `0 ${brandConfig.spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative' as const,
    },
    logo: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      cursor: 'pointer',
    },
    dashboardNav: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
    },
    homeNav: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem', // Space between navigation and user section
    },
    navLink: {
      color: brandConfig.colors.arenaSand,
      textDecoration: 'none',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: brandConfig.mobile.touchTargets.minimal,
      display: 'flex',
      alignItems: 'center',
    },
    navTab: {
      color: brandConfig.colors.arenaSand,
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '0.875rem', // Compact: reduced from fontSizeBase
      fontWeight: brandConfig.typography.weightMedium,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem', // Compact: reduced from 0.75rem 1rem
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: brandConfig.mobile.touchTargets.minimal,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem', // Compact: reduced from 0.5rem
      position: 'relative' as const,
    },
    activeNavTab: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
    },
    dropdownContainer: {
      position: 'relative' as const,
    },
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: '0',
      backgroundColor: brandConfig.colors.midnightBlack,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: `0 4px 12px ${brandConfig.colors.midnightBlack}66`,
      zIndex: 1000,
      minWidth: '180px',
      opacity: 0,
      transform: 'translateY(-10px)',
      transition: 'all 0.2s ease',
      pointerEvents: 'none' as const,
    },
    dropdownActive: {
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto' as const,
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      color: brandConfig.colors.arenaSand,
      backgroundColor: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left' as const,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: brandConfig.typography.weightMedium,
      transition: 'all 0.2s ease',
      borderRadius: 0,
    },
    dropdownItemHover: {
      backgroundColor: brandConfig.colors.stableMahogany,
    },
    dropdownItemFirst: {
      borderTopLeftRadius: brandConfig.layout.borderRadius,
      borderTopRightRadius: brandConfig.layout.borderRadius,
    },
    dropdownItemLast: {
      borderBottomLeftRadius: brandConfig.layout.borderRadius,
      borderBottomRightRadius: brandConfig.layout.borderRadius,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    welcomeText: {
      color: brandConfig.colors.arenaSand,
      fontSize: brandConfig.typography.fontSizeBase,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      padding: '0.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      textDecoration: 'none',
    },
    welcomeTextHover: {
      color: brandConfig.colors.goldenStraw,
      backgroundColor: `${brandConfig.colors.stableMahogany}33`,
    },
    loginButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: brandConfig.mobile.touchTargets.minimal,
      minWidth: brandConfig.mobile.touchTargets.minimal,
    },
    hamburger: {
      backgroundColor: 'transparent',
      border: 'none',
      color: brandConfig.colors.arenaSand,
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: brandConfig.mobile.touchTargets.minimal,
      minWidth: brandConfig.mobile.touchTargets.minimal,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mobileMenu: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: brandConfig.colors.midnightBlack,
      borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
      boxShadow: brandConfig.layout.boxShadow,
      display: isMobileMenuOpen ? 'block' : 'none',
      zIndex: 1000,
    },
    mobileMenuContent: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      padding: '1rem 1.5rem',
    },
    mobileMenuItem: {
      display: 'block',
      color: brandConfig.colors.arenaSand,
      textDecoration: 'none',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      padding: '1rem 0',
      borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      transition: 'color 0.2s ease',
      cursor: 'pointer',
    },
  };

  const handleLogoClick = () => {
    navigateTo('home');
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (currentRoute === 'login') {
      navigateTo('home');
    } else {
      navigateTo('login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigateTo('home');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null); // Close any open dropdowns
  };

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeNavClick = (section: string) => {
    setIsMobileMenuOpen(false);
    // Special case: navigate to features page
    if (section === '#features') {
      navigateTo('features');
      return;
    }
    // Scroll to section for single page navigation
    if (section.startsWith('#')) {
      const element = document.querySelector(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDashboardClick = () => {
    setIsMobileMenuOpen(false);
    navigateTo('smart-dashboard');
  };

  const handleDropdownToggle = (tabId: string) => {
    setActiveDropdown(activeDropdown === tabId ? null : tabId);
  };

  const handleDropdownItemClick = (itemId: string) => {
    if (onTabChange) {
      onTabChange(itemId);
    }
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  return (
    <>
      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-nav {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
      <header style={styles.header}>
        <div style={styles.headerContent} className="header-mobile-content">
          <Logo 
            variant="header" 
            theme="light" 
            onClick={handleLogoClick}
          />
          
          <div style={styles.rightSection}>
            {showNavigation && (
              <>
                {dashboardTabs.length > 0 ? (
                  <>
                    {/* Desktop Navigation - Dashboard Tabs */}
                    <nav style={styles.dashboardNav} className="desktop-nav">
                      {dashboardTabs.map((tab) => (
                        <div 
                          key={tab.id} 
                          style={styles.dropdownContainer}
                          className="dropdown-container"
                        >
                          <button
                            style={{
                              ...styles.navTab,
                              ...(selectedTab === tab.id ? styles.activeNavTab : {}),
                              ...(activeDropdown === tab.id ? styles.activeNavTab : {}),
                            }}
                            onClick={() => {
                              if (tab.dropdown) {
                                handleDropdownToggle(tab.id);
                              } else {
                                handleTabClick(tab.id);
                              }
                            }}
                          >
                            {tab.icon}
                            <span>{tab.label}</span>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {tab.dropdown && (
                            <div
                              style={{
                                ...styles.dropdown,
                                ...(activeDropdown === tab.id ? styles.dropdownActive : {}),
                              }}
                            >
                              {tab.dropdown.map((item, index) => (
                                <button
                                  key={item.id}
                                  style={{
                                    ...styles.dropdownItem,
                                    ...(index === 0 ? styles.dropdownItemFirst : {}),
                                    ...(index === tab.dropdown!.length - 1 ? styles.dropdownItemLast : {}),
                                    ...(selectedTab === item.id ? styles.dropdownItemHover : {}),
                                  }}
                                  onClick={() => handleDropdownItemClick(item.id)}
                                  onMouseEnter={(e) => {
                                    if (selectedTab !== item.id) {
                                      Object.assign((e.target as HTMLElement).style, styles.dropdownItemHover);
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (selectedTab !== item.id) {
                                      Object.assign((e.target as HTMLElement).style, styles.dropdownItem);
                                    }
                                  }}
                                >
                                  {item.icon}
                                  <span>{item.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>
                  </>
                ) : (
                  <>
                    {/* Desktop Navigation - Home Page */}
                    <nav style={styles.homeNav} className="desktop-nav">
                      {user?.isAuthenticated && (
                        <a 
                          style={styles.navLink} 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDashboardClick();
                          }}
                        >
                          Dashboard
                        </a>
                      )}
                      <a 
                        style={styles.navLink} 
                        href="#features"
                        onClick={(e) => {
                          e.preventDefault();
                          handleHomeNavClick('#features');
                        }}
                      >
                        Features
                      </a>
                      <a 
                        style={styles.navLink} 
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault();
                          handleHomeNavClick('#about');
                        }}
                      >
                        About
                      </a>
                      <a 
                        style={styles.navLink} 
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          handleHomeNavClick('#contact');
                        }}
                      >
                        Contact
                      </a>
                    </nav>
                  </>
                )}

                {/* Mobile Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-nav">
                  <button style={styles.hamburger} onClick={toggleMobileMenu}>
                    ☰
                  </button>
                </div>
              </>
            )}

            {/* User Section */}
            <div style={styles.userSection}>
              {user?.isAuthenticated ? (
                <>
                  <span 
                    style={styles.welcomeText}
                    onClick={handleDashboardClick}
                    onMouseEnter={(e) => {
                      Object.assign((e.target as HTMLElement).style, styles.welcomeTextHover);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign((e.target as HTMLElement).style, styles.welcomeText);
                    }}
                    title="Click to go to dashboard"
                  >
                    Welcome, {user.email?.split('@')[0] || 'User'}
                  </span>
                  <button style={styles.loginButton} onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button style={styles.loginButton} onClick={handleLoginClick}>
                  {currentRoute === 'login' ? 'Home' : 'Login'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuContent}>
            {dashboardTabs.length > 0 ? (
              // Dashboard tabs for mobile
              dashboardTabs.map((tab) => (
                <div key={tab.id}>
                  <div
                    style={{
                      ...styles.mobileMenuItem,
                      ...(selectedTab === tab.id ? { color: brandConfig.colors.stableMahogany } : {}),
                    }}
                    onClick={() => {
                      if (tab.dropdown) {
                        handleDropdownToggle(tab.id);
                      } else {
                        handleTabClick(tab.id);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.dropdown && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                          {activeDropdown === tab.id ? '▼' : '▶'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile Dropdown Items */}
                  {tab.dropdown && activeDropdown === tab.id && (
                    <div style={{ paddingLeft: '2rem' }}>
                      {tab.dropdown.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            ...styles.mobileMenuItem,
                            ...(selectedTab === item.id ? { color: brandConfig.colors.stableMahogany } : {}),
                            borderBottom: 'none',
                            padding: '0.75rem 0',
                          }}
                          onClick={() => handleDropdownItemClick(item.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Home page navigation for mobile
              <>
                {user?.isAuthenticated && (
                  <div
                    style={styles.mobileMenuItem}
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </div>
                )}
                <div
                  style={styles.mobileMenuItem}
                  onClick={() => handleHomeNavClick('#features')}
                >
                  Features
                </div>
                <div
                  style={styles.mobileMenuItem}
                  onClick={() => handleHomeNavClick('#about')}
                >
                  About
                </div>
                <div
                  style={styles.mobileMenuItem}
                  onClick={() => handleHomeNavClick('#contact')}
                >
                  Contact
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}; 