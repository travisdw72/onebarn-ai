import type { AppRoute } from '../types/routes';

/**
 * Browser History Manager for Custom Routing System
 * 
 * This utility provides browser history management for the existing custom routing
 * system without breaking the current implementation. It syncs the URL with the
 * current route and handles browser back/forward navigation.
 */
class HistoryManager {
  private baseUrl: string;
  private isInitialized: boolean = false;
  private onNavigateCallback: ((route: AppRoute) => void) | null = null;

  constructor() {
    this.baseUrl = window.location.origin;
    this.initializePopStateHandler();
  }

  /**
   * Initialize the history manager with a navigation callback
   * @param onNavigate - Function to call when navigation occurs
   */
  initialize(onNavigate: (route: AppRoute) => void) {
    this.onNavigateCallback = onNavigate;
    this.isInitialized = true;
    
    // Get initial route from URL
    const initialRoute = this.getRouteFromUrl();
    if (initialRoute && initialRoute !== 'home') {
      // Only navigate if it's not the default route
      setTimeout(() => onNavigate(initialRoute), 0);
    }
  }

  /**
   * Navigate to a route and update browser history
   * @param route - The route to navigate to
   * @param replace - Whether to replace the current history entry
   */
  navigateTo(route: AppRoute, replace: boolean = false) {
    const url = this.getUrlFromRoute(route);
    
    if (replace) {
      window.history.replaceState({ route }, '', url);
    } else {
      window.history.pushState({ route }, '', url);
    }
    
    // Update page title
    this.updatePageTitle(route);
  }

  /**
   * Get the current route from the URL
   */
  private getRouteFromUrl(): AppRoute {
    const pathname = window.location.pathname;
    
    // Handle root path
    if (pathname === '/' || pathname === '') {
      return 'home';
    }
    
    // Remove leading slash and convert to route
    const routePath = pathname.replace(/^\//, '').replace(/\/$/, '');
    
    // Map URL paths to routes
    const urlToRouteMap: Record<string, AppRoute> = {
      '': 'home',
      'home': 'home',
      'login': 'login',
      'register': 'register',
      'register/owner': 'register-owner',
      'register/horses': 'register-horses',
      'register/facility': 'register-facility',
      'register/plans': 'register-plans',
      'register/payment': 'register-payment',
      'register/confirmation': 'register-confirmation',
      'dashboard': 'smart-dashboard',
      'ai/dashboard': 'ai-dashboard',
      'ai/monitor': 'ai-monitor',
      'ai/insights': 'ai-insights',
      'ai/observation': 'ai-observation',
      'ai/testing/single-image': 'ai-testing-single-image',
      'camera/monitor': 'camera-monitor',
      'camera/feed': 'camera-feed',
      'camera/wyze-v4': 'wyze-v4-dashboard',
      'camera/upload': 'video-upload',
      'demo': 'demo',
      'demo/video-analysis': 'video-analysis-demo',
      'demo/client-workflow': 'client-workflow-demo',
      'demo/barn-partner': 'barn-partner-demo',
      'demo/reolink': 'reolink-demo',
      'demo/camera-comparison': 'camera-comparison-demo',
      'tools/debug': 'debug-tools',
      'testing/overnight': 'overnight-test',
      'testing/threshold': 'simple-threshold-tester',
      'testing/horse-detection': 'horse-detection-tester',
      'testing/batch': 'batch-tester',
      // Legacy routes
      'legacy/home': 'legacy-home',
      'legacy/dashboard/employee': 'legacy-employee-dashboard',
      'legacy/dashboard/client': 'legacy-client-dashboard',
      'legacy/dashboard/manager': 'legacy-manager-dashboard',
      'legacy/dashboard/admin': 'legacy-admin-dashboard',
    };
    
    return urlToRouteMap[routePath] || 'home';
  }

  /**
   * Get URL path from route
   */
  private getUrlFromRoute(route: AppRoute): string {
    const routeToUrlMap: Record<AppRoute, string> = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'register-owner': '/register/owner',
      'register-horses': '/register/horses',
      'register-facility': '/register/facility',
      'register-plans': '/register/plans',
      'register-payment': '/register/payment',
      'register-confirmation': '/register/confirmation',
      'smart-dashboard': '/dashboard',
      'employee-dashboard': '/dashboard',
      'client-dashboard': '/dashboard',
      'manager-dashboard': '/dashboard',
      'admin-dashboard': '/dashboard',
      'veterinarian-dashboard': '/dashboard',
      'support-dashboard': '/dashboard',
      'ai-dashboard': '/ai/dashboard',
      'ai-monitor': '/ai/monitor',
      'ai-insights': '/ai/insights',
      'ai-observation': '/ai/observation',
      'ai-testing-single-image': '/ai/testing/single-image',
      'camera-monitor': '/camera/monitor',
      'camera-feed': '/camera/feed',
      'wyze-v4-dashboard': '/camera/wyze-v4',
      'video-upload': '/camera/upload',
      'demo': '/demo',
      'video-analysis-demo': '/demo/video-analysis',
      'client-workflow-demo': '/demo/client-workflow',
      'barn-partner-demo': '/demo/barn-partner',
      'reolink-demo': '/demo/reolink',
      'camera-comparison-demo': '/demo/camera-comparison',
      'debug-tools': '/tools/debug',
      'overnight-test': '/testing/overnight',
      'simple-threshold-tester': '/testing/threshold',
      'horse-detection-tester': '/testing/horse-detection',
      'batch-tester': '/testing/batch',
      // Legacy routes
      'legacy-home': '/legacy/home',
      'legacy-employee-dashboard': '/legacy/dashboard/employee',
      'legacy-client-dashboard': '/legacy/dashboard/client',
      'legacy-manager-dashboard': '/legacy/dashboard/manager',
      'legacy-admin-dashboard': '/legacy/dashboard/admin',
    };
    
    return routeToUrlMap[route] || '/';
  }

  /**
   * Update page title based on route
   */
  private updatePageTitle(route: AppRoute) {
    // This will be handled by the App component's useEffect
    // We just dispatch a custom event to notify
    window.dispatchEvent(new CustomEvent('route-changed', { detail: { route } }));
  }

  /**
   * Handle browser back/forward buttons
   */
  private initializePopStateHandler() {
    window.addEventListener('popstate', (event) => {
      if (!this.isInitialized || !this.onNavigateCallback) {
        return;
      }
      
      const route = event.state?.route || this.getRouteFromUrl();
      this.onNavigateCallback(route);
    });
  }

  /**
   * Get the current route from browser state
   */
  getCurrentRoute(): AppRoute {
    return window.history.state?.route || this.getRouteFromUrl();
  }

  /**
   * Replace the current history entry
   */
  replaceCurrentState(route: AppRoute) {
    this.navigateTo(route, true);
  }

  /**
   * Check if we can go back
   */
  canGoBack(): boolean {
    return window.history.length > 1;
  }

  /**
   * Go back in history
   */
  goBack() {
    if (this.canGoBack()) {
      window.history.back();
    }
  }

  /**
   * Go forward in history
   */
  goForward() {
    window.history.forward();
  }
}

// Create singleton instance
export const historyManager = new HistoryManager();

/**
 * Hook for using history manager in React components
 */
export const useHistoryManager = () => {
  return {
    navigateTo: (route: AppRoute, replace?: boolean) => historyManager.navigateTo(route, replace),
    getCurrentRoute: () => historyManager.getCurrentRoute(),
    canGoBack: () => historyManager.canGoBack(),
    goBack: () => historyManager.goBack(),
    goForward: () => historyManager.goForward(),
  };
}; 