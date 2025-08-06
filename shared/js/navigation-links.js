/* =============================================================================
   FOSS Stack Hub - Navigation Links Configuration
   ============================================================================= */

export const navigationLinks = {
    home: {
        path: '/modules/landing/index.html',
        label: 'Home',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    dashboard: {
        path: '/modules/dashboard/dashboard.html',
        label: 'Dashboard',
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
    },
    profile: {
        path: '/modules/profile/profile.html',
        label: 'Profil',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    stacks: {
        path: '/modules/stack-viewer/stack-viewer.html',
        label: 'Stacks',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    stackEditor: {
        path: '/modules/stack-editor/index.html',
        label: 'Stack Editor',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    },
    leaderboard: {
        path: '/modules/leaderboard/leaderboard.html',
        label: 'Leaderboard',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
};

/**
 * Get the correct relative path based on current location
 */
export function getRelativePath(targetPath) {
    const currentPath = window.location.pathname;
    const currentDepth = currentPath.split('/').filter(p => p).length;
    const targetDepth = targetPath.split('/').filter(p => p).length;
    
    // Calculate relative path
    if (currentPath.includes('/modules/')) {
        // We're in a module, need to go up and then to target
        const upLevels = '../'.repeat(currentDepth - 2);
        return upLevels + targetPath.substring(1); // Remove leading /
    }
    
    return targetPath;
}

/**
 * Update all navigation links on the page
 */
export function updateNavigationLinks() {
    // Update main navigation
    const navItems = document.querySelectorAll('.nav-item[data-nav]');
    navItems.forEach(item => {
        const navKey = item.dataset.nav;
        if (navigationLinks[navKey]) {
            const link = navigationLinks[navKey];
            item.href = getRelativePath(link.path);
            
            // Update active state
            if (window.location.pathname.includes(link.path)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
    
    // Update CTA buttons
    const ctaButtons = document.querySelectorAll('[data-route]');
    ctaButtons.forEach(button => {
        const route = button.dataset.route;
        if (route === '/dashboard') {
            button.href = getRelativePath(navigationLinks.dashboard.path);
        }
    });
}

/**
 * Create navigation menu HTML
 */
export function createNavigationMenu(activeKey = '') {
    const menuItems = ['home', 'dashboard', 'stacks', 'leaderboard', 'profile'];
    
    return menuItems.map(key => {
        const link = navigationLinks[key];
        const isActive = key === activeKey ? 'active' : '';
        
        return `
            <a href="${getRelativePath(link.path)}" class="nav-item ${isActive}" data-nav="${key}">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path>
                </svg>
                <span>${link.label}</span>
            </a>
        `;
    }).join('');
}

/**
 * Initialize navigation
 */
export function initializeNavigation() {
    // Update all links
    updateNavigationLinks();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Alt + H = Home
        if (e.altKey && e.key === 'h') {
            window.location.href = getRelativePath(navigationLinks.home.path);
        }
        // Alt + D = Dashboard
        if (e.altKey && e.key === 'd') {
            window.location.href = getRelativePath(navigationLinks.dashboard.path);
        }
        // Alt + P = Profile
        if (e.altKey && e.key === 'p') {
            window.location.href = getRelativePath(navigationLinks.profile.path);
        }
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}