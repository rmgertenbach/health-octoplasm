# PLAN3: Unified TurboTax-Style Healthcare Transparency Platform

**Created:** November 21, 2024
**Goal:** Transform fragmented site into cohesive, step-by-step patient experience
**Inspiration:** TurboTax's guided flow + Healthcare transparency tools

---

## 🎯 Vision

Create a single, unified platform where patients can:
1. **Upload** a medical bill (photo/PDF)
2. **Get AI-powered analysis** (OCR → CPT codes → pricing comparison)
3. **See results** in simple, actionable format
4. **Take action** (negotiate, dispute, find alternatives)

All with a consistent header, beautiful UI, and intuitive flow.

---

## 📊 Current State Analysis

### What Works Well
- ✅ **Timeline**: Scroll-snap pattern, minimal UI, storytelling flow
- ✅ **Main Site**: Comprehensive nav, React components, organized footer
- ✅ **Experiments**: Interactive tools, autocomplete, mock data patterns
- ✅ **2025-11**: Simplified messaging, card layouts, multi-step bill checker
- ✅ **Design System**: Payerset blue (#0092CA), Font Awesome icons, no emojis

### What Needs Fixing
- ❌ **Headers**: 4 different styles (React nav, minimal back button, simple logo, none)
- ❌ **Folders**: Scattered tools (experiments/, 2025-11/, diagrams/)
- ❌ **Consistency**: Colors, spacing, components vary across pages
- ❌ **OCR**: No bill upload processing (just alert placeholder)
- ❌ **Medical Codes**: No CPT code lookup or citation
- ❌ **API Integration**: Mock data not connected to real processing

---

## 🏗️ Phased Implementation Plan

### **PHASE 1: Foundation - Unified Design System** ⏱️ 2-3 hours

**Goal:** Create shared CSS/JS that all pages use

#### Step 1.1: Create Core Stylesheet
**File:** `/shared/css/core.css`

```css
/* Design tokens from design-principles.md */
:root {
    /* Payerset Brand Colors */
    --payerset-blue: #0092CA;
    --payerset-blue-light: #33A9D6;
    --payerset-blue-dark: #006B96;
    --payerset-blue-soft: rgba(0, 146, 202, 0.1);

    /* Semantic Colors */
    --success-green: #10B981;
    --warning-orange: #F59E0B;
    --danger-red: #EF4444;
    --info-blue: #3B82F6;

    /* Neutrals */
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-600: #4B5563;
    --gray-900: #111827;
    --white: #FFFFFF;

    /* Spacing Scale (8px base) */
    --space-xs: 0.5rem;   /* 8px */
    --space-sm: 1rem;     /* 16px */
    --space-md: 1.5rem;   /* 24px */
    --space-lg: 2rem;     /* 32px */
    --space-xl: 3rem;     /* 48px */
    --space-2xl: 4rem;    /* 64px */

    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-pill: 100px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.16);

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;

    /* Typography */
    --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* CSS Reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-system);
    line-height: 1.6;
    color: var(--gray-900);
    background: var(--gray-50);
}
```

#### Step 1.2: Create Component Stylesheet
**File:** `/shared/css/components.css`

```css
/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
}

.btn-primary {
    background: var(--payerset-blue);
    color: var(--white);
}

.btn-primary:hover {
    background: var(--payerset-blue-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 146, 202, 0.3);
}

/* Cards */
.card {
    background: var(--white);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

/* Badges */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-pill);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
}

.badge-success {
    background: var(--success-green);
    color: var(--white);
}

/* Alerts */
.alert {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border-left: 4px solid;
}

.alert-info {
    background: var(--payerset-blue-soft);
    border-color: var(--payerset-blue);
}

/* Progress Indicators */
.step-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 600px;
    margin: 0 auto var(--space-xl);
}

.step-item {
    flex: 1;
    text-align: center;
    position: relative;
}

.step-item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: var(--gray-200);
}

.step-item.active:not(:last-child)::after,
.step-item.completed:not(:last-child)::after {
    background: var(--payerset-blue);
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gray-200);
    color: var(--gray-600);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
}

.step-item.active .step-number {
    background: var(--payerset-blue);
    color: var(--white);
}

.step-item.completed .step-number {
    background: var(--success-green);
    color: var(--white);
}

.step-label {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.step-item.active .step-label {
    color: var(--payerset-blue);
    font-weight: 600;
}
```

#### Step 1.3: Create Unified Header Component
**File:** `/shared/components/header.html`

```html
<!-- Unified Site Header -->
<header class="site-header" id="siteHeader">
    <div class="header-container">
        <!-- Logo -->
        <a href="/index.html" class="header-logo">
            <span class="logo-mark">PS</span>
            <span class="logo-text">Payerset</span>
        </a>

        <!-- Navigation -->
        <nav class="header-nav">
            <div class="nav-item dropdown">
                <button class="nav-link dropdown-toggle">
                    <i class="fas fa-tools"></i>
                    Tools
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="/tools/patients/index.html" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        For Patients
                    </a>
                    <a href="/tools/employers/index.html" class="dropdown-item">
                        <i class="fas fa-briefcase"></i>
                        For Employers
                    </a>
                    <a href="/tools/providers/index.html" class="dropdown-item">
                        <i class="fas fa-user-doctor"></i>
                        For Providers
                    </a>
                </div>
            </div>
            <a href="/story/index.html" class="nav-link">
                <i class="fas fa-book"></i>
                Our Story
            </a>
            <a href="/learn/index.html" class="nav-link">
                <i class="fas fa-lightbulb"></i>
                Learn
            </a>
        </nav>

        <!-- CTA -->
        <a href="https://payerset.com" class="header-cta" target="_blank" rel="noopener noreferrer">
            Visit Payerset
        </a>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
            <i class="fas fa-bars"></i>
        </button>
    </div>
</header>

<style>
.site-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--gray-200);
    height: 64px;
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
}

.header-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--payerset-blue);
}

.logo-mark {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--payerset-blue);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: var(--gray-900);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-fast);
}

.nav-link:hover {
    color: var(--payerset-blue);
}

.header-cta {
    padding: 0.75rem 1.5rem;
    background: var(--payerset-blue);
    color: var(--white);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-fast);
}

.header-cta:hover {
    background: var(--payerset-blue-dark);
    transform: translateY(-2px);
}

.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--gray-900);
    cursor: pointer;
}

@media (max-width: 768px) {
    .header-nav {
        display: none;
    }

    .mobile-menu-toggle {
        display: block;
    }
}
</style>
```

---

### **PHASE 2: TurboTax-Style Bill Analyzer** ⏱️ 4-5 hours

**Goal:** Create multi-step wizard for bill checking

#### Step 2.1: Create Multi-Step Flow Structure
**File:** `/tools/patients/bill-analyzer.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Analyzer | Payerset</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/shared/css/core.css">
    <link rel="stylesheet" href="/shared/css/components.css">
</head>
<body>
    <!-- Include unified header -->
    <div id="header-placeholder"></div>

    <main class="wizard-container">
        <!-- Progress Indicator -->
        <div class="step-indicator">
            <div class="step-item active" data-step="1">
                <div class="step-number">1</div>
                <div class="step-label">Upload Bill</div>
            </div>
            <div class="step-item" data-step="2">
                <div class="step-number">2</div>
                <div class="step-label">Review Details</div>
            </div>
            <div class="step-item" data-step="3">
                <div class="step-number">3</div>
                <div class="step-label">Get Results</div>
            </div>
            <div class="step-item" data-step="4">
                <div class="step-number">4</div>
                <div class="step-label">Take Action</div>
            </div>
        </div>

        <!-- Step 1: Upload Bill -->
        <div class="wizard-step" id="step-1" style="display: block;">
            <div class="step-content">
                <h1>Let's Check Your Medical Bill</h1>
                <p class="subtitle">Upload a photo or PDF of your bill, and we'll analyze it for you.</p>

                <!-- Drag-drop upload zone -->
                <div class="upload-zone" id="uploadZone">
                    <i class="fas fa-cloud-upload upload-icon"></i>
                    <h3>Drag your bill here</h3>
                    <p>or click to browse</p>
                    <span class="upload-hint">Supports: PDF, JPG, PNG (max 10MB)</span>
                    <input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" hidden>
                </div>

                <div class="divider">
                    <span>OR</span>
                </div>

                <button class="btn btn-secondary" onclick="wizard.skipToManual()">
                    <i class="fas fa-keyboard"></i>
                    Enter Details Manually
                </button>
            </div>
        </div>

        <!-- Step 2: Review OCR Results -->
        <div class="wizard-step" id="step-2" style="display: none;">
            <div class="step-content">
                <h1>We Found These Details</h1>
                <p class="subtitle">Please verify the information we extracted from your bill.</p>

                <div class="card" id="extractedData">
                    <!-- Populated by OCR -->
                </div>

                <div class="button-row">
                    <button class="btn btn-secondary" onclick="wizard.prevStep()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="btn btn-primary" onclick="wizard.nextStep()">
                        Looks Good <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Step 3: Processing & Results -->
        <div class="wizard-step" id="step-3" style="display: none;">
            <!-- Loading state -->
            <div class="loading-state" id="loadingState">
                <div class="spinner"></div>
                <h2>Analyzing Your Bill...</h2>
                <p>We're comparing your charges against <strong>18,000+ real negotiated rates</strong></p>
            </div>

            <!-- Results state -->
            <div class="results-state" id="resultsState" style="display: none;">
                <div class="verdict-card" id="verdictCard">
                    <!-- Populated by analysis -->
                </div>

                <div class="comparison-table">
                    <!-- Price breakdown -->
                </div>

                <button class="btn btn-primary btn-lg" onclick="wizard.nextStep()">
                    What Can I Do? <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- Step 4: Action Plan -->
        <div class="wizard-step" id="step-4" style="display: none;">
            <div class="step-content">
                <h1>Here's Your Action Plan</h1>

                <div class="action-cards">
                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <h3>1. Call Billing Department</h3>
                        <p>Use our script to negotiate your bill down to the fair price.</p>
                        <button class="btn btn-secondary">
                            <i class="fas fa-file-alt"></i> Download Script
                        </button>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <h3>2. Request Itemized Bill</h3>
                        <p>Get a detailed breakdown to dispute specific charges.</p>
                        <button class="btn btn-secondary">
                            <i class="fas fa-file-alt"></i> Sample Letter
                        </button>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <h3>3. Rate This Provider</h3>
                        <p>Help others avoid overcharges by sharing your experience.</p>
                        <button class="btn btn-secondary" onclick="window.location.href='../provider-reviews.html'">
                            <i class="fas fa-star"></i> Leave Review
                        </button>
                    </div>
                </div>

                <div class="button-row">
                    <button class="btn btn-secondary" onclick="wizard.reset()">
                        <i class="fas fa-redo"></i> Check Another Bill
                    </button>
                    <button class="btn btn-primary" onclick="wizard.downloadReport()">
                        <i class="fas fa-download"></i> Download Full Report
                    </button>
                </div>
            </div>
        </div>
    </main>

    <script src="/shared/js/wizard.js"></script>
</body>
</html>
```

#### Step 2.2: Create Wizard State Management
**File:** `/shared/js/wizard.js`

```javascript
// TurboTax-style wizard state machine
const wizard = {
    currentStep: 1,
    totalSteps: 4,
    data: {
        // User inputs
        file: null,
        fileUrl: null,

        // OCR results
        ocrText: null,

        // Extracted data
        procedure: null,
        procedureCode: null,
        chargedAmount: null,
        provider: null,
        providerNPI: null,
        dateOfService: null,
        zipCode: null,

        // Analysis results
        fairPrice: null,
        medicareRate: null,
        savings: null,
        percentageOver: null,
        verdict: null // 'overcharged' | 'fair' | 'excellent'
    },

    // Initialize wizard
    init() {
        this.setupEventListeners();
        this.loadHeaderFooter();
        this.updateProgress();
    },

    // Event listeners
    setupEventListeners() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            this.handleFileUpload(file);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            this.handleFileUpload(file);
        });
    },

    // Handle file upload
    async handleFileUpload(file) {
        if (!file) return;

        // Validate file
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, JPG, or PNG file.');
            return;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 10MB.');
            return;
        }

        this.data.file = file;

        // Show loading state
        const uploadZone = document.getElementById('uploadZone');
        uploadZone.innerHTML = `
            <div class="spinner"></div>
            <h3>Processing your bill...</h3>
            <p>This may take a moment</p>
        `;

        // Process file
        await this.processFile(file);

        // Move to next step
        this.nextStep();
    },

    // Process file with OCR (Tesseract placeholder)
    async processFile(file) {
        // Create file URL for preview
        this.data.fileUrl = URL.createObjectURL(file);

        // TODO: Implement Tesseract OCR
        // For now, simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock extracted data (will be replaced by OCR)
        this.data.ocrText = "MOCK OCR TEXT";
        this.data.procedure = "MRI Scan";
        this.data.procedureCode = "CPT 70553";
        this.data.chargedAmount = 2800;
        this.data.provider = "Central Hospital";
        this.data.providerNPI = "1234567890";
        this.data.dateOfService = "2024-11-15";
        this.data.zipCode = "78701";

        // Display extracted data for review
        this.displayExtractedData();
    },

    // Display extracted data for user review
    displayExtractedData() {
        const container = document.getElementById('extractedData');
        container.innerHTML = `
            <div class="extracted-field">
                <label>Procedure</label>
                <input type="text" value="${this.data.procedure}"
                       onchange="wizard.data.procedure = this.value">
                <span class="field-source">
                    <i class="fas fa-robot"></i> Auto-detected
                </span>
            </div>

            <div class="extracted-field">
                <label>Procedure Code</label>
                <input type="text" value="${this.data.procedureCode}"
                       onchange="wizard.data.procedureCode = this.value">
                <a href="https://www.aapc.com/codes/cpt-codes/${this.data.procedureCode.replace('CPT ', '')}"
                   target="_blank" class="field-citation">
                    <i class="fas fa-external-link-alt"></i> Verify Code
                </a>
            </div>

            <div class="extracted-field">
                <label>Amount Charged</label>
                <input type="number" value="${this.data.chargedAmount}"
                       onchange="wizard.data.chargedAmount = parseFloat(this.value)">
            </div>

            <div class="extracted-field">
                <label>Provider</label>
                <input type="text" value="${this.data.provider}"
                       onchange="wizard.data.provider = this.value">
            </div>

            <div class="extracted-field">
                <label>Date of Service</label>
                <input type="date" value="${this.data.dateOfService}"
                       onchange="wizard.data.dateOfService = this.value">
            </div>

            <div class="extracted-field">
                <label>ZIP Code</label>
                <input type="text" value="${this.data.zipCode}"
                       pattern="[0-9]{5}"
                       onchange="wizard.data.zipCode = this.value">
            </div>
        `;
    },

    // Skip to manual entry
    skipToManual() {
        // Show manual entry form in step 2
        const container = document.getElementById('extractedData');
        container.innerHTML = `
            <p style="text-align: center; color: var(--gray-600); margin-bottom: 2rem;">
                No problem! Enter your bill details below.
            </p>
        `;
        this.displayExtractedData();
        this.nextStep();
    },

    // Navigation
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Hide current step
            document.getElementById(`step-${this.currentStep}`).style.display = 'none';

            // Show next step
            this.currentStep++;
            document.getElementById(`step-${this.currentStep}`).style.display = 'block';

            // Update progress
            this.updateProgress();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Special handling for step 3 (analysis)
            if (this.currentStep === 3) {
                this.analyzeБill();
            }
        }
    },

    prevStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.getElementById(`step-${this.currentStep}`).style.display = 'none';

            // Show previous step
            this.currentStep--;
            document.getElementById(`step-${this.currentStep}`).style.display = 'block';

            // Update progress
            this.updateProgress();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    // Update progress indicator
    updateProgress() {
        const steps = document.querySelectorAll('.step-item');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    },

    // Analyze bill
    async analyzeБill() {
        // Show loading
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('resultsState').style.display = 'none';

        // Simulate API call to pricing database
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Calculate fair price (mock - will be replaced by API)
        this.data.fairPrice = 425;
        this.data.medicareRate = 380;
        this.data.savings = this.data.chargedAmount - this.data.fairPrice;
        this.data.percentageOver = Math.round((this.data.savings / this.data.fairPrice) * 100);

        // Determine verdict
        if (this.data.savings > this.data.fairPrice * 0.3) {
            this.data.verdict = 'overcharged';
        } else if (this.data.savings > 0) {
            this.data.verdict = 'fair';
        } else {
            this.data.verdict = 'excellent';
        }

        // Display results
        this.displayResults();

        // Hide loading, show results
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('resultsState').style.display = 'block';
    },

    // Display analysis results
    displayResults() {
        const verdictCard = document.getElementById('verdictCard');

        if (this.data.verdict === 'overcharged') {
            verdictCard.className = 'verdict-card overcharged';
            verdictCard.innerHTML = `
                <div class="verdict-icon">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>
                <h2>You're Overpaying</h2>
                <p>You were charged <strong>${this.data.percentageOver}% more</strong> than the fair price.</p>
                <div class="savings-amount">
                    Potential Savings: <strong>$${this.data.savings.toLocaleString()}</strong>
                </div>
            `;
        } else if (this.data.verdict === 'fair') {
            verdictCard.className = 'verdict-card fair';
            verdictCard.innerHTML = `
                <div class="verdict-icon">
                    <i class="fas fa-circle-check"></i>
                </div>
                <h2>Fair Price</h2>
                <p>You were charged within the normal range.</p>
                <div class="savings-amount">
                    Small Savings: <strong>$${this.data.savings.toLocaleString()}</strong>
                </div>
            `;
        } else {
            verdictCard.className = 'verdict-card excellent';
            verdictCard.innerHTML = `
                <div class="verdict-icon">
                    <i class="fas fa-star"></i>
                </div>
                <h2>Great Deal!</h2>
                <p>You got an excellent price.</p>
                <div class="savings-amount">
                    You saved money!
                </div>
            `;
        }
    },

    // Download report
    downloadReport() {
        const report = {
            procedure: this.data.procedure,
            procedureCode: this.data.procedureCode,
            chargedAmount: this.data.chargedAmount,
            fairPrice: this.data.fairPrice,
            medicareRate: this.data.medicareRate,
            savings: this.data.savings,
            percentageOver: this.data.percentageOver,
            verdict: this.data.verdict,
            provider: this.data.provider,
            providerNPI: this.data.providerNPI,
            dateOfService: this.data.dateOfService,
            zipCode: this.data.zipCode,
            citations: [
                {
                    source: "CMS Physician Fee Schedule",
                    url: "https://www.cms.gov/medicare/physician-fee-schedule",
                    date: "2024"
                },
                {
                    source: "AAPC CPT Code Database",
                    url: `https://www.aapc.com/codes/cpt-codes/${this.data.procedureCode.replace('CPT ', '')}`,
                    date: "2024"
                }
            ]
        };

        // Create JSON blob
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `bill-analysis-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    },

    // Reset wizard
    reset() {
        this.currentStep = 1;
        this.data = {};
        document.getElementById('step-1').style.display = 'block';
        for (let i = 2; i <= this.totalSteps; i++) {
            document.getElementById(`step-${i}`).style.display = 'none';
        }
        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Load header/footer
    loadHeaderFooter() {
        // TODO: Fetch and inject header/footer HTML
        console.log('Loading unified header/footer');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    wizard.init();
});
```

