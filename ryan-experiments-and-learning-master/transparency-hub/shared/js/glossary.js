/**
 * ===================================================================
 * TRANSPARENCY HUB - GLOSSARY SYSTEM
 * Healthcare terminology tooltips
 * ===================================================================
 */

// Healthcare terminology glossary
const GLOSSARY_TERMS = {
    'CAA': {
        term: 'CAA',
        full: 'Consolidated Appropriations Act',
        definition: 'Federal law (2021) requiring employers to provide price transparency through machine-readable files. Non-compliance can result in penalties up to $100/day per participant.',
        category: 'regulation'
    },
    'TPA': {
        term: 'TPA',
        full: 'Third-Party Administrator',
        definition: 'Company hired by self-insured employers to process claims and manage health benefits. TPAs may engage in spread pricing to profit from the difference between what they pay providers and what they charge employers.',
        category: 'stakeholder'
    },
    'PBM': {
        term: 'PBM',
        full: 'Pharmacy Benefit Manager',
        definition: 'Middleman that manages prescription drug benefits. PBMs negotiate with drug manufacturers and pharmacies, but often keep rebates and engage in spread pricing that costs employers billions.',
        category: 'stakeholder'
    },
    'RBP': {
        term: 'RBP',
        full: 'Reference-Based Pricing',
        definition: 'Payment strategy where employers set a maximum rate for procedures (e.g., Medicare + 40%) rather than accepting provider charges. Can save 30-40% but requires proper implementation to avoid balance billing.',
        category: 'pricing'
    },
    'CPT': {
        term: 'CPT',
        full: 'Current Procedural Terminology',
        definition: 'Standardized medical code set (e.g., CPT 70553 = MRI brain with contrast) used to describe medical procedures for billing. Maintained by the American Medical Association.',
        category: 'coding'
    },
    'NPI': {
        term: 'NPI',
        full: 'National Provider Identifier',
        definition: 'Unique 10-digit number assigned to healthcare providers (e.g., doctors, hospitals, clinics) for identification in transactions. Required for Medicare billing.',
        category: 'identification'
    },
    'EOB': {
        term: 'EOB',
        full: 'Explanation of Benefits',
        definition: 'Document from insurer showing what medical services were billed, what insurance paid, and what you owe. Not a bill, but important for verifying charges.',
        category: 'billing'
    },
    'Spread Pricing': {
        term: 'Spread Pricing',
        full: null,
        definition: 'Hidden fee practice where TPAs/PBMs pay providers less than they charge employers, keeping the "spread" as profit. PBGH found spreads of 100-600% on some services, costing employers millions.',
        category: 'pricing'
    },
    'Balance Billing': {
        term: 'Balance Billing',
        full: null,
        definition: 'When a provider bills you for the difference between their charge and what insurance paid. Can happen with out-of-network providers or reference-based pricing.',
        category: 'billing'
    },
    'Medicare Rate': {
        term: 'Medicare Rate',
        full: null,
        definition: 'Amount Medicare pays for a service, published in federal fee schedules. Used as benchmark because it\'s transparent, evidence-based, and covers costs. Private insurance typically pays 200-400% of Medicare.',
        category: 'pricing'
    },
    'TiC': {
        term: 'TiC',
        full: 'Transparency in Coverage',
        definition: 'Federal requirement for health plans to publish negotiated rates in machine-readable files. Data includes in-network rates, out-of-network allowed amounts, and prescription drug pricing.',
        category: 'regulation'
    },
    'MRF': {
        term: 'MRF',
        full: 'Machine-Readable File',
        definition: 'JSON-formatted file containing negotiated healthcare rates, required by CAA transparency rules. Allows comparison shopping and spread pricing detection.',
        category: 'data'
    },
    'Self-Insured': {
        term: 'Self-Insured',
        full: null,
        definition: 'Employer that pays employee healthcare claims directly instead of buying traditional insurance. 160M Americans are in self-insured plans. Employers are fiduciaries with legal duty to manage costs.',
        category: 'model'
    },
    'Fiduciary Duty': {
        term: 'Fiduciary Duty',
        full: null,
        definition: 'Legal obligation under ERISA for self-insured employers to act in employees\' best interests when managing health benefits. Includes duty to ensure reasonable pricing and monitor vendors.',
        category: 'regulation'
    },
    'ERISA': {
        term: 'ERISA',
        full: 'Employee Retirement Income Security Act',
        definition: 'Federal law governing employer-sponsored benefit plans. Establishes fiduciary duties and enables employers to sue vendors for breach of contract or fraud.',
        category: 'regulation'
    }
};


/**
 * Glossary Controller
 */
class GlossaryController {
    constructor(options = {}) {
        this.terms = options.terms || GLOSSARY_TERMS;
        this.autoProcess = options.autoProcess !== false;
        this.tooltipDelay = options.tooltipDelay || 200;

        this.init();
    }

    /**
     * Initialize glossary system
     */
    init() {
        if (this.autoProcess) {
            this.processPage();
        }

        console.log(`[Glossary] Initialized with ${Object.keys(this.terms).length} terms`);
    }

    /**
     * Process entire page and wrap terms
     */
    processPage() {
        const textNodes = this.getTextNodes(document.body);
        const processedNodes = new Set();

        textNodes.forEach(node => {
            if (!processedNodes.has(node) && !this.isExcluded(node)) {
                this.processTextNode(node);
                processedNodes.add(node);
            }
        });

        console.log(`[Glossary] Processed ${processedNodes.size} text nodes`);
    }

