/**
 * ===================================================================
 * TRANSPARENCY HUB - WIZARD ENGINE
 * TurboTax-style multi-step flow manager
 * ===================================================================
 */

class WizardEngine {
    constructor(config = {}) {
        this.currentStep = config.startStep || 1;
        this.totalSteps = config.totalSteps || 4;
        this.data = config.data || {};
        this.stepPrefix = config.stepPrefix || 'step-';
        this.onStepChange = config.onStepChange || null;
        this.onComplete = config.onComplete || null;
        this.allowBackward = config.allowBackward !== false;
        this.allowSkip = config.allowSkip || false;

        this.init();
    }

    /**
     * Initialize wizard
     */
    init() {
        this.updateProgress();
        this.showStep(this.currentStep);
        this.setupKeyboardNavigation();

        console.log('[Wizard] Initialized:', {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps
        });
    }

    /**
     * Navigate to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Validate current step before proceeding
            if (this.validateStep(this.currentStep)) {
                this.hideStep(this.currentStep);
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.scrollToTop();

                // Trigger callback
                if (this.onStepChange) {
                    this.onStepChange(this.currentStep);
                }

                console.log('[Wizard] Advanced to step:', this.currentStep);
            } else {
                console.warn('[Wizard] Step validation failed');
                this.showValidationError(this.currentStep);
            }
        } else {
            this.complete();
        }
    }

    /**
     * Navigate to previous step
     */
    prevStep() {
        if (this.allowBackward && this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.scrollToTop();

            // Trigger callback
            if (this.onStepChange) {
                this.onStepChange(this.currentStep);
            }

            console.log('[Wizard] Returned to step:', this.currentStep);
        }
    }

    /**
     * Jump to specific step
     */
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            // Only allow if skipping is enabled or going backward
            if (this.allowSkip || stepNumber < this.currentStep) {
                this.hideStep(this.currentStep);
                this.currentStep = stepNumber;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.scrollToTop();

                console.log('[Wizard] Jumped to step:', this.currentStep);
            }
        }
    }

    /**
     * Show specific step
     */
    showStep(stepNumber) {
        const stepEl = document.getElementById(`${this.stepPrefix}${stepNumber}`);
        if (stepEl) {
            stepEl.style.display = 'block';
            stepEl.classList.add('fade-in-up');

            // Remove animation class after completion
            setTimeout(() => {
                stepEl.classList.remove('fade-in-up');
            }, 800);
        }
    }

    /**
     * Hide specific step
     */
    hideStep(stepNumber) {
        const stepEl = document.getElementById(`${this.stepPrefix}${stepNumber}`);
        if (stepEl) {
            stepEl.style.display = 'none';
        }
    }

    /**
     * Update progress indicator
     */
    updateProgress() {
        const steps = document.querySelectorAll('.step-item');

        steps.forEach((step, index) => {
            const stepNum = index + 1;
            const stepNumber = step.querySelector('.step-number');

            // Clear all states
            step.classList.remove('active', 'completed');

            if (stepNum < this.currentStep) {
                // Completed step
                step.classList.add('completed');
                if (stepNumber) {
                    stepNumber.innerHTML = '<i class="fas fa-check"></i>';
                }
            } else if (stepNum === this.currentStep) {
                // Active step
                step.classList.add('active');
                if (stepNumber) {
                    stepNumber.textContent = stepNum;
                }
            } else {
                // Future step
                if (stepNumber) {
                    stepNumber.textContent = stepNum;
                }
            }
        });

        // Update progress bar if exists
        this.updateProgressBar();
    }

    /**
     * Update progress bar percentage
     */
    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const percentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Validate current step
     * Override this method for custom validation
     */
    validateStep(stepNumber) {
        const stepEl = document.getElementById(`${this.stepPrefix}${stepNumber}`);
        if (!stepEl) return true;

        // Check for required form fields
        const requiredFields = stepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    /**
     * Show validation error message
     */
    showValidationError(stepNumber) {
        const stepEl = document.getElementById(`${this.stepPrefix}${stepNumber}`);
        if (stepEl) {
            stepEl.classList.add('shake');
            setTimeout(() => {
                stepEl.classList.remove('shake');
            }, 500);
        }

        // Show error alert if not already visible
        let errorAlert = stepEl.querySelector('.validation-error');
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger validation-error';
            errorAlert.innerHTML = `
                <div class="alert-icon"><i class="fas fa-triangle-exclamation"></i></div>
                <div class="alert-content">
                    <div class="alert-message">Please fill in all required fields before continuing.</div>
                </div>
            `;
            stepEl.insertBefore(errorAlert, stepEl.firstChild);
        }
    }

    /**
     * Complete wizard
     */
    complete() {
        console.log('[Wizard] Completed with data:', this.data);

        if (this.onComplete) {
            this.onComplete(this.data);
        }
    }

    /**
     * Reset wizard to beginning
     */
    reset() {
        this.hideStep(this.currentStep);
        this.currentStep = 1;
        this.data = {};
        this.showStep(this.currentStep);
        this.updateProgress();
        this.scrollToTop();

        console.log('[Wizard] Reset');
    }

    /**
     * Set wizard data
     */
    setData(key, value) {
        this.data[key] = value;
        console.log('[Wizard] Data updated:', key, value);
    }

    /**
     * Get wizard data
     */
    getData(key) {
        return key ? this.data[key] : this.data;
    }

    /**
     * Scroll to top of page smoothly
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Enter key to advance (if not in textarea)
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'BUTTON') {
                    e.preventDefault();
                    this.nextStep();
                }
            }

            // Escape key to go back
            if (e.key === 'Escape' && this.allowBackward) {
                this.prevStep();
            }
        });
    }

    /**
     * Export wizard data as JSON
     */
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `wizard-data-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        console.log('[Wizard] Data exported');
    }

    /**
     * Get current step percentage
     */
    getProgress() {
        return Math.round((this.currentStep / this.totalSteps) * 100);
    }

    /**
     * Check if wizard is complete
     */
    isComplete() {
        return this.currentStep >= this.totalSteps;
    }

    /**
     * Get step element
     */
    getStepElement(stepNumber) {
        return document.getElementById(`${this.stepPrefix}${stepNumber || this.currentStep}`);
    }
}


/**
 * ===================================================================
 * WIZARD HELPER FUNCTIONS
 * ===================================================================
 */

/**
 * Show loading state in step
 */
function showLoading(stepNumber, message = 'Processing...') {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (!stepEl) return;

    const loadingHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <h3>${message}</h3>
        </div>
    `;

    stepEl.innerHTML = loadingHTML;
}

/**
 * Show results in step
 */
function showResults(stepNumber, content) {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (!stepEl) return;

    stepEl.innerHTML = content;
}

/**
 * Show error in step
 */
function showError(stepNumber, message) {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (!stepEl) return;

    const errorHTML = `
        <div class="alert alert-danger">
            <div class="alert-icon"><i class="fas fa-triangle-exclamation"></i></div>
            <div class="alert-content">
                <div class="alert-title">Error</div>
                <div class="alert-message">${message}</div>
            </div>
        </div>
    `;

    stepEl.innerHTML = errorHTML;
}

/**
 * Simulate delay (for demo purposes)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * ===================================================================
 * EXPORT
 * ===================================================================
 */

// Make available globally
window.WizardEngine = WizardEngine;
window.wizardHelpers = {
    showLoading,
    showResults,
    showError,
    delay
};

console.log('[Wizard] Module loaded');
