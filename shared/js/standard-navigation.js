/* =============================================================================
   FOSS Stack Hub - Einheitliche Standard Navigation
   ============================================================================= */

/**
 * Erstellt die standardisierte Navigation-HTML die auf allen Seiten gleich ist
 */
function createStandardNavigation(currentRoute = '') {
    return `
        <div class="nav-menu">
            <a href="#" class="nav-item ${currentRoute === '/' ? 'active' : ''}" data-route="/">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Home</span>
            </a>
            <a href="#" class="nav-item ${currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                </svg>
                <span>Dashboard</span>
            </a>
            <a href="#" class="nav-item ${currentRoute === '/editor' ? 'active' : ''}" data-route="/editor">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Editor</span>
            </a>
            <a href="#" class="nav-item ${currentRoute.startsWith('/stack') ? 'active' : ''}" data-route="/stack/demo">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span>Stacks</span>
            </a>
            <a href="#" class="nav-item ${currentRoute === '/leaderboard' ? 'active' : ''}" data-route="/leaderboard">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Leaderboard</span>
            </a>
            <a href="#" class="nav-item ${currentRoute === '/profile' ? 'active' : ''}" data-route="/profile">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Profil</span>
            </a>
        </div>
    `;
}

/**
 * Aktualisiert die Navigation einer Seite mit der Standard-Navigation
 */
function updatePageNavigation(currentRoute = '') {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.innerHTML = createStandardNavigation(currentRoute).replace('<div class="nav-menu">', '').replace('</div>', '');
        console.log('✅ Standard Navigation: Updated for route:', currentRoute);
    } else {
        console.warn('⚠️ Standard Navigation: .nav-menu not found on this page');
    }
}

/**
 * Automatische Initialisierung der Standard-Navigation
 */
function initStandardNavigation() {
    // Bestimme die aktuelle Route basierend auf dem Pfad
    let currentRoute = '/';
    const path = window.location.pathname;
    
    if (path.includes('/dashboard')) {
        currentRoute = '/dashboard';
    } else if (path.includes('/profile')) {
        currentRoute = '/profile';
    } else if (path.includes('/leaderboard')) {
        currentRoute = '/leaderboard';
    } else if (path.includes('/stack-editor')) {
        currentRoute = '/editor';
    } else if (path.includes('/stack-viewer')) {
        currentRoute = '/stack/demo';
    } else if (path.includes('/landing')) {
        currentRoute = '/';
    }
    
    console.log('🧭 Standard Navigation: Detected current route:', currentRoute);
    
    // Warte bis DOM geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => updatePageNavigation(currentRoute));
    } else {
        updatePageNavigation(currentRoute);
    }
}

// Auto-Initialisierung
initStandardNavigation(); 