---

### **PHASE 3: OCR Integration (Tesseract.js)** ⏱️ 3-4 hours

**Goal:** Implement bill image → text → structured data pipeline

#### Step 3.1: Add Tesseract.js Library
**File:** Update `/tools/patients/bill-analyzer.html`

```html
<!-- Add before closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"></script>
<script src="/shared/js/ocr.js"></script>
```

#### Step 3.2: Create OCR Processing Module
**File:** `/shared/js/ocr.js`

```javascript
// OCR Processing with Tesseract.js
const OCRProcessor = {
    // Initialize Tesseract worker
    worker: null,

    async init() {
        this.worker = await Tesseract.createWorker('eng');
    },

    // Process image/PDF to text
    async extractText(file) {
        if (!this.worker) {
            await this.init();
        }

        // Convert PDF to image if needed
        let imageFile = file;
        if (file.type === 'application/pdf') {
            imageFile = await this.pdfToImage(file);
        }

        // Run OCR
        const { data: { text } } = await this.worker.recognize(imageFile);

        return text;
    },

    // Convert PDF first page to image
    async pdfToImage(pdfFile) {
        // TODO: Implement PDF.js conversion
        // For now, return as-is and handle error
        throw new Error('PDF conversion not yet implemented. Please upload JPG/PNG.');
    },

    // Parse medical bill text to structured data
    parseBillText(text) {
        const data = {
            procedure: null,
            procedureCode: null,
            chargedAmount: null,
            provider: null,
            providerNPI: null,
            dateOfService: null,
            patientName: null
        };

        // Extract CPT codes (format: CPT XXXXX or just XXXXX)
        const cptMatch = text.match(/CPT[\s:]?(\d{5})/i) || text.match(/\b(\d{5})\b/);
        if (cptMatch) {
            data.procedureCode = `CPT ${cptMatch[1]}`;
        }

        // Extract dollar amounts (look for charges, billed amount, etc.)
        const amountMatch = text.match(/(?:charge[d]?|bill[ed]?|amount|total)[\s:$]*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
        if (amountMatch) {
            data.chargedAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
        }

        // Extract NPI (10-digit number)
        const npiMatch = text.match(/NPI[\s:#]*(\d{10})/i) || text.match(/\b(\d{10})\b/);
        if (npiMatch) {
            data.providerNPI = npiMatch[1];
        }

        // Extract date (MM/DD/YYYY or MM-DD-YYYY)
        const dateMatch = text.match(/(?:date.*?service|DOS)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
        if (dateMatch) {
            data.dateOfService = this.normalizeDate(dateMatch[1]);
        }

        // Extract provider name (look for patterns)
        const providerMatch = text.match(/(?:provider|facility|hospital)[\s:]*([A-Z][A-Za-z\s&]+(?:Hospital|Medical|Clinic|Center))/i);
        if (providerMatch) {
            data.provider = providerMatch[1].trim();
        }

        return data;
    },

    // Normalize date to YYYY-MM-DD
    normalizeDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return null;
        return date.toISOString().split('T')[0];
    },

    // Lookup CPT code details
    async lookupCPTCode(code) {
        // Extract numeric part
        const numericCode = code.replace(/\D/g, '');

        // Mock CPT database (will be replaced by API)
        const cptDatabase = {
            '70553': {
                code: 'CPT 70553',
                description: 'MRI brain without and with contrast',
                category: 'Radiology',
                citation: {
                    source: 'AAPC CPT Code Database',
                    url: `https://www.aapc.com/codes/cpt-codes/${numericCode}`,
                    verified: new Date().toISOString()
                }
            },
            '45378': {
                code: 'CPT 45378',
                description: 'Colonoscopy, flexible',
                category: 'Surgery',
                citation: {
                    source: 'AAPC CPT Code Database',
                    url: `https://www.aapc.com/codes/cpt-codes/${numericCode}`,
                    verified: new Date().toISOString()
                }
            }
            // ... more codes
        };

        return cptDatabase[numericCode] || {
            code: `CPT ${numericCode}`,
            description: 'Code details not found',
            category: 'Unknown',
            citation: {
                source: 'Manual Entry',
                url: null,
                verified: null
            }
        };
    },

    // Cleanup
    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
        }
    }
};

