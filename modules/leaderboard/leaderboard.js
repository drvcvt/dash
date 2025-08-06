/* =============================================================================
   FOSS Stack Hub - Leaderboard Module JavaScript
   ============================================================================= */

class LeaderboardManager {
    constructor() {
        this.leaderboardData = {
            contributors: [],
            stacks: []
        };
        this.init();
    }

    init() {
        this.loadLeaderboardData();
        this.setupInteractions();
        this.startAutoRefresh();
    }

    /**
     * Load Leaderboard Data
     */
    async loadLeaderboardData() {
        // Simuliere API-Call
        setTimeout(() => {
            this.populateLeaderboard();
            this.addLoadingAnimation();
        }, 500);
    }

    /**
     * Populate Leaderboard with Additional Data
     */
    populateLeaderboard() {
        // Erweitere Contributors
        const contributorsList = document.querySelector('.leaderboard-list');
        if (contributorsList) {
            const additionalContributors = [
                { rank: 4, name: 'TechWizard', stacks: 543, downloads: '28k', score: 1542 },
                { rank: 5, name: 'OpenSourceHero', stacks: 421, downloads: '22k', score: 1234 },
                { rank: 6, name: 'CodeNinja', stacks: 387, downloads: '19k', score: 1089 },
                { rank: 7, name: 'StackMaster', stacks: 312, downloads: '15k', score: 987 },
                { rank: 8, name: 'DevExpert', stacks: 298, downloads: '14k', score: 876 }
            ];

            additionalContributors.forEach((contributor, index) => {
                setTimeout(() => {
                    const item = this.createLeaderboardItem(contributor);
                    contributorsList.appendChild(item);
                    this.animateItemEntry(item);
                }, index * 100);
            });
        }

        // Erweitere Stack Leaderboard
        const stackList = document.querySelector('.stack-leaderboard');
        if (stackList) {
            const additionalStacks = [
                {
                    rank: 2,
                    name: 'FOSS Dev Environment',
                    author: 'CodeCrafter',
                    rating: 4.8,
                    downloads: '10.2k'
                },
                {
                    rank: 3,
                    name: 'Ultimate Design Kit',
                    author: 'DesignGuru',
                    rating: 4.7,
                    downloads: '8.9k'
                },
                {
                    rank: 4,
                    name: 'Productivity Suite',
                    author: 'ProductivePro',
                    rating: 4.6,
                    downloads: '7.3k'
                }
            ];

            additionalStacks.forEach((stack, index) => {
                setTimeout(() => {
                    const item = this.createStackItem(stack);
                    stackList.appendChild(item);
                    this.animateItemEntry(item);
                }, index * 150);
            });
        }
    }

    /**
     * Create Leaderboard Item Element
     */
    createLeaderboardItem(data) {
        const item = document.createElement('div');
        item.className = `leaderboard-item rank-${data.rank}`;
        item.innerHTML = `
            <div class="rank">${data.rank}</div>
            <div class="user-info">
                <div class="user-name">${data.name}</div>
                <div class="user-stats">${data.stacks} Stacks • ${data.downloads} Downloads</div>
            </div>
            <div class="score">${data.score}</div>
        `;
        return item;
    }

    /**
     * Create Stack Item Element
     */
    createStackItem(data) {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.innerHTML = `
            <div class="stack-rank">${data.rank}</div>
            <div class="stack-info">
                <div class="stack-name">${data.name}</div>
                <div class="stack-author">von ${data.author}</div>
            </div>
            <div class="stack-stats">
                <div class="stat">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${data.rating}
                </div>
                <div class="stat">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                    </svg>
                    ${data.downloads}
                </div>
            </div>
        `;
        return item;
    }

    /**
     * Animate Item Entry
     */
    animateItemEntry(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }

    /**
     * Setup Interactions
     */
    setupInteractions() {
        // Leaderboard Item Clicks
        document.addEventListener('click', (e) => {
            const leaderboardItem = e.target.closest('.leaderboard-item');
            if (leaderboardItem) {
                const userName = leaderboardItem.querySelector('.user-name').textContent;
                this.showUserProfile(userName);
            }

            const stackItem = e.target.closest('.stack-item');
            if (stackItem) {
                const stackName = stackItem.querySelector('.stack-name').textContent;
                this.showStackDetails(stackName);
            }
        });

        // Add hover effects
        this.addHoverEffects();
    }

