/* =============================================================================
   Landing Page Module - Interactive Features
   ============================================================================= */

class LandingPage {
  constructor() {
    this.animationObserver = null;
    this.init();
  }

  init() {
    this.setupAnimations();
    this.setupInteractiveElements();
    this.setupStatsAnimation();
    this.setupFAQAccordion();
    this.setupTypingEffect();
  }

  setupAnimations() {
    // Setup Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe sections for animations
    const animatedElements = document.querySelectorAll(
      '.hero, .features .card, .stack-card, .category-card, .testimonial, .stat-item'
    );
    
    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      this.animationObserver.observe(el);
    });
  }

  setupInteractiveElements() {
    // Stack cards hover effects
    const stackCards = document.querySelectorAll('.stack-card');
    stackCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateStackCard(card, 'enter');
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateStackCard(card, 'leave');
      });
      
      // Add click handler to navigate to stack details
      card.addEventListener('click', () => {
        const stackTitle = card.querySelector('.stack-title')?.textContent;
        if (stackTitle && window.router) {
          const stackId = this.generateStackId(stackTitle);
          window.router.navigate(`/stack/${stackId}`);
        }
      });
    });

    // Category cards interaction
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const categoryTitle = card.querySelector('.category-title')?.textContent;
        if (categoryTitle && window.router) {
          window.router.navigate(`/dashboard?category=${encodeURIComponent(categoryTitle)}`);
        }
      });
    });

    // Hero CTA buttons special effects
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });
    });
  }

  setupStatsAnimation() {
    // Animate stats numbers on scroll
    const statNumbers = document.querySelectorAll('.stat-item .stat-number, .stat-inline .stat-number');
    
    const animateNumber = (element, target) => {
      const value = parseInt(target.replace(/\D/g, ''));
      const suffix = target.replace(/[\d,\.]/g, '');
      let current = 0;
      const increment = value / 60; // Animate over ~1 second at 60fps
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        
        const formattedValue = this.formatNumber(Math.floor(current));
        element.textContent = formattedValue + suffix;
      }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const target = entry.target.textContent;
          entry.target.dataset.animated = 'true';
          setTimeout(() => animateNumber(entry.target, target), 300);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item details');
    
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          // Close other FAQ items for better UX
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.open) {
              otherItem.open = false;
            }
          });
          
          // Smooth scroll to opened item
          setTimeout(() => {
            item.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            });
          }, 100);
        }
      });
    });
  }

  setupTypingEffect() {
    // Add typing effect to the hero code element
    const codeElement = document.querySelector('.hero-code');
    if (codeElement) {
      const originalText = codeElement.textContent;
      codeElement.textContent = '';
      
      // Start typing effect after a short delay
      setTimeout(() => {
        this.typeText(codeElement, originalText, 50);
      }, 1000);
    }
  }

  // Helper methods
  animateStackCard(card, direction) {
    const cover = card.querySelector('.stack-cover');
    const badge = card.querySelector('.stack-type-badge');
    
    if (direction === 'enter') {
      cover.style.transform = 'scale(1.05)';
      if (badge) {
        badge.style.transform = 'translateY(-2px)';
      }
    } else {
      cover.style.transform = 'scale(1)';
      if (badge) {
        badge.style.transform = 'translateY(0)';
      }
    }
  }

  createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Add ripple animation styles
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  typeText(element, text, speed = 100) {
    let index = 0;
    element.style.borderRight = '2px solid currentColor';
    
    const typeInterval = setInterval(() => {
      element.textContent = text.slice(0, index + 1);
      index++;
      
      if (index === text.length) {
        clearInterval(typeInterval);
        // Remove cursor after typing is done
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 500);
      }
    }, speed);
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  }

  generateStackId(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Public API for other modules
  showLoadingState() {
    document.body.classList.add('loading');
  }

  hideLoadingState() {
    document.body.classList.remove('loading');
  }

  highlightFeature(featureIndex) {
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
      if (index === featureIndex) {
        feature.classList.add('highlighted');
        feature.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        feature.classList.remove('highlighted');
      }
    });
  }

  destroy() {
    // Cleanup observers and event listeners
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
  }
}

// Initialize landing page functionality
const initLandingPage = () => {
  window.landingPage = new LandingPage();
  
  // Listen for theme changes to update animations
  window.addEventListener('themeChanged', (event) => {
    const { effectiveTheme } = event.detail;
    document.body.setAttribute('data-effective-theme', effectiveTheme);
  });
  
  // Add global loading state management
  window.addEventListener('beforeunload', () => {
    if (window.landingPage) {
      window.landingPage.showLoadingState();
    }
  });
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingPage);
} else {
  initLandingPage();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LandingPage;
} 