// Export for use in wizard
window.OCRProcessor = OCRProcessor;
```

#### Step 3.3: Integrate OCR into Wizard
**Update:** `/shared/js/wizard.js` - Replace `processFile` method:

```javascript
// Process file with OCR (Tesseract)
async processFile(file) {
    try {
        // Create file URL for preview
        this.data.fileUrl = URL.createObjectURL(file);

        // Extract text using OCR
        this.data.ocrText = await OCRProcessor.extractText(file);

        // Parse text to structured data
        const parsedData = OCRProcessor.parseBillText(this.data.ocrText);

        // Merge parsed data
        Object.assign(this.data, parsedData);

        // Lookup CPT code if found
        if (this.data.procedureCode) {
            const cptDetails = await OCRProcessor.lookupCPTCode(this.data.procedureCode);
            this.data.procedure = cptDetails.description;
            this.data.procedureCategory = cptDetails.category;
            this.data.cptCitation = cptDetails.citation;
        }

        // Display extracted data for review
        this.displayExtractedData();

    } catch (error) {
        console.error('OCR Error:', error);
        alert(`Error processing file: ${error.message}`);

        // Fall back to manual entry
        this.skipToManual();
    }
}
```

---

### **PHASE 4: CPT Code Database & Citations** ⏱️ 2-3 hours

**Goal:** Professional medical billing codes with official citations

#### Step 4.1: Create CPT Code Database
**File:** `/shared/data/cpt-codes.json`

```json
{
  "70553": {
    "code": "70553",
    "description": "Magnetic resonance imaging, brain, including brain stem; without contrast material, followed by contrast material(s) and further sequences",
    "category": "Radiology",
    "subcategory": "Diagnostic Radiology (Diagnostic Imaging)",
    "rvu": 3.44,
    "medicare_rate_2024": 380.00,
    "typical_range": {
      "min": 300,
      "max": 4000,
      "median": 425
    },
    "citations": [
      {
        "source": "CMS Physician Fee Schedule 2024",
        "url": "https://www.cms.gov/medicare/payment/fee-schedules/physician",
        "accessed": "2024-11-21"
      },
      {
        "source": "AAPC CPT Code Reference",
        "url": "https://www.aapc.com/codes/cpt-codes/70553",
        "accessed": "2024-11-21"
      }
    ]
  },
  "45378": {
    "code": "45378",
    "description": "Colonoscopy, flexible; diagnostic, including collection of specimen(s) by brushing or washing, when performed (separate procedure)",
    "category": "Surgery",
    "subcategory": "Digestive System",
    "rvu": 4.43,
    "medicare_rate_2024": 980.00,
    "typical_range": {
      "min": 800,
      "max": 5000,
      "median": 1120
    },
    "citations": [
      {
        "source": "CMS Physician Fee Schedule 2024",
        "url": "https://www.cms.gov/medicare/payment/fee-schedules/physician",
        "accessed": "2024-11-21"
      },
      {
        "source": "AAPC CPT Code Reference",
        "url": "https://www.aapc.com/codes/cpt-codes/45378",
        "accessed": "2024-11-21"
      }
    ]
  }
}
```

#### Step 4.2: Create Code Lookup API
**File:** `/shared/js/cpt-lookup.js`

```javascript
// CPT Code Lookup Service
const CPTLookup = {
    database: null,

    // Load CPT database
    async init() {
        const response = await fetch('/shared/data/cpt-codes.json');
        this.database = await response.json();
    },

    // Search by code
    async searchByCode(code) {
        if (!this.database) await this.init();

        const numericCode = code.replace(/\D/g, '');
        return this.database[numericCode] || null;
    },

    // Search by description
    async searchByDescription(query) {
        if (!this.database) await this.init();

        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const [code, data] of Object.entries(this.database)) {
            if (data.description.toLowerCase().includes(lowerQuery)) {
                results.push({ code, ...data });
            }
        }

        return results.slice(0, 10); // Limit to 10 results
    },

    // Get citation HTML
    formatCitations(codeData) {
        if (!codeData.citations) return '';

        return codeData.citations.map(citation => `
            <div class="citation">
                <i class="fas fa-link"></i>
                <a href="${citation.url}" target="_blank" rel="noopener noreferrer">
                    ${citation.source}
                </a>
                <span class="citation-date">(Accessed ${citation.accessed})</span>
            </div>
        `).join('');
    },

    // Verify code online
    verifyCode(code) {
        const numericCode = code.replace(/\D/g, '');
        return `https://www.aapc.com/codes/cpt-codes/${numericCode}`;
    }
};

