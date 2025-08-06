/* =============================================================================
   FOSS Stack Hub - Profile Module JavaScript
   ============================================================================= */

class ProfileManager {
    constructor() {
        this.currentTab = 'stacks';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.animateProfileStats();
        this.setupStackCards();
        this.loadUserData();
    }

    /**
     * Setup Tab Navigation
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Update active states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                this.currentTab = targetTab;
                
                // Save to localStorage
                localStorage.setItem('activeProfileTab', targetTab);
            });
        });

        // Restore last active tab
        const savedTab = localStorage.getItem('activeProfileTab');
        if (savedTab) {
            const savedButton = document.querySelector(`[data-tab="${savedTab}"]`);
            if (savedButton) {
                savedButton.click();
            }
        }
    }

    /**
     * Animate Profile Stats on Load
     */
    animateProfileStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            const hasK = stat.textContent.includes('k');
            let currentValue = 0;
            const increment = finalValue / 50;
            const duration = 1500;
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(counter);
                }
                
                if (hasK && currentValue > 1000) {
                    stat.textContent = (currentValue / 1000).toFixed(1) + 'k';
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, stepTime);
        });
    }

    /**
     * Setup Stack Card Interactions
     */
    setupStackCards() {
        const stackCards = document.querySelectorAll('.stack-card');
        
        stackCards.forEach(card => {
            // Click handler für die gesamte Karte
            card.addEventListener('click', (e) => {
                // Verhindere Klicks auf Tags
                if (e.target.classList.contains('stack-tag')) {
                    e.stopPropagation();
                    this.filterByTag(e.target.textContent);
                    return;
                }
                
                const title = card.querySelector('.stack-title').textContent;
                console.log(`Stack clicked: ${title}`);
                // Hier würde man zur Stack-Detail-Seite navigieren
                // window.location.href = `/stack/${stackId}`;
            });
            
            // Hover-Effekte für Stats
            const statItems = card.querySelectorAll('.stat-item');
            statItems.forEach(stat => {
                stat.addEventListener('mouseenter', () => {
                    stat.style.transform = 'scale(1.05)';
                });
                stat.addEventListener('mouseleave', () => {
                    stat.style.transform = 'scale(1)';
                });
            });
        });
        
        // Animiere das Einblenden der Karten beim Laden
        this.animateStackCards();
    }
    
    /**
     * Animiere Stack Cards beim Laden
     */
    animateStackCards() {
        const stackCards = document.querySelectorAll('.stack-card');
        
        stackCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Filter Stacks by Tag
     */
    filterByTag(tag) {
        console.log(`Filtering by tag: ${tag}`);
        // Hier würde man die Stack-Liste nach dem Tag filtern
        const allCards = document.querySelectorAll('.stack-card');
        
        allCards.forEach(card => {
            const tags = Array.from(card.querySelectorAll('.stack-tag')).map(t => t.textContent);
            if (tags.includes(tag)) {
                card.style.display = 'block';
                card.style.animation = 'pulse 0.5s ease';
            } else {
                card.style.opacity = '0.3';
            }
        });
        
        // Reset nach 2 Sekunden
        setTimeout(() => {
            allCards.forEach(card => {
                card.style.opacity = '1';
                card.style.display = 'block';
                card.style.animation = '';
            });
        }, 2000);
    }

    /**
     * Load User Data (Simuliert)
     */
    loadUserData() {
        // Simuliere das Laden von mehr Daten
        setTimeout(() => {
            this.addMoreStacks();
            this.addMoreActivities();
            this.checkAchievements();
        }, 1000);
    }

    /**
     * Add More Stacks Dynamically
     */
    addMoreStacks() {
        const stackGrid = document.querySelector('.stack-grid');
        if (!stackGrid) return;

        const newStacks = [
            {
                title: 'UI/UX Toolkit',
                category: 'Design',
                description: 'Komplette Sammlung von Design-Tools und Ressourcen',
                rating: 4.8,
                downloads: '6.7k'
            },
            {
                title: 'Dev Environment Setup',
                category: 'Development',
                description: 'Vorkonfigurierte Entwicklungsumgebung mit allen wichtigen Tools',
                rating: 4.6,
                downloads: '4.2k'
            }
        ];

        newStacks.forEach((stack, index) => {
            setTimeout(() => {
                const stackCard = this.createStackCard(stack);
                stackGrid.appendChild(stackCard);
                
                // Trigger animation
                setTimeout(() => {
                    stackCard.style.opacity = '0';
                    stackCard.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        stackCard.style.transition = 'all 0.5s ease';
                        stackCard.style.opacity = '1';
                        stackCard.style.transform = 'translateY(0)';
                    });
                }, 10);
            }, index * 200);
        });
    }

    /**
     * Create Stack Card Element
     */
    createStackCard(stack) {
        const card = document.createElement('div');
        card.className = 'stack-card';
        
        // Bestimme die Kategorie und das passende Icon
        const categoryLower = stack.category.toLowerCase();
        card.setAttribute('data-category', categoryLower);
        
        const categoryIcons = {
            design: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7"/>
                    </svg>`,
            development: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>`,
            productivity: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>`
        };
        
        const icon = categoryIcons[categoryLower] || categoryIcons.design;
        
        // Generiere zufällige Tags für Demo
        const tags = stack.tags || ['Tool', 'Workflow', 'Template'];
        const tagsHtml = tags.map(tag => `<span class="stack-tag">${tag}</span>`).join('');
        
        // Generiere zufällige Größe
        const size = Math.floor(Math.random() * 200) + 50;
        
        card.innerHTML = `
            <div class="stack-card-header">
                <div class="stack-category-icon ${categoryLower}">
                    ${icon}
                </div>
                <div class="stack-info">
                    <h3 class="stack-title">${stack.title}</h3>
                    <span class="stack-category-badge ${categoryLower}">${stack.category}</span>
                </div>
            </div>
            
            <p class="stack-description">${stack.description}</p>
            
            <div class="stack-tags">
                ${tagsHtml}
            </div>
            
            <div class="stack-stats">
                <div class="stat-item">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="stat-value">${stack.rating}</span>
                    <span class="stat-label">Rating</span>
                </div>
                <div class="stat-item">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                    </svg>
                    <span class="stat-value">${stack.downloads}</span>
                    <span class="stat-label">Downloads</span>
                </div>
                <div class="stat-item">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                    </svg>
                    <span class="stat-value">${size}MB</span>
                    <span class="stat-label">Größe</span>
                </div>
            </div>
        `;
        return card;
    }

    /**
     * Add More Activities
     */
    addMoreActivities() {
        const activityFeed = document.querySelector('.activity-feed');
        if (!activityFeed) return;

        const activities = [
            {
                icon: '⭐',
                text: 'Hat "UI/UX Toolkit" bewertet',
                time: 'vor 1 Stunde'
            },
            {
                icon: '💬',
                text: 'Kommentar zu "Dev Environment Setup" hinzugefügt',
                time: 'vor 3 Stunden'
            }
        ];

        activities.forEach((activity, index) => {
            setTimeout(() => {
                const activityItem = this.createActivityItem(activity);
                activityFeed.appendChild(activityItem);
                
                // Trigger animation
                setTimeout(() => {
                    activityItem.style.opacity = '0';
                    activityItem.style.transform = 'translateX(-20px)';
                    
                    requestAnimationFrame(() => {
                        activityItem.style.transition = 'all 0.5s ease';
                        activityItem.style.opacity = '1';
                        activityItem.style.transform = 'translateX(0)';
                    });
                }, 10);
            }, index * 300);
        });
    }

    /**
     * Create Activity Item
     */
    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        return item;
    }

    /**
     * Check and Update Achievements
     */
    checkAchievements() {
        const achievements = document.querySelectorAll('.achievement');
        
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                // Simuliere das Freischalten von Erfolgen
                if (Math.random() > 0.5) {
                    achievement.classList.add('earned');
                    this.showAchievementNotification(achievement.querySelector('.achievement-title').textContent);
                }
            }, index * 500);
        });
    }

    /**
     * Show Achievement Notification
     */
    showAchievementNotification(title) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-icon">🎉</div>
            <div class="notification-content">
                <div class="notification-title">Erfolg freigeschaltet!</div>
                <div class="notification-text">${title}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 2px solid #ffd700;
                border-radius: 12px;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideIn 0.5s ease, slideOut 0.5s ease 3s forwards;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .notification-icon {
                font-size: 2rem;
            }
            
            .notification-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }
            
            .notification-text {
                color: #666;
                font-size: 0.9rem;
            }
            
            [data-theme="dark"] .achievement-notification {
                background: #2a2a2a;
                color: white;
            }
            
            [data-theme="dark"] .notification-title {
                color: white;
            }
            
            [data-theme="dark"] .notification-text {
                color: #ccc;
            }
        `;
        
        if (!document.querySelector('style[data-achievement-notification]')) {
            style.setAttribute('data-achievement-notification', '');
            document.head.appendChild(style);
        }
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});