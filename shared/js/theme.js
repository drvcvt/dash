/* =============================================================================
   FOSS Stack Hub - Theme Management System
   ============================================================================= */

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'auto';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.setupEventListeners();
    this.watchSystemPreference();
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('foss-stack-hub-theme');
    } catch (error) {
      console.warn('Cannot access localStorage for theme preference');
      return null;
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem('foss-stack-hub-theme', theme);
    } catch (error) {
      console.warn('Cannot store theme preference in localStorage');
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.storeTheme(theme);
    this.updateToggleButton();
    
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme, effectiveTheme: this.getEffectiveTheme() }
    }));
  }

  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  toggleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.setTheme(nextTheme);
  }

  updateToggleButton() {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    const effectiveTheme = this.getEffectiveTheme();
    
    toggleButtons.forEach(button => {
      // Update button icon based on current theme
      const icon = button.querySelector('svg');
      if (icon) {
        if (effectiveTheme === 'dark') {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
        }
      }
      
      // Update button title
      const themeNames = {
        auto: 'Automatisch',
        light: 'Hell',
        dark: 'Dunkel'
      };
      button.setAttribute('title', `Theme: ${themeNames[this.currentTheme] || this.currentTheme}`);
    });
  }

  setupEventListeners() {
    // Listen for theme toggle button clicks
    document.addEventListener('click', (event) => {
      if (event.target.closest('.theme-toggle')) {
        event.preventDefault();
        this.toggleTheme();
      }
    });

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + L for theme toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        this.toggleTheme();
      }
    });
  }

  watchSystemPreference() {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (this.currentTheme === 'auto') {
        this.updateToggleButton();
        // Dispatch event for auto theme system preference change
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: this.currentTheme, effectiveTheme: this.getEffectiveTheme() }
        }));
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  // Public API
  get theme() {
    return this.currentTheme;
  }

  get effectiveTheme() {
    return this.getEffectiveTheme();
  }

  setThemeExplicit(theme) {
    if (['auto', 'light', 'dark'].includes(theme)) {
      this.setTheme(theme);
    } else {
      console.warn(`Invalid theme: ${theme}. Valid themes are: auto, light, dark`);
    }
  }

  // Utility methods for other modules
  isDark() {
    return this.getEffectiveTheme() === 'dark';
  }

  isLight() {
    return this.getEffectiveTheme() === 'light';
  }
}

// Initialize theme manager when DOM is ready
const initTheme = () => {
  if (typeof window !== 'undefined') {
    window.themeManager = new ThemeManager();
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
} 