window.CPTLookup = CPTLookup;
```

---

### **PHASE 5: Web Search Integration** ⏱️ 1-2 hours

**Goal:** Allow users to search for official CPT code definitions

#### Step 5.1: Add Search Capability
**File:** Update `/tools/patients/bill-analyzer.html` - Add to Step 2:

```html
<!-- In step 2, after extracted data -->
<div class="help-section">
    <h3>Not sure about the code?</h3>
    <div class="search-box">
        <input type="text"
               id="cptSearch"
               placeholder="Search CPT codes (e.g., 'MRI brain')"
               class="form-input">
        <button class="btn btn-secondary" onclick="wizard.searchCPTCode()">
            <i class="fas fa-search"></i> Search
        </button>
    </div>
    <div id="searchResults" class="search-results"></div>
</div>
```

#### Step 5.2: Implement Search Function
**Update:** `/shared/js/wizard.js` - Add method:

```javascript
// Search CPT codes
async searchCPTCode() {
    const query = document.getElementById('cptSearch').value.trim();
    if (!query) return;

    const results = await CPTLookup.searchByDescription(query);
    const container = document.getElementById('searchResults');

    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No codes found. Try different keywords.</p>';
        return;
    }

    container.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="wizard.selectCPTCode('${result.code}')">
            <div class="result-code">CPT ${result.code}</div>
            <div class="result-description">${result.description}</div>
            <div class="result-category">${result.category} • Medicare: $${result.medicare_rate_2024}</div>
        </div>
    `).join('');
},

// Select CPT code from search
async selectCPTCode(code) {
    const codeData = await CPTLookup.searchByCode(code);
    this.data.procedureCode = `CPT ${code}`;
    this.data.procedure = codeData.description;
    this.data.procedureCategory = codeData.category;
    this.data.cptCitation = codeData.citations;

    // Update form
    this.displayExtractedData();

    // Clear search
    document.getElementById('cptSearch').value = '';
    document.getElementById('searchResults').innerHTML = '';
}
```