    /**
     * Process specific container
     */
    processContainer(container) {
        const textNodes = this.getTextNodes(container);
        textNodes.forEach(node => {
            if (!this.isExcluded(node)) {
                this.processTextNode(node);
            }
        });
    }

    /**
     * Get all text nodes in element
     */
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }

        return textNodes;
    }

    /**
     * Check if node should be excluded from processing
     */
    isExcluded(node) {
        const excludedTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE'];
        const excludedClasses = ['glossary-term', 'glossary-tooltip', 'no-glossary'];

        let element = node.parentElement;
        while (element) {
            if (excludedTags.includes(element.tagName)) {
                return true;
            }

            if (element.classList) {
                for (const className of excludedClasses) {
                    if (element.classList.contains(className)) {
                        return true;
                    }
                }
            }

            element = element.parentElement;
        }

        return false;
    }

    /**
     * Process single text node
     */
    processTextNode(node) {
        const text = node.textContent;
        const terms = Object.keys(this.terms);

        // Sort terms by length (longest first) to avoid partial matches
        terms.sort((a, b) => b.length - a.length);

        let html = text;
        let hasMatch = false;

        terms.forEach(term => {
            const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
            if (regex.test(html)) {
                hasMatch = true;
                html = html.replace(regex, (match) => this.wrapTerm(match, term));
            }
        });

        if (hasMatch) {
            const span = document.createElement('span');
            span.innerHTML = html;
            node.parentNode.replaceChild(span, node);
        }
    }

    /**
     * Wrap term in glossary markup
     */
    wrapTerm(match, termKey) {
        const termData = this.terms[termKey];
        const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

        return `<span class="glossary-term"
                      data-term="${termKey}"
                      data-tooltip="${tooltipId}"
                      role="button"
                      tabindex="0"
                      aria-describedby="${tooltipId}">
                    ${match}
                    <span class="glossary-tooltip" id="${tooltipId}" role="tooltip">
                        <strong>${termData.full || termData.term}</strong>
                        <p>${termData.definition}</p>
                    </span>
                </span>`;
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Manually create glossary term element
     */
    createTerm(text, termKey) {
        const termData = this.terms[termKey];
        if (!termData) {
            console.warn(`[Glossary] Term not found: ${termKey}`);
            return text;
        }

        const span = document.createElement('span');
        span.className = 'glossary-term';
        span.setAttribute('data-term', termKey);
        span.textContent = text;

        const tooltip = document.createElement('span');
        tooltip.className = 'glossary-tooltip';
        tooltip.innerHTML = `
            <strong>${termData.full || termData.term}</strong>
            <p>${termData.definition}</p>
        `;

        span.appendChild(tooltip);
        return span;
    }

    /**
     * Add custom term
     */
    addTerm(key, data) {
        this.terms[key] = data;
        console.log(`[Glossary] Added term: ${key}`);
    }

    /**
     * Get term data
     */
    getTerm(key) {
        return this.terms[key];
    }

    /**
     * Get all terms by category
     */
    getTermsByCategory(category) {
        return Object.entries(this.terms)
            .filter(([_, data]) => data.category === category)
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {});
    }
}


/**
 * ===================================================================
 * GLOSSARY HELPER FUNCTIONS
 * ===================================================================
 */

/**
 * Create inline glossary reference
 */
function createGlossaryReference(text, termKey) {
    const termData = GLOSSARY_TERMS[termKey];
    if (!termData) return text;

    return `<span class="glossary-term" data-term="${termKey}">
        ${text}
        <span class="glossary-tooltip">
            <strong>${termData.full || termData.term}</strong>
            <p>${termData.definition}</p>
        </span>
    </span>`;
}

/**
 * Build glossary index page content
 */
function buildGlossaryIndex() {
    const categories = {
        regulation: 'Regulations & Laws',
        stakeholder: 'Stakeholders',
        pricing: 'Pricing Models',
        coding: 'Medical Coding',
        identification: 'Identification',
        billing: 'Billing & Claims',
        data: 'Data & Files',
        model: 'Insurance Models'
    };

    let html = '<div class="glossary-index">';

    Object.entries(categories).forEach(([key, label]) => {
        const terms = Object.entries(GLOSSARY_TERMS)
            .filter(([_, data]) => data.category === key);

        if (terms.length > 0) {
            html += `<section class="glossary-category">
                <h3>${label}</h3>
                <dl class="glossary-list">`;

            terms.forEach(([termKey, termData]) => {
                html += `
                    <dt>${termData.full || termData.term} ${termData.full ? `(${termData.term})` : ''}</dt>
                    <dd>${termData.definition}</dd>
                `;
            });

            html += '</dl></section>';
        }
    });

    html += '</div>';
    return html;
}


/**
 * ===================================================================
 * AUTO-INITIALIZATION
 * ===================================================================
 */

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.dataset.glossary !== 'false') {
            window.glossary = new GlossaryController();
        }
    });
} else {
    if (document.body.dataset.glossary !== 'false') {
        window.glossary = new GlossaryController();
    }
}


/**
 * ===================================================================
 * EXPORTS
 * ===================================================================
 */

window.GlossaryController = GlossaryController;
window.GLOSSARY_TERMS = GLOSSARY_TERMS;
window.glossaryHelpers = {
    createGlossaryReference,
    buildGlossaryIndex
};

console.log('[Glossary] Module loaded');
