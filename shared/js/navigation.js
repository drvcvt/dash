/* =============================================================================
   FOSS Stack Hub - Navigation & Routing System
   ============================================================================= */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = '';
    this.basePath = this.getBasePath();
    this.init();
  }

  init() {
    this.setupRoutes();
    this.setupEventListeners();
    this.handleCurrentRoute();
  }

  getBasePath() {
    // Determine if we're in a module subdirectory
    const path = window.location.pathname;
    if (path.includes('/modules/')) {
      return '../../';
    }
    return './';
  }

  setupRoutes() {
    // Define application routes
    this.routes.set('/', {
      path: 'modules/landing/index.html',
      title: 'FOSS Stack Hub - Home',
      module: 'landing'
    });
    
    this.routes.set('/dashboard', {
      path: 'modules/dashboard/dashboard.html',
      title: 'Dashboard - FOSS Stack Hub',
      module: 'dashboard'
    });
    
    this.routes.set('/editor', {
      path: 'modules/stack-editor/stack_editor.html',
      title: 'Stack Editor - FOSS Stack Hub',
      module: 'stack-editor'
    });
    
    this.routes.set('/stack/:id', {
      path: 'modules/stack-viewer/stack-viewer.html',
      title: 'Stack Details - FOSS Stack Hub',
      module: 'stack-viewer'
    });
    
    this.routes.set('/leaderboard', {
      path: 'modules/leaderboard/leaderboard.html',
      title: 'Leaderboard - FOSS Stack Hub',
      module: 'leaderboard'
    });
    
    this.routes.set('/profile/:username', {
      path: 'modules/profile/profile.html',
      title: 'Profile - FOSS Stack Hub',
      module: 'profile'
    });

    // Add direct profile route without username
    this.routes.set('/profile', {
      path: 'modules/profile/profile.html',
      title: 'Profile - FOSS Stack Hub',
      module: 'profile'
    });
  }

  setupEventListeners() {
    console.log('🔧 Navigation: Setting up event listeners...');
    
    // Handle navigation link clicks
    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-route]');
      if (link) {
        console.log('🎯 Navigation: Clicked on route:', link.getAttribute('data-route'));
        event.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleCurrentRoute();
    });

    // Handle hash changes for same-page navigation
    window.addEventListener('hashchange', () => {
      this.scrollToHash();
    });
  }

  navigate(route, params = {}) {
    console.log('🧭 Navigation: Attempting to navigate to:', route);
    
    if (route === this.currentRoute) {
      console.log('📍 Navigation: Already on current route, skipping');
      return;
    }

    const routeInfo = this.getRouteInfo(route);
    if (!routeInfo) {
      console.warn(`❌ Navigation: Route not found: ${route}`);
      return;
    }

    console.log('📋 Navigation: Route info found:', routeInfo);

    // Store current route
    this.currentRoute = route;
    
    // Calculate the correct path based on current location
    let targetPath;
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/modules/')) {
      // We're in a module, need to navigate relative to the root
      targetPath = '../../' + routeInfo.path;
    } else {
      // We're at the root, navigate directly
      targetPath = routeInfo.path;
    }
    
    console.log('🎯 Navigation: Target path calculated:', targetPath);
    console.log('🔀 Navigation: Redirecting now...');
    
    // Navigate to the new page
    window.location.href = targetPath + window.location.search + window.location.hash;
  }

  getRouteInfo(route) {
    // Check for exact match first
    if (this.routes.has(route)) {
      return this.routes.get(route);
    }

    // Check for parameterized routes
    for (const [pattern, routeInfo] of this.routes) {
      const regex = this.createRouteRegex(pattern);
      if (regex.test(route)) {
        return { ...routeInfo, pattern };
      }
    }

    return null;
  }

  createRouteRegex(pattern) {
    // Convert route pattern to regex (e.g., /stack/:id -> /stack/([^/]+))
    const regexPattern = pattern
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    return new RegExp(`^${regexPattern}$`);
  }

  extractParams(route, pattern) {
    const regex = this.createRouteRegex(pattern);
    const matches = route.match(regex);
    
    if (!matches) return {};
    
    const paramNames = pattern.match(/:[^/]+/g) || [];
    const params = {};
    
    paramNames.forEach((param, index) => {
      const paramName = param.substring(1); // Remove ':'
      params[paramName] = matches[index + 1];
    });
    
    return params;
  }

  loadRoute(routeInfo, params = {}) {
    // Calculate the correct path based on current location
    let targetPath;
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/modules/')) {
      // We're in a module, need to navigate relative to the root
      targetPath = '../../' + routeInfo.path;
    } else {
      // We're at the root, navigate directly
      targetPath = routeInfo.path;
    }
    
    // Navigate to the new page
    window.location.href = targetPath + window.location.search + window.location.hash;
  }

  updatePageState(routeInfo, params) {
    // Update document title
    document.title = routeInfo.title;
    
    // Update navigation active states
    this.updateNavigationState(this.currentRoute);
    
    // Dispatch route change event for modules to listen to
    window.dispatchEvent(new CustomEvent('routeChanged', {
      detail: { route: this.currentRoute, params, module: routeInfo.module }
    }));
  }

  updateNavigationState(currentRoute) {
    // Update active navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      
      const route = item.getAttribute('data-route') || item.getAttribute('href');
      if (route === currentRoute || (currentRoute === '/' && route === '#')) {
        item.classList.add('active');
      }
    });
  }

  handleCurrentRoute() {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    // Extract route from current URL
    let route = '/';
    if (path.includes('/modules/')) {
      // We're in a module, determine which one
      const modulePath = path.split('/modules/')[1];
      if (modulePath.startsWith('dashboard/')) {
        route = '/dashboard';
      } else if (modulePath.startsWith('stack-editor/')) {
        route = '/editor';
      } else if (modulePath.startsWith('stack-viewer/')) {
        route = '/stack/demo'; // TODO: Extract actual stack ID
      } else if (modulePath.startsWith('leaderboard/')) {
        route = '/leaderboard';
      } else if (modulePath.startsWith('profile/')) {
        route = '/profile'; // Simplified profile route
      }
    }
    
    this.currentRoute = route;
    
    // Update navigation state
    this.updateNavigationState(route);
    
    // Handle hash navigation
    if (hash) {
      setTimeout(() => this.scrollToHash(), 100);
    }
  }

  scrollToHash() {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Public API
  getCurrentRoute() {
    return this.currentRoute;
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  reload() {
    window.location.reload();
  }

  // Utility method for modules to check current route
  isRoute(route) {
    return this.currentRoute === route;
  }

  isModule(moduleName) {
    const routeInfo = this.getRouteInfo(this.currentRoute);
    return routeInfo && routeInfo.module === moduleName;
  }
}

// Smooth scrolling for anchor links
class SmoothScroll {
  static init() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL hash
          history.replaceState(null, null, targetId);
        }
      }
    });
  }
}

// Initialize navigation system
const initNavigation = () => {
  if (typeof window !== 'undefined') {
    console.log('🚀 Navigation: Initializing router system...');
    window.router = new Router();
    SmoothScroll.init();
    console.log('✅ Navigation: Router initialized successfully!');
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Router, SmoothScroll };
} 