---

### **PHASE 6: Unified Folder Structure** ⏱️ 2-3 hours

**Goal:** Reorganize files into clean, scalable structure

#### Step 6.1: Create New Structure
```bash
# Create directories
mkdir -p /tools/patients
mkdir -p /tools/employers
mkdir -p /tools/providers
mkdir -p /story
mkdir -p /learn
mkdir -p /shared/css
mkdir -p /shared/js
mkdir -p /shared/data
mkdir -p /shared/components

# Move files
mv 2025-11/bill-checker.html → /tools/patients/bill-analyzer.html
mv 2025-11/provider-reviews.html → /tools/patients/provider-reviews.html
mv experiments/patients/* → /tools/patients/
mv experiments/employers/* → /tools/employers/
mv experiments/providers/* → /tools/providers/
mv timeline.html → /story/index.html
mv 2025-11/index.html → /learn/index.html

# Update all internal links
# (Script needed - will be in Step 6.2)
```

#### Step 6.2: Create Migration Script
**File:** `/scripts/migrate-links.js`

```javascript
// Node.js script to update all internal links
const fs = require('fs');
const path = require('path');

const linkMappings = {
    '2025-11/bill-checker.html': '/tools/patients/bill-analyzer.html',
    '2025-11/provider-reviews.html': '/tools/patients/provider-reviews.html',
    'experiments/patients/': '/tools/patients/',
    'experiments/employers/': '/tools/employers/',
    'experiments/providers/': '/tools/providers/',
    'timeline.html': '/story/index.html',
    '2025-11/index.html': '/learn/index.html'
};

// Recursively find all HTML files
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Update links in file
function updateLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldPath, newPath] of Object.entries(linkMappings)) {
        const regex = new RegExp(oldPath.replace(/\//g, '\\/'), 'g');
        if (content.match(regex)) {
            content = content.replace(regex, newPath);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

// Run migration
const htmlFiles = findHTMLFiles('./');
htmlFiles.forEach(updateLinks);
console.log('Migration complete!');
```

