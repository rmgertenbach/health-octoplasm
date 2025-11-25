/**
 * HEALTHCARE TRANSPARENCY PLATFORM - REUSABLE UI COMPONENTS
 * Vanilla JavaScript components for common patterns
 */

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Format currency
 * @param {number} amount - Dollar amount
 * @param {boolean} showCents - Whether to show cents
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, showCents = false) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  return formatter.format(amount);
}

/**
 * Format percentage
 * @param {number} value - Decimal value (e.g., 0.30 for 30%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 0) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ================================================================
// COMPONENT BUILDERS
// ================================================================

/**
 * Create a provider comparison card
 * @param {Object} provider - Provider data
 * @returns {HTMLElement} Card element
 */
function createProviderCard(provider) {
  const card = document.createElement('div');
  card.className = `card comparison-card ${provider.recommended ? 'recommended' : ''}`;

  card.innerHTML = `
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h3 class="card-title m-0">${provider.name}</h3>
        ${provider.qualityGrade ? `<span class="grade-badge grade-${provider.qualityGrade.toLowerCase()}">Grade: ${provider.qualityGrade}</span>` : ''}
      </div>
      <p class="card-subtitle">${provider.specialty || 'Healthcare Provider'}</p>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div class="text-muted text-sm">Cash Price</div>
          <div class="text-2xl font-bold text-primary">${formatCurrency(provider.cashPrice)}</div>
        </div>
        <div>
          <div class="text-muted text-sm">Your Estimated Cost</div>
          <div class="text-2xl font-bold">${formatCurrency(provider.estimatedCost)}</div>
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm text-gray">
        <span>📍 ${provider.distance} miles</span>
        ${provider.nextAvailable ? `<span>⏱️ Next: ${provider.nextAvailable}</span>` : ''}
      </div>

      ${provider.employerSavings ? `
        <div class="alert alert-success mt-4">
          <span>Employer saves: ${formatCurrency(provider.employerSavings)} vs. alternative</span>
        </div>
      ` : ''}
    </div>

    <div class="card-footer">
      <div class="flex gap-4">
        <button class="btn btn-primary flex-1">Book Now</button>
        <button class="btn btn-outline">Details</button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Create an overpayment alert box
 * @param {Object} data - Overpayment data
 * @returns {HTMLElement} Alert element
 */
function createOverpaymentAlert(data) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-error';

  const percentOverpaid = (data.currentSpend - data.fairSpend) / data.currentSpend;
  const dollarOverpaid = data.currentSpend - data.fairSpend;

  alert.innerHTML = `
    <div style="flex: 1;">
      <h4 class="text-xl font-bold mb-2">🚨 OVERPAYMENT ALERT</h4>
      <p class="mb-2">You're paying ${formatPercentage(percentOverpaid)}% more than peer employers</p>
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div>
          <div class="text-sm opacity-75">Annual Spend</div>
          <div class="text-xl font-bold">${formatCurrency(data.currentSpend)}</div>
        </div>
        <div>
          <div class="text-sm opacity-75">Fair Market</div>
          <div class="text-xl font-bold">${formatCurrency(data.fairSpend)}</div>
        </div>
        <div>
          <div class="text-sm opacity-75">OVERPAYMENT</div>
          <div class="text-2xl font-bold">${formatCurrency(dollarOverpaid)}</div>
        </div>
      </div>
    </div>
  `;

  return alert;
}

/**
 * Create a savings opportunity card
 * @param {Object} opportunity - Savings opportunity data
 * @returns {HTMLElement} Card element
 */
function createSavingsOpportunityCard(opportunity) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="flex items-start justify-between mb-4">
      <div>
        <h4 class="text-xl font-semibold mb-2">${opportunity.icon} ${opportunity.title}</h4>
        <p class="text-gray">${opportunity.description}</p>
      </div>
      <div class="text-right">
        <div class="text-sm text-muted">Potential Savings</div>
        <div class="text-3xl font-bold text-success">${formatCurrency(opportunity.savings)}/year</div>
      </div>
    </div>

    ${opportunity.details ? `
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        ${opportunity.details.map(detail => `
          <div class="flex justify-between mb-2">
            <span class="text-gray">${detail.label}:</span>
            <span class="font-medium">${detail.value}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <button class="btn btn-primary btn-sm">Explore</button>
  `;

  return card;
}

/**
 * Create a quality grade badge
 * @param {string} grade - Letter grade (A-F)
 * @param {string} label - Optional label
 * @returns {HTMLElement} Badge element
 */
function createQualityBadge(grade, label = 'Leapfrog Grade') {
  const badge = document.createElement('div');
  badge.className = 'flex items-center gap-2';
  badge.innerHTML = `
    <span class="grade-badge grade-${grade.toLowerCase()}">${grade}</span>
    <span class="text-sm text-gray">${label}</span>
  `;
  return badge;
}

/**
 * Create a progress indicator
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} label - Progress label
 * @returns {HTMLElement} Progress element
 */
function createProgressBar(percentage, label) {
  const container = document.createElement('div');
  container.className = 'mb-4';

  container.innerHTML = `
    <div class="flex justify-between mb-2">
      <span class="text-sm font-medium">${label}</span>
      <span class="text-sm text-gray">${percentage}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div class="bg-patient-primary h-2 rounded-full transition-all" style="width: ${percentage}%"></div>
    </div>
  `;

  return container;
}

/**
 * Create a stat display
 * @param {Object} stat - Stat data {label, value, change, changeType}
 * @returns {HTMLElement} Stat element
 */
function createStatDisplay(stat) {
  const container = document.createElement('div');
  container.className = 'text-center p-6 bg-gray-50 rounded-xl';

  const changeColor = stat.changeType === 'positive' ? 'text-success' : stat.changeType === 'negative' ? 'text-error' : 'text-gray';
  const changeIcon = stat.changeType === 'positive' ? '↑' : stat.changeType === 'negative' ? '↓' : '→';

  container.innerHTML = `
    <div class="text-sm text-gray mb-2">${stat.label}</div>
    <div class="text-4xl font-bold mb-2">${stat.value}</div>
    ${stat.change ? `
      <div class="${changeColor} text-sm font-medium">
        ${changeIcon} ${stat.change}
      </div>
    ` : ''}
  `;

  return container;
}

// ================================================================
// INTERACTIVE FEATURES
// ================================================================

/**
 * Initialize search with autocomplete
 * @param {HTMLInputElement} input - Search input element
 * @param {Array} suggestions - Array of suggestion strings
 * @param {Function} onSelect - Callback when suggestion selected
 */
function initializeSearchAutocomplete(input, suggestions, onSelect) {
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--color-gray-200);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-height: 300px;
    overflow-y: auto;
    display: none;
    z-index: var(--z-dropdown);
    margin-top: 4px;
  `;

  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(dropdown);

  const debouncedSearch = debounce((searchTerm) => {
    if (!searchTerm) {
      dropdown.style.display = 'none';
      return;
    }

    const matches = suggestions.filter(s =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = matches.map(match => `
      <div class="autocomplete-item" style="
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--color-gray-100);
      " data-value="${match}">
        ${match}
      </div>
    `).join('');

    dropdown.style.display = 'block';

    // Add click handlers
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'var(--color-gray-50)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'white';
      });
      item.addEventListener('click', () => {
        const value = item.getAttribute('data-value');
        input.value = value;
        dropdown.style.display = 'none';
        if (onSelect) onSelect(value);
      });
    });
  }, 300);

  input.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!input.parentElement.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

/**
 * Create and show a modal
 * @param {string} title - Modal title
 * @param {HTMLElement|string} content - Modal content
 * @param {Object} options - Modal options {size, onClose}
 * @returns {HTMLElement} Modal element
 */
function showModal(title, content, options = {}) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal-backdrop);
    padding: 16px;
  `;

  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';
  const maxWidth = options.size === 'large' ? '900px' : options.size === 'small' ? '400px' : '600px';
  modalBox.style.cssText = `
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-2xl);
    max-width: ${maxWidth};
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  `;

  modalBox.innerHTML = `
    <div style="padding: 24px; border-bottom: 1px solid var(--color-gray-200);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; font-size: var(--text-2xl); font-weight: var(--font-bold);">${title}</h2>
        <button class="modal-close" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--color-gray-400);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        ">×</button>
      </div>
    </div>
    <div class="modal-content" style="padding: 24px;">
    </div>
  `;

  const contentContainer = modalBox.querySelector('.modal-content');
  if (typeof content === 'string') {
    contentContainer.innerHTML = content;
  } else {
    contentContainer.appendChild(content);
  }

  modal.appendChild(modalBox);
  document.body.appendChild(modal);

  // Close handlers
  const closeModal = () => {
    modal.remove();
    if (options.onClose) options.onClose();
  };

  modalBox.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modal;
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: var(--z-tooltip);
    min-width: 300px;
    max-width: 500px;
    animation: slideInFromRight 0.3s ease-out;
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Create a loading spinner
 * @param {string} message - Loading message
 * @returns {HTMLElement} Spinner element
 */
function createLoadingSpinner(message = 'Loading...') {
  const spinner = document.createElement('div');
  spinner.className = 'text-center p-8';
  spinner.innerHTML = `
    <div style="
      border: 4px solid var(--color-gray-200);
      border-top: 4px solid var(--color-patient-primary);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    "></div>
    <p class="text-gray">${message}</p>

    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(10px); }
      }
    </style>
  `;
  return spinner;
}

// ================================================================
// CHART HELPERS
// ================================================================

/**
 * Create a simple bar chart
 * @param {HTMLElement} container - Container element
 * @param {Array} data - Array of {label, value, color}
 * @param {Object} options - Chart options
 */
function createBarChart(container, data, options = {}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const height = options.height || 300;

  container.style.height = `${height}px`;
  container.style.display = 'flex';
  container.style.alignItems = 'flex-end';
  container.style.gap = '8px';
  container.style.padding = '16px';

  data.forEach(item => {
    const bar = document.createElement('div');
    bar.style.cssText = `
      flex: 1;
      background: ${item.color || 'var(--color-patient-primary)'};
      border-radius: var(--radius-md) var(--radius-md) 0 0;
      height: ${(item.value / maxValue) * (height - 60)}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 8px;
      color: white;
      font-weight: var(--font-semibold);
      transition: all 0.3s ease;
      cursor: pointer;
    `;

    bar.innerHTML = `
      <div style="font-size: var(--text-sm);">${formatCurrency(item.value)}</div>
      <div style="
        margin-top: auto;
        padding: 8px;
        background: rgba(0,0,0,0.2);
        width: 100%;
        text-align: center;
        font-size: var(--text-xs);
      ">${item.label}</div>
    `;

    bar.addEventListener('mouseenter', () => {
      bar.style.transform = 'translateY(-4px)';
      bar.style.filter = 'brightness(1.1)';
    });

    bar.addEventListener('mouseleave', () => {
      bar.style.transform = 'translateY(0)';
      bar.style.filter = 'brightness(1)';
    });

    container.appendChild(bar);
  });
}

// ================================================================
// EXPORT FOR USE
// ================================================================

// Make functions available globally
window.HealthcareUI = {
  // Utilities
  formatCurrency,
  formatPercentage,
  calculateDistance,
  debounce,

  // Components
  createProviderCard,
  createOverpaymentAlert,
  createSavingsOpportunityCard,
  createQualityBadge,
  createProgressBar,
  createStatDisplay,

  // Interactive
  initializeSearchAutocomplete,
  showModal,
  showToast,
  createLoadingSpinner,

  // Charts
  createBarChart,
};
