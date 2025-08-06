/* =============================================================================
   FOSS Stack Hub - Verbessertes Dashboard JavaScript (CSS-Animation-fokussiert)
   ============================================================================= */

/**
 * Optimiertes Dashboard mit CSS-Animationen statt JS-Animationen
 */
class ImprovedDashboard {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialisierung des Dashboards
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            // Verwende requestAnimationFrame für bessere Performance
            requestAnimationFrame(() => {
                this.generateActivityGrid();
                this.setupViewToggles();
                this.setupInteractiveElements();
                this.initializeThemeToggle();
                this.addAccessibilityFeatures();
                this.isInitialized = true;
            });
        } catch (error) {
            console.warn('Dashboard initialization warning:', error);
        }
    }

    /**
     * Generiert die Activity Grid mit CSS-Animationen
     */
    generateActivityGrid() {
        const activityGrid = document.getElementById('activityGrid');
        if (!activityGrid) return;

        // Verwende DocumentFragment für bessere Performance
        const fragment = document.createDocumentFragment();
        const totalSquares = 371;
        const currentDate = new Date();
        
        for (let i = 0; i < totalSquares; i++) {
            const square = document.createElement('div');
            const level = this.getRandomActivityLevel();
            square.className = `activity-square level-${level}`;
            
            // Berechne das Datum
            const date = new Date(currentDate);
            date.setDate(date.getDate() - (totalSquares - i));
            
            // Verwende data-attributes statt title für bessere Performance
            square.setAttribute('data-date', date.toLocaleDateString('de-DE'));
            square.setAttribute('data-activity', this.getActivityText(level));
            square.setAttribute('title', `${this.getActivityText(level)} am ${date.toLocaleDateString('de-DE')}`);
            
            // Füge subtile Animation-Delay hinzu
            square.style.animationDelay = `${i * 2}ms`;
            
            fragment.appendChild(square);
        }
        
        activityGrid.appendChild(fragment);
    }

    /**
     * Verbesserte Activity Level Berechnung
     */
    getRandomActivityLevel() {
        const weights = [0.4, 0.25, 0.2, 0.1, 0.05];
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) return i;
        }
        return 0;
    }

    /**
     * Activity Text basierend auf Level
     */
    getActivityText(level) {
        const activities = [
            'Keine Aktivität',
            '1-2 Beiträge',
            '3-5 Beiträge',
            '6-8 Beiträge',
            '9+ Beiträge'
        ];
        return activities[level] || activities[0];
    }

    /**
     * Setup für View Toggles mit CSS Transitions
     */
    setupViewToggles() {
        const viewToggles = document.querySelectorAll('.view-toggle');
        const stackFeed = document.getElementById('stackFeed');
        
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Entferne active von allen
                viewToggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                
                // Füge CSS-Klasse für View-Wechsel hinzu
                const view = toggle.dataset.view;
                if (stackFeed) {
                    stackFeed.className = `stack-feed ${view}-view`;
                    
                    // Trigger Reflow für Animation
                    stackFeed.offsetHeight;
                    
                    // Animiere Karten mit CSS
                    const cards = stackFeed.querySelectorAll('.stack-card');
                    cards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 50}ms`;
                        card.classList.add('fade-in');
                    });
                }
            });
        });
    }

    /**
     * Verbesserte interaktive Elemente
     */
    setupInteractiveElements() {
        // Lazy Loading für Bilder
        this.setupLazyLoading();
        
        // Smooth Scroll für interne Links
        this.setupSmoothScroll();
        
        // Keyboard Navigation
        this.setupKeyboardNavigation();
        
        // Touch-freundliche Interaktionen
        this.setupTouchInteractions();
    }

    /**
     * Theme Toggle mit verbesserter UX
     */
    initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Füge visuelles Feedback hinzu
        themeToggle.addEventListener('click', () => {
            // CSS kümmert sich um die Animation
            themeToggle.classList.add('clicked');
            setTimeout(() => {
                themeToggle.classList.remove('clicked');
            }, 600);
        });

        // Zeige aktuelles Theme als Tooltip
        this.updateThemeTooltip();
        window.addEventListener('themeChanged', () => {
            this.updateThemeTooltip();
        });
    }

    /**
     * Update Theme Tooltip
     */
    updateThemeTooltip() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle || !window.themeManager) return;

        const currentTheme = window.themeManager.theme;
        const themeNames = {
            'auto': 'Automatisch',
            'light': 'Hell',
            'dark': 'Dunkel'
        };
        
        themeToggle.setAttribute('title', `Theme: ${themeNames[currentTheme]} (Klicken zum Wechseln)`);
    }

    /**
     * Lazy Loading für bessere Performance
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Smooth Scroll für bessere UX
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Keyboard Navigation
     */
    setupKeyboardNavigation() {
        // Fokus-Management für bessere Accessibility
        const focusableElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Tab-Trap für Modals (falls vorhanden)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Schließe offene Modals/Dropdowns
                this.closeAllDropdowns();
            }
        });
    }

    /**
     * Touch-Interaktionen für Mobile
     */
    setupTouchInteractions() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Swipe-Gesten für Mobile Navigation
        this.handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                // Swipe left - könnte nächste Seite öffnen
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - könnte vorherige Seite öffnen
            }
        };
    }

    /**
     * Accessibility Features
     */
    addAccessibilityFeatures() {
        // ARIA Labels
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Statistik ${index + 1}`);
        });

        // Skip Links
        this.addSkipLinks();

        // Fokus-Indikator verbessern
        document.body.classList.add('keyboard-nav');
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
    }

    /**
     * Skip Links für Screen Reader
     */
    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Zum Hauptinhalt springen';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Hilfsfunktion: Alle Dropdowns schließen
     */
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
}

// Initialisiere Dashboard wenn DOM bereit ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new ImprovedDashboard();
    });
} else {
    window.dashboard = new ImprovedDashboard();
} 