---

## 🎨 Visual Design Mockups

### Step Progress Indicator
```
[ ● ]━━━━[ ○ ]━━━━[ ○ ]━━━━[ ○ ]
Upload    Review   Results  Action
```

### Upload Zone
```
┌─────────────────────────────────┐
│                                 │
│         ☁️                      │
│    Drag your bill here          │
│    or click to browse           │
│                                 │
│  PDF, JPG, PNG (max 10MB)       │
└─────────────────────────────────┘
```

### Results Card (Overcharged)
```
┌─────────────────────────────────┐
│  ⚠️  You're Overpaying          │
│                                 │
│  You were charged 559% more     │
│  than the fair price.           │
│                                 │
│  Potential Savings: $2,375      │
└─────────────────────────────────┘
```

---

## 📝 Implementation Checklist

### Phase 1: Foundation
- [ ] Create `/shared/css/core.css` with design tokens
- [ ] Create `/shared/css/components.css` with UI components
- [ ] Create `/shared/components/header.html` unified header
- [ ] Create `/shared/components/footer.html` unified footer
- [ ] Test header on 3 different page types

### Phase 2: TurboTax Flow
- [ ] Create `/tools/patients/bill-analyzer.html` multi-step wizard
- [ ] Create `/shared/js/wizard.js` state management
- [ ] Implement drag-drop file upload
- [ ] Create 4-step flow (Upload → Review → Results → Action)
- [ ] Add progress indicator
- [ ] Test wizard flow end-to-end

