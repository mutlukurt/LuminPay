// Main JavaScript for Dashboard Interactivity

class Dashboard {
  constructor() {
    this.init();
  }

  init() {
    this.setupSidebarNavigation();
    this.setupFilterChips();
    this.setupSearchFocus();
    this.setupCardInteractions();
  }

  // Sidebar Navigation
  setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Optional: Add some visual feedback
        this.showNotification(`Navigated to ${this.getNavItemName(index)}`);
      });
    });
  }

  getNavItemName(index) {
    const names = ['Home', 'Wallet', 'Analytics', 'Notifications', 'Settings', 'Help'];
    return names[index] || 'Unknown';
  }

  // Filter Chips
  setupFilterChips() {
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active class from all chips
        chips.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked chip
        chip.classList.add('active');
        
        // Update chart data (mock)
        this.updateRevenueChart(chip.textContent);
      });
      
      // Keyboard navigation
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
        }
      });
    });
  }

  updateRevenueChart(filter) {
    // Mock chart update - in a real app, this would fetch new data
    const chartBars = document.querySelectorAll('.chart-svg rect');
    const highlightPill = document.querySelector('.chart-highlight-pill');
    
    // Simple animation to show the chart is updating
    chartBars.forEach((bar, index) => {
      bar.style.opacity = '0.5';
      setTimeout(() => {
        bar.style.opacity = '1';
      }, index * 100 + 200);
    });
    
    // Update the highlight pill value based on filter
    const values = {
      'All': '+$2,240',
      'Withdrawal': '-$1,150',
      'Savings': '+$3,400',
      'Deposit': '+$2,240'
    };
    
    if (highlightPill && values[filter]) {
      highlightPill.querySelector('span').textContent = values[filter];
    }
  }

  // Search Focus Management
  setupSearchFocus() {
    const searchInput = document.querySelector('.search-input');
    const searchContainer = document.querySelector('.search-container');
    
    if (searchInput && searchContainer) {
      searchInput.addEventListener('focus', () => {
        searchContainer.classList.add('focused');
      });
      
      searchInput.addEventListener('blur', () => {
        searchContainer.classList.remove('focused');
      });
      
      // Mock search functionality
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }
  }

  performSearch(query) {
    if (query.length > 0) {
      console.log(`Searching for: ${query}`);
      // In a real app, this would trigger an API call
    }
  }

  // Card Interactions
  setupCardInteractions() {
    // Add card button
    const addCardBtn = document.querySelector('.add-card-btn');
    if (addCardBtn) {
      addCardBtn.addEventListener('click', () => {
        this.showNotification('Add new card clicked');
      });
    }

    // View all links
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    viewAllLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.closest('.card').querySelector('.card-title').textContent;
        this.showNotification(`View all ${section} clicked`);
      });
    });

    // Transaction items
    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach(item => {
      item.addEventListener('click', () => {
        const name = item.querySelector('.transaction-name').textContent;
        this.showNotification(`Transaction ${name} clicked`);
      });
    });
  }

  // Simple notification system
  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: var(--panel-700);
      color: var(--text-100);
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid var(--line);
      box-shadow: var(--shadow-1);
      z-index: 1000;
      font-size: 14px;
      font-weight: 500;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  // Mock data update (for demonstration)
  updateDashboardData() {
    // This would typically fetch real data from an API
    const mockData = {
      balance: '$22,350.50',
      income: '$2,240',
      expense: '$1,750',
      incomeChange: '+12%',
      expenseChange: '+9%'
    };

    // Update UI with new data
    const balanceEl = document.querySelector('.card-balance');
    const incomeEl = document.querySelector('.income-card .metric-value');
    const expenseEl = document.querySelector('.expense-card .metric-value');
    
    if (balanceEl) balanceEl.textContent = mockData.balance;
    if (incomeEl) incomeEl.textContent = mockData.income;
    if (expenseEl) expenseEl.textContent = mockData.expense;
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});

// Additional focus management for keyboard navigation
document.addEventListener('keydown', (e) => {
  // Tab navigation enhancement
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Smooth scroll for any internal navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});