    /**
     * Add Hover Effects
     */
    addHoverEffects() {
        const allItems = document.querySelectorAll('.leaderboard-item, .stack-item');
        
        allItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
    }

    /**
     * Play Hover Sound (simulated)
     */
    playHoverSound() {
        // In einer echten App würde hier ein Sound abgespielt
        console.log('Hover sound');
    }

    /**
     * Show User Profile
     */
    showUserProfile(userName) {
        console.log(`Navigating to profile: ${userName}`);
        // window.location.href = `/profile/${userName}`;
        
        // Zeige temporäre Notification
        this.showNotification(`Profil von ${userName} wird geladen...`);
    }

    /**
     * Show Stack Details
     */
    showStackDetails(stackName) {
        console.log(`Navigating to stack: ${stackName}`);
        // window.location.href = `/stack/${stackName}`;
        
        // Zeige temporäre Notification
        this.showNotification(`Stack "${stackName}" wird geladen...`);
    }

    /**
     * Show Notification
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideUp 0.5s ease, slideDown 0.5s ease 2s forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Add Loading Animation
     */
    addLoadingAnimation() {
        const sections = document.querySelectorAll('.leaderboard-section');
        
        sections.forEach((section, index) => {
            // Simuliere Laden von Live-Daten
            setTimeout(() => {
                const title = section.querySelector('.section-title');
                if (title) {
                    const badge = document.createElement('span');
                    badge.className = 'live-badge';
                    badge.textContent = 'LIVE';
                    badge.style.cssText = `
                        background: #22c55e;
                        color: white;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 0.7rem;
                        font-weight: 600;
                        margin-left: 12px;
                        animation: pulse 2s infinite;
                    `;
                    title.appendChild(badge);
                }
            }, 1000 + index * 500);
        });
    }

    /**
     * Start Auto Refresh
     */
    startAutoRefresh() {
        // Simuliere Live-Updates alle 30 Sekunden
        setInterval(() => {
            this.simulateLiveUpdate();
        }, 30000);
    }

    /**
     * Simulate Live Update
     */
    simulateLiveUpdate() {
        const scores = document.querySelectorAll('.score');
        const downloads = document.querySelectorAll('.stat');
        
        // Animiere Score-Änderungen
        scores.forEach(score => {
            if (Math.random() > 0.7) {
                const currentScore = parseInt(score.textContent);
                const newScore = currentScore + Math.floor(Math.random() * 10);
                this.animateNumberChange(score, currentScore, newScore);
            }
        });
        
        // Zeige Update-Notification
        const updateBadge = document.createElement('div');
        updateBadge.className = 'update-badge';
        updateBadge.innerHTML = '🔄 Live aktualisiert';
        updateBadge.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2s forwards;
        `;
        
        document.body.appendChild(updateBadge);
        
        setTimeout(() => {
            updateBadge.remove();
        }, 3000);
    }

    /**
     * Animate Number Change
     */
    animateNumberChange(element, start, end) {
        const duration = 1000;
        const increment = (end - start) / (duration / 16);
        let current = start;
        
        const animation = setInterval(() => {
            current += increment;
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(animation);
                element.classList.add('updated');
                setTimeout(() => element.classList.remove('updated'), 1000);
            }
            
            element.textContent = Math.floor(current);
        }, 16);
    }

    /**
     * Show Trophy Animation
     */
    showTrophyAnimation() {
        const trophy = document.createElement('div');
        trophy.className = 'trophy-animation';
        trophy.textContent = '🏆';
        
        document.body.appendChild(trophy);
        
        setTimeout(() => {
            trophy.remove();
        }, 1000);
    }
}

// Add required styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
        }
    }
    
    .updated {
        color: #22c55e !important;
        font-weight: 700 !important;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = new LeaderboardManager();
    
    // Special effect for top 3
    setTimeout(() => {
        leaderboard.showTrophyAnimation();
    }, 1500);
});