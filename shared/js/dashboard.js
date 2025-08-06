/* =============================================================================
   FOSS Stack Hub - Dashboard JavaScript
   ============================================================================= */

/**
 * Dashboard-Klasse für die Verwaltung der Dashboard-Funktionalität
 */
class Dashboard {
    constructor() {
        this.isInitialized = false;
        this.activityData = [];
        this.init();
    }

    /**
     * Initialisierung des Dashboards
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.generateActivityGrid();
            this.setupViewToggles();
            this.setupInteractiveElements();
            this.isInitialized = true;
        } catch (error) {
            console.warn('Dashboard initialization warning:', error);
        }
    }

    /**
     * Generiert die Activity Grid (GitHub-ähnlich)
     */
    generateActivityGrid() {
        const activityGrid = document.getElementById('activityGrid');
        if (!activityGrid) return;

        // Leere vorhandenen Inhalt
        activityGrid.innerHTML = '';

        // Generiere 371 Squares (53 Wochen × 7 Tage)
        const totalSquares = 371;
        const currentDate = new Date();
        
        for (let i = 0; i < totalSquares; i++) {
            const square = document.createElement('div');
            square.className = `activity-square level-${this.getRandomActivityLevel()}`;
            
            // Berechne das Datum für dieses Square
            const date = new Date(currentDate);
            date.setDate(date.getDate() - (totalSquares - i));
            
            // Füge Tooltip-Funktionalität hinzu
            square.title = `${this.getActivityText()} am ${date.toLocaleDateString('de-DE')}`;
            
            // Hover-Effekt
            square.addEventListener('mouseenter', () => {
                this.showActivityTooltip(square, date);
            });
            
            activityGrid.appendChild(square);
        }
    }

    /**
     * Gibt ein zufälliges Activity Level zurück (0-4)
     */
    getRandomActivityLevel() {
        const weights = [0.4, 0.25, 0.2, 0.1, 0.05]; // Gewichtung für realistische Verteilung
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Gibt zufälligen Activity-Text zurück
     */
    getActivityText() {
        const activities = [
            'Keine Aktivität',
            '1-2 Beiträge',
            '3-5 Beiträge',
            '6-8 Beiträge',
            '9+ Beiträge'
        ];
        return activities[this.getRandomActivityLevel()];
    }

    /**
     * Zeigt Activity Tooltip
     */
    showActivityTooltip(element, date) {
        // Einfacher Tooltip-Effekt über CSS
        element.style.position = 'relative';
    }

    /**
     * Setup für View Toggle Buttons
     */
    setupViewToggles() {
        const toggles = document.querySelectorAll('.view-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewToggle(toggle);
            });
        });
    }

    /**
     * Behandelt View Toggle Änderungen
     */
    handleViewToggle(activeToggle) {
        const toggles = document.querySelectorAll('.view-toggle');
        const stackFeed = document.getElementById('stackFeed');
        
        if (!stackFeed) return;

        // Entferne active-Klasse von allen Toggles
        toggles.forEach(toggle => toggle.classList.remove('active'));
        
        // Füge active-Klasse zum geklickten Toggle hinzu
        activeToggle.classList.add('active');
        
        // Ändere Layout basierend auf View
        const view = activeToggle.dataset.view;
        
        if (view === 'compact') {
            stackFeed.classList.add('compact-view');
            this.animateViewChange(stackFeed, 'compact');
        } else {
            stackFeed.classList.remove('compact-view');
            this.animateViewChange(stackFeed, 'normal');
        }
    }

    /**
     * Animiert View-Änderungen
     */
    animateViewChange(element, viewType) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Setup für interaktive Elemente
     */
    setupInteractiveElements() {
        this.setupStatCardAnimations();
        this.setupStackCardAnimations();
        this.setupLeaderboardAnimations();
    }

    /**
     * Setup für Stat Card Animationen
     */
    setupStatCardAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            // Verzögerte Einblendung für besseren Effekt
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                this.animateStatCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateStatCard(card, false);
            });
        });
    }

    /**
     * Animiert Stat Cards
     */
    animateStatCard(card, isHovered) {
        const icon = card.querySelector('.stat-icon');
        const number = card.querySelector('.stat-number');
        
        if (isHovered) {
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
            if (number) number.style.transform = 'scale(1.05)';
        } else {
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            if (number) number.style.transform = 'scale(1)';
        }
    }

    /**
     * Setup für Stack Card Animationen (minimal)
     */
    setupStackCardAnimations() {
        // Minimalistischer Ansatz - nur Border-Highlighting
        const stackCards = document.querySelectorAll('.stack-card');
        
        stackCards.forEach(card => {
            // Nur CSS-Hover wird verwendet - keine JavaScript-Animationen
        });
    }

    /**
     * Setup für Leaderboard Animationen
     */
    setupLeaderboardAnimations() {
        const leaderboardItems = document.querySelectorAll('.leaderboard-item');
        
        leaderboardItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const avatar = item.querySelector('.leaderboard-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1.1)';
                    avatar.style.transition = 'transform 0.2s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const avatar = item.querySelector('.leaderboard-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1)';
                }
            });
        });
    }

    /**
     * Utility-Methode für sichere Element-Selektion
     */
    safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Element with selector "${selector}" not found`);
            return null;
        }
    }

    /**
     * Utility-Methode für sichere Element-Selektion (alle)
     */
    safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Elements with selector "${selector}" not found`);
            return [];
        }
    }
}

/**
 * Dashboard-Initialisierung
 */
document.addEventListener('DOMContentLoaded', () => {
    // Prüfe ob wir auf der Dashboard-Seite sind
    if (document.querySelector('.dashboard-main')) {
        const dashboard = new Dashboard();
        
        // Debug-Information (nur in Entwicklung)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Dashboard initialisiert');
        }
    }
});

/**
 * CSS für Compact View (dynamisch hinzugefügt)
 */
const addCompactViewStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .stack-feed.compact-view .stack-card {
            flex-direction: row;
            padding: var(--space-md);
            gap: var(--space-md);
        }
        
        .stack-feed.compact-view .stack-cover {
            width: 60px;
            height: 60px;
        }
        
        .stack-feed.compact-view .stack-title {
            font-size: var(--font-size-base);
        }
        
        .stack-feed.compact-view .stack-type-badge {
            font-size: 0.6rem;
            padding: 1px 4px;
        }
    `;
    document.head.appendChild(style);
};

// Füge Compact View Styles hinzu
addCompactViewStyles(); 