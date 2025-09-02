/**
 * Mobile Menu & Sidebar Management
 * Handles off-canvas sidebar, focus trapping, and responsive interactions
 */

class MobileMenu {
  constructor() {
    this.sidebar = null;
    this.hamburgerBtn = null;
    this.overlay = null;
    this.isOpen = false;
    this.focusableElements = [];
    this.lastFocusedElement = null;
    
    this.init();
  }

  init() {
    this.createMobileElements();
    this.bindEvents();
    this.handleResize();
  }

  createMobileElements() {
    // Create hamburger button
    this.hamburgerBtn = document.createElement('button');
    this.hamburgerBtn.className = 'hamburger-btn';
    this.hamburgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
    this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    this.hamburgerBtn.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    // Get existing sidebar
    this.sidebar = document.querySelector('.sidebar');
    if (this.sidebar) {
      this.sidebar.setAttribute('role', 'dialog');
      this.sidebar.setAttribute('aria-modal', 'true');
      this.sidebar.setAttribute('aria-label', 'Navigation menu');
    }

    // Insert hamburger into topbar
    const topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft) {
      topbarLeft.insertBefore(this.hamburgerBtn, topbarLeft.firstChild);
    }

    // Insert overlay into body
    document.body.appendChild(this.overlay);
  }

  bindEvents() {
    // Hamburger click
    this.hamburgerBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Overlay click
    this.overlay?.addEventListener('click', () => {
      this.close();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      
      if (this.isOpen && e.key === 'Tab') {
        this.handleTabKey(e);
      }
    });

    // Sidebar nav item clicks (close menu on mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1023) {
          this.close();
        }
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Prevent scroll when menu is open
    document.addEventListener('touchmove', (e) => {
      if (this.isOpen && !this.sidebar?.contains(e.target)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.lastFocusedElement = document.activeElement;

    // Add classes
    this.sidebar?.classList.add('is-open');
    this.overlay?.classList.add('is-open');
    this.hamburgerBtn?.classList.add('is-open');
    document.body.classList.add('no-scroll');

    // Update ARIA
    this.hamburgerBtn?.setAttribute('aria-expanded', 'true');
    this.overlay?.setAttribute('aria-hidden', 'false');

    // Set focus and trap
    requestAnimationFrame(() => {
      this.updateFocusableElements();
      this.trapFocus();
    });
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Remove classes
    this.sidebar?.classList.remove('is-open');
    this.overlay?.classList.remove('is-open');
    this.hamburgerBtn?.classList.remove('is-open');
    document.body.classList.remove('no-scroll');

    // Update ARIA
    this.hamburgerBtn?.setAttribute('aria-expanded', 'false');
    this.overlay?.setAttribute('aria-hidden', 'true');

    // Return focus
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  updateFocusableElements() {
    if (!this.sidebar) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.sidebar.querySelectorAll(focusableSelectors.join(', '))
    ).filter(el => {
      return el.offsetWidth > 0 && el.offsetHeight > 0;
    });
  }

  trapFocus() {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    // Store references for tab handling
    this.firstFocusableElement = firstElement;
    this.lastFocusableElement = lastElement;
  }

  handleTabKey(e) {
    if (this.focusableElements.length === 0) return;

    const isTabPressed = e.key === 'Tab';
    if (!isTabPressed) return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  handleResize() {
    // Close menu on desktop
    if (window.innerWidth > 1023 && this.isOpen) {
      this.close();
    }

    // Update focusable elements if menu is open
    if (this.isOpen) {
      this.updateFocusableElements();
    }
  }
}

/**
 * Enhanced Dashboard Interactions for Mobile
 */
class ResponsiveDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.setupTouchInteractions();
    this.setupScrollObserver();
    this.setupChartResponsiveness();
  }

  setupTouchInteractions() {
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll(
      '.chip, .nav-item, .transaction-item, .view-all-link, .menu-button'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
        this.style.opacity = '0.8';
      }, { passive: true });

      element.addEventListener('touchend', function() {
        this.style.transform = '';
        this.style.opacity = '';
      }, { passive: true });

      element.addEventListener('touchcancel', function() {
        this.style.transform = '';
        this.style.opacity = '';
      }, { passive: true });
    });
  }

  setupScrollObserver() {
    // Optimize scroll performance
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateScrollState() {
    const scrollY = window.scrollY;
    const topbar = document.querySelector('.topbar');
    
    if (topbar) {
      if (scrollY > 20) {
        topbar.style.boxShadow = 'var(--shadow-2)';
      } else {
        topbar.style.boxShadow = 'var(--shadow-1)';
      }
    }
  }

  setupChartResponsiveness() {
    // Ensure charts maintain aspect ratios
    const charts = document.querySelectorAll('.chart-svg');
    
    charts.forEach(chart => {
      chart.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Add responsive class based on parent
      const parent = chart.closest('.revenue-flow, .available-card, .spending');
      if (parent) {
        if (parent.classList.contains('revenue-flow')) {
          chart.parentElement.classList.add('chart-bar');
        } else if (parent.classList.contains('available-card')) {
          chart.parentElement.classList.add('chart-donut');
        } else if (parent.classList.contains('spending')) {
          chart.parentElement.classList.add('chart-line');
        }
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  new ResponsiveDashboard();
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Recalculate viewport height for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, 100);
});

// Set initial viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);