### Phase 3: OCR Integration
- [ ] Add Tesseract.js library
- [ ] Create `/shared/js/ocr.js` OCR processor
- [ ] Implement text extraction from images
- [ ] Implement bill text parsing (CPT codes, amounts, dates)
- [ ] Test with 5 sample bills
- [ ] Handle OCR errors gracefully

### Phase 4: CPT Code Database
- [ ] Create `/shared/data/cpt-codes.json` with 20+ codes
- [ ] Create `/shared/js/cpt-lookup.js` lookup service
- [ ] Add citations with official sources
- [ ] Format citation display
- [ ] Add "Verify Code" external links

### Phase 5: Web Search
- [ ] Add CPT code search input
- [ ] Implement search function
- [ ] Display search results
- [ ] Allow code selection from results
- [ ] Test search accuracy

### Phase 6: Folder Reorganization
- [ ] Create new folder structure
- [ ] Move files to new locations
- [ ] Create `/scripts/migrate-links.js`
- [ ] Run migration script
- [ ] Test all internal links
- [ ] Update sitemap
- [ ] Add redirects for old URLs

### Phase 7: Testing & Polish
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Validate accessibility (WCAG AA)
- [ ] Check loading performance
- [ ] Test with real bill images
- [ ] Get user feedback
- [ ] Document all new features

---

## 🚀 Next Steps

1. **Review this plan** with the team
2. **Start with Phase 1** (Foundation) to establish design system
3. **Build Phase 2** (TurboTax flow) on top of foundation
4. **Iterate** based on user testing

---

## 📚 References

- [TurboTax UX Patterns](https://turbotax.intuit.com)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [CMS CPT Code Database](https://www.cms.gov/medicare/coding-billing/cpt-codes)
- [AAPC CPT Code Reference](https://www.aapc.com/codes/cpt-codes/)
- [Design Principles](/DEVLOG/design-principles.md)

---

**Status:** 📝 Planning Complete - Ready for Implementation
**Estimated Total Time:** 14-20 hours
**Complexity:** Medium-High
**Impact:** 🔥🔥🔥🔥🔥 (Transformational)
