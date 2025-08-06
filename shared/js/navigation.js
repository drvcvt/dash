/* =============================================================================
   FOSS Stack Hub - Navigation & Routing System
   ============================================================================= */

const navigationLinks = {
  home: {
    route: '/',
    path: '/modules/landing/index.html',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  dashboard: {
    route: '/dashboard',
    path: '/modules/dashboard/dashboard.html',
    label: 'Dashboard',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
  },
  stacks: {
    route: '/stack',
    path: '/modules/stack-viewer/stack-viewer.html',
    label: 'Stacks',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  stackEditor: {
    route: '/editor',
    path: '/modules/stack-editor/stack_editor.html',
    label: 'Stack Editor',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  leaderboard: {
    route: '/leaderboard',
    path: '/modules/leaderboard/leaderboard.html',
    label: 'Leaderboard',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  profile: {
    route: '/profile',
    path: '/modules/profile/profile.html',
    label: 'Profil',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }
};

function getRelativePath(targetPath) {
  const currentPath = window.location.pathname;
  const currentDepth = currentPath.split('/').filter(p => p).length;
  const targetDepth = targetPath.split('/').filter(p => p).length;

  if (currentPath.includes('/modules/')) {
    const upLevels = '../'.repeat(currentDepth - 2);
    return upLevels + targetPath.substring(1);
  }
  return targetPath;
}

function createNavigationMenu(activeRoute = '') {
  const order = ['home', 'dashboard', 'stacks', 'leaderboard', 'profile'];

  return order.map(key => {
    const link = navigationLinks[key];
    const isActive = link.route === activeRoute || (link.route === '/stack' && activeRoute.startsWith('/stack')) ? 'active' : '';

    return `
            <a href="${getRelativePath(link.path)}" class="nav-item ${isActive}" data-route="${link.route}">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path>
                </svg>
                <span>${link.label}</span>
            </a>
        `;
  }).join('');
}

function renderNavigationMenu(currentRoute) {
  const nav = document.querySelector('.nav-menu[data-standard-nav]');
  if (nav) {
    nav.innerHTML = createNavigationMenu(currentRoute);
  }
}

function updateDataRouteLinks() {
  document.querySelectorAll('[data-route]').forEach(item => {
    const route = item.getAttribute('data-route');
    const link = Object.values(navigationLinks).find(l => l.route === route);
    if (link) {
      item.setAttribute('href', getRelativePath(link.path));
    }
  });
}

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

    this.routes.set('/stack', {
      path: 'modules/stack-viewer/stack-viewer.html',
      title: 'Stacks - FOSS Stack Hub',
      module: 'stack-viewer'
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
      if (
        route === currentRoute ||
        (route === '/stack' && currentRoute.startsWith('/stack')) ||
        (currentRoute === '/' && route === '#')
      ) {
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
        route = '/stack';
      } else if (modulePath.startsWith('leaderboard/')) {
        route = '/leaderboard';
      } else if (modulePath.startsWith('profile/')) {
        route = '/profile'; // Simplified profile route
      }
    }

    this.currentRoute = route;

    renderNavigationMenu(route);
    updateDataRouteLinks();

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
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'h') {
        window.router.navigate('/');
      }
      if (e.altKey && e.key === 'd') {
        window.router.navigate('/dashboard');
      }
      if (e.altKey && e.key === 'p') {
        window.router.navigate('/profile');
      }
    });
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
  module.exports = { Router, SmoothScroll, navigationLinks, getRelativePath, createNavigationMenu };
} 