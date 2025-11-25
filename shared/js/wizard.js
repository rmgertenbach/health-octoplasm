/**
 * TurboTax-Style Wizard State Machine
 * Multi-step bill checking wizard with file upload and price analysis
 * Created: November 21, 2024
 */

(function() {
    'use strict';

    const wizard = {
        // State
        currentStep: 1,
        totalSteps: 5,

        // User data
        data: {
            // File upload
            file: null,
            fileUrl: null,

            // OCR results (mocked for now - will use Tesseract in Phase 3)
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
            verdict: null, // 'overcharged' | 'fair' | 'excellent'

            // Situational context (Step 4 questionnaire)
            insuranceStatus: null,
            financialSituation: null,
            previousActions: [],
            communicationPreference: null,
            urgency: null,
            providerRelationship: null,
            additionalNotes: null
        },

        /**
         * Initialize wizard
         */
        init() {
            console.log('[Wizard] Initializing...');
            this.setupEventListeners();
            this.updateProgress();
            this.updateAPIKeyStatus();
        },

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            const uploadZone = document.getElementById('uploadZone');
            const fileInput = document.getElementById('fileInput');

            if (!uploadZone || !fileInput) {
                console.warn('[Wizard] Upload elements not found');
                return;
            }

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

        /**
         * Handle file upload
         */
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
                <h3 style="margin-top: var(--space-md);">Processing your bill...</h3>
                <p>This may take a moment</p>
            `;

            // Process file
            await this.processFile(file);

            // Move to next step
            this.nextStep();
        },

        /**
         * Process file (mock OCR - will be replaced with Tesseract in Phase 3)
         */
        async processFile(file) {
            // Create file URL for preview
            this.data.fileUrl = URL.createObjectURL(file);

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock extracted data (will be replaced by actual OCR)
            this.data.ocrText = "MOCK OCR TEXT";
            this.data.procedure = "MRI Brain";
            this.data.procedureCode = "CPT 70553";
            this.data.chargedAmount = 2800;
            this.data.provider = "Central Hospital";
            this.data.providerNPI = "1234567890";
            this.data.dateOfService = "2024-11-15";
            this.data.zipCode = "78701";

            // Display extracted data for review
            this.displayExtractedData();
        },

        /**
         * Display extracted data for user review
         */
        displayExtractedData() {
            const container = document.getElementById('extractedData');
            if (!container) return;

            container.innerHTML = `
                <div class="extracted-field">
                    <label>Procedure</label>
                    <input type="text" class="form-input" value="${this.data.procedure || ''}"
                           onchange="wizard.data.procedure = this.value">
                    <span class="field-source">
                        <i class="fas fa-robot"></i> Auto-detected
                    </span>
                </div>

                <div class="extracted-field">
                    <label>Procedure Code</label>
                    <input type="text" class="form-input" value="${this.data.procedureCode || ''}"
                           onchange="wizard.data.procedureCode = this.value">
                    <a href="https://www.aapc.com/codes/cpt-codes/${this.data.procedureCode?.replace('CPT ', '')}"
                       target="_blank" rel="noopener noreferrer" class="field-citation">
                        <i class="fas fa-external-link-alt"></i> Verify Code
                    </a>
                </div>

                <div class="extracted-field">
                    <label>Amount Charged</label>
                    <input type="number" class="form-input" value="${this.data.chargedAmount || ''}"
                           onchange="wizard.data.chargedAmount = parseFloat(this.value)">
                </div>

                <div class="extracted-field">
                    <label>Provider</label>
                    <input type="text" class="form-input" value="${this.data.provider || ''}"
                           onchange="wizard.data.provider = this.value">
                </div>

                <div class="extracted-field">
                    <label>Date of Service</label>
                    <input type="date" class="form-input" value="${this.data.dateOfService || ''}"
                           onchange="wizard.data.dateOfService = this.value">
                </div>

                <div class="extracted-field">
                    <label>ZIP Code</label>
                    <input type="text" class="form-input" value="${this.data.zipCode || ''}"
                           pattern="[0-9]{5}"
                           onchange="wizard.data.zipCode = this.value">
                </div>
            `;
        },

        /**
         * Skip to manual entry
         */
        skipToManual() {
            const container = document.getElementById('extractedData');
            if (container) {
                container.innerHTML = `
                    <p style="text-align: center; color: var(--gray-600); margin-bottom: 2rem;">
                        No problem! Enter your bill details below.
                    </p>
                `;
            }
            this.displayExtractedData();
            this.nextStep();
        },

        /**
         * Navigate to next step
         */
        nextStep() {
            if (this.currentStep < this.totalSteps) {
                // Special handling for step 4 (capture questionnaire data)
                if (this.currentStep === 4) {
                    this.captureQuestionnaireData();
                }

                // Hide current step
                const currentStepEl = document.getElementById(`step-${this.currentStep}`);
                if (currentStepEl) {
                    currentStepEl.classList.remove('active');
                }

                // Show next step
                this.currentStep++;
                const nextStepEl = document.getElementById(`step-${this.currentStep}`);
                if (nextStepEl) {
                    nextStepEl.classList.add('active');
                }

                // Update progress
                this.updateProgress();

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Special handling for step 3 (analysis)
                if (this.currentStep === 3) {
                    this.analyzeBill();
                }
            }
        },

        /**
         * Navigate to previous step
         */
        prevStep() {
            if (this.currentStep > 1) {
                // Hide current step
                const currentStepEl = document.getElementById(`step-${this.currentStep}`);
                if (currentStepEl) {
                    currentStepEl.classList.remove('active');
                }

                // Show previous step
                this.currentStep--;
                const prevStepEl = document.getElementById(`step-${this.currentStep}`);
                if (prevStepEl) {
                    prevStepEl.classList.add('active');
                }

                // Update progress
                this.updateProgress();

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        /**
         * Update progress indicator
         */
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

        /**
         * Capture questionnaire data from Step 4
         */
        captureQuestionnaireData() {
            // Insurance status
            const insuranceStatus = document.getElementById('insuranceStatus');
            if (insuranceStatus) {
                this.data.insuranceStatus = insuranceStatus.value;
            }

            // Financial situation
            const financialSituation = document.getElementById('financialSituation');
            if (financialSituation) {
                this.data.financialSituation = financialSituation.value;
            }

            // Previous actions (checkboxes)
            this.data.previousActions = [];
            const actionCheckboxes = ['action_called', 'action_itemized', 'action_disputed', 'action_none'];
            actionCheckboxes.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox && checkbox.checked) {
                    this.data.previousActions.push(checkbox.value);
                }
            });

            // Communication preference
            const communicationPreference = document.getElementById('communicationPreference');
            if (communicationPreference) {
                this.data.communicationPreference = communicationPreference.value;
            }

            // Urgency
            const urgency = document.getElementById('urgency');
            if (urgency) {
                this.data.urgency = urgency.value;
            }

            // Provider relationship
            const providerRelationship = document.getElementById('providerRelationship');
            if (providerRelationship) {
                this.data.providerRelationship = providerRelationship.value;
            }

            // Additional notes
            const additionalNotes = document.getElementById('additionalNotes');
            if (additionalNotes) {
                this.data.additionalNotes = additionalNotes.value.trim();
            }

            // Update fair price display in Step 4 if needed (for next time)
            const fairPriceDisplay = document.getElementById('fairPriceDisplay');
            if (fairPriceDisplay && this.data.fairPrice) {
                fairPriceDisplay.textContent = this.data.fairPrice.toLocaleString();
            }

            console.log('[Wizard] Questionnaire data captured:', {
                insuranceStatus: this.data.insuranceStatus,
                financialSituation: this.data.financialSituation,
                previousActions: this.data.previousActions,
                communicationPreference: this.data.communicationPreference,
                urgency: this.data.urgency,
                providerRelationship: this.data.providerRelationship,
                additionalNotes: this.data.additionalNotes
            });
        },

        /**
         * Analyze bill
         */
        async analyzeBill() {
            // Show loading
            const loadingState = document.getElementById('loadingState');
            const resultsState = document.getElementById('resultsState');

            if (loadingState) loadingState.style.display = 'block';
            if (resultsState) resultsState.classList.remove('show');

            // Simulate API call to pricing database
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Calculate fair price (mock - will be replaced by API in Phase 4)
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
            if (loadingState) loadingState.style.display = 'none';
            if (resultsState) resultsState.classList.add('show');
        },

        /**
         * Display analysis results
         */
        displayResults() {
            const verdictCard = document.getElementById('verdictCard');
            const comparisonBody = document.getElementById('comparisonBody');

            // Verdict card
            if (verdictCard) {
                if (this.data.verdict === 'overcharged') {
                    verdictCard.className = 'verdict-card overcharged';
                    verdictCard.innerHTML = `
                        <div class="verdict-icon">
                            <i class="fas fa-triangle-exclamation"></i>
                        </div>
                        <h2>You're Being Overcharged</h2>
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
                        <p>You were charged within the normal range for this procedure.</p>
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
                        <p>You got an excellent price for this procedure.</p>
                        <div class="savings-amount">
                            You saved money!
                        </div>
                    `;
                }
            }

            // Comparison table
            if (comparisonBody) {
                comparisonBody.innerHTML = `
                    <tr>
                        <td><strong>What You Were Charged</strong></td>
                        <td><span class="price-charged">$${this.data.chargedAmount.toLocaleString()}</span></td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td>Fair Price (Median Negotiated Rate)</td>
                        <td><span class="price-fair">$${this.data.fairPrice.toLocaleString()}</span></td>
                        <td style="color: var(--success-green); font-weight: 600;">
                            $${this.data.savings.toLocaleString()} potential savings
                        </td>
                    </tr>
                    <tr>
                        <td>Medicare Rate (Government Benchmark)</td>
                        <td>$${this.data.medicareRate.toLocaleString()}</td>
                        <td>—</td>
                    </tr>
                `;
            }
        },

        /**
         * Download report
         */
        downloadReport() {
            const report = {
                generatedAt: new Date().toISOString(),
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
                        url: `https://www.aapc.com/codes/cpt-codes/${this.data.procedureCode?.replace('CPT ', '')}`,
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

            alert('Your report has been downloaded!');
        },

        /**
         * Generate negotiation script using OpenAI API with failsafe fallback
         */
        async generateNegotiationScript() {
            const apiKey = localStorage.getItem('openai_api_key');

            // If API key exists, try OpenAI
            if (apiKey) {
                try {
                    // Build context from questionnaire
                    let contextSection = '';
                    if (this.data.insuranceStatus || this.data.financialSituation || this.data.urgency) {
                        contextSection = '\nPatient Context:\n';
                        if (this.data.insuranceStatus) contextSection += `- Insurance: ${this.data.insuranceStatus}\n`;
                        if (this.data.financialSituation) contextSection += `- Financial situation: ${this.data.financialSituation}\n`;
                        if (this.data.urgency) contextSection += `- Urgency: ${this.data.urgency}\n`;
                        if (this.data.previousActions && this.data.previousActions.length > 0) {
                            contextSection += `- Previous actions: ${this.data.previousActions.join(', ')}\n`;
                        }
                        if (this.data.providerRelationship) contextSection += `- Provider relationship: ${this.data.providerRelationship}\n`;
                        if (this.data.communicationPreference) contextSection += `- Preferred method: ${this.data.communicationPreference}\n`;
                        if (this.data.additionalNotes) contextSection += `- Additional notes: ${this.data.additionalNotes}\n`;
                    }

                    const prompt = `You are a patient advocate helping someone dispute an overcharged medical bill. Generate a strongly worded but professional negotiation script customized to their specific situation.

Bill Details:
- Procedure: ${this.data.procedure} (${this.data.procedureCode})
- Amount Charged: $${this.data.chargedAmount?.toLocaleString()}
- Fair Price (Median Negotiated Rate): $${this.data.fairPrice?.toLocaleString()}
- Medicare Rate: $${this.data.medicareRate?.toLocaleString()}
- Overcharge Amount: $${this.data.savings?.toLocaleString()} (${this.data.percentageOver}% over fair price)
- Provider: ${this.data.provider}
- Date of Service: ${this.data.dateOfService}
${contextSection}
Create a script with:
1. Opening statement identifying yourself
2. Specific reference to the overcharge with exact numbers
3. Citation of fair market rates and Medicare rates
4. Firm but professional demand for adjustment (tailored to their financial situation)
5. Reference to transparency laws and regulations
6. Clear next steps if they refuse (adjusted for urgency level)
7. Professional closing

IMPORTANT: Tailor the tone and strategy based on the patient context above. For example:
- If they're in collections or facing legal action, emphasize urgency and escalation paths
- If they need payment plans, include language about financial assistance programs
- If they're uninsured, emphasize discriminatory pricing laws
- If this is a regular patient, balance assertiveness with maintaining the relationship
- Match the communication format to their preference (phone, letter, email, etc.)

Make it assertive, data-driven, and legally sound. Use specific numbers from the bill details.`;

                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4',
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are an expert patient advocate and medical billing specialist. Generate professional, assertive negotiation scripts that cite specific regulations and market data.'
                                },
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            temperature: 0.7,
                            max_tokens: 1500
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return data.choices[0].message.content;
                    } else {
                        console.warn('OpenAI API failed, using fallback template');
                        return this.getFailsafeNegotiationScript();
                    }
                } catch (error) {
                    console.warn('OpenAI API error, using fallback template:', error);
                    return this.getFailsafeNegotiationScript();
                }
            }

            // Fallback: Use template
            return this.getFailsafeNegotiationScript();
        },

        /**
         * Failsafe strongly worded negotiation script template
         */
        getFailsafeNegotiationScript() {
            return `MEDICAL BILL NEGOTIATION SCRIPT
=================================

CALLER INFORMATION:
Patient Name: [Your Name]
Date of Service: ${this.data.dateOfService || '[Date]'}
Account Number: [From your bill]
Procedure: ${this.data.procedure || '[Procedure]'}
Procedure Code: ${this.data.procedureCode || '[CPT Code]'}

---

OPENING STATEMENT:

"Good [morning/afternoon]. My name is [Your Name], and I'm calling regarding an overcharged medical bill for services rendered on ${this.data.dateOfService || '[Date]'}. My account number is [Account Number]. I need to speak with someone in billing who has the authority to adjust charges.

[Wait for transfer to appropriate person]

I am calling to formally dispute the charges on my account and demand an immediate adjustment to fair market rates."

---

STATEMENT OF FACTS:

"I received a bill for ${this.data.procedure || '[Procedure]'} (CPT Code: ${this.data.procedureCode || '[Code]'}) in the amount of $${this.data.chargedAmount?.toLocaleString() || '[Amount]'}.

I have conducted a thorough analysis of fair market pricing for this exact procedure in my geographic area, and I have determined that your facility has overcharged me by $${this.data.savings?.toLocaleString() || '[Savings]'} - that is ${this.data.percentageOver || '[X]'}% above the median negotiated rate that insurance companies pay for this identical service.

The data is clear and indisputable:
• Your Charge: $${this.data.chargedAmount?.toLocaleString() || '[Charged]'}
• Fair Market Rate (Median Negotiated): $${this.data.fairPrice?.toLocaleString() || '[Fair]'}
• Medicare Rate (Government Benchmark): $${this.data.medicareRate?.toLocaleString() || '[Medicare]'}
• Overcharge Amount: $${this.data.savings?.toLocaleString() || '[Savings]'}"

---

LEGAL AND REGULATORY CITATIONS:

"Under the No Surprises Act and federal price transparency requirements, hospitals are required to publish their negotiated rates with insurance companies. This data clearly shows that ${this.data.provider || 'your facility'} routinely accepts $${this.data.fairPrice?.toLocaleString() || '[Fair Price]'} for this exact procedure from insurance companies.

Charging me - an individual patient - ${this.data.percentageOver || '[X]'}% more than what you accept from insurance companies is:
1. Discriminatory pricing under federal law
2. A violation of fair billing practices
3. Potentially fraudulent under healthcare billing regulations
4. Unconscionable under state consumer protection statutes"

---

DEMAND FOR ADJUSTMENT:

"I am formally demanding that you adjust my bill from $${this.data.chargedAmount?.toLocaleString() || '[Charged]'} to $${this.data.fairPrice?.toLocaleString() || '[Fair]'} - the median rate your facility accepts from insurance companies for this identical service.

This is not a request - this is a demand based on documented market rates and federal transparency data.

I am prepared to pay $${this.data.fairPrice?.toLocaleString() || '[Fair]'} immediately upon receiving an adjusted bill. However, I will NOT pay the inflated amount of $${this.data.chargedAmount?.toLocaleString() || '[Charged]'}."

---

CONSEQUENCES OF REFUSAL:

"If you refuse to adjust this bill to fair market rates, I will take the following actions:

1. File a formal complaint with the Centers for Medicare & Medicaid Services (CMS) for price transparency violations
2. Report this to my state Attorney General's office for consumer protection investigation
3. File a complaint with the Department of Health and Human Services Office of Inspector General
4. Dispute this charge with all three credit bureaus as fraudulent
5. Post a detailed review on healthcare rating websites warning other patients about predatory billing practices
6. Contact local media consumer protection reporters about billing fraud

Additionally, I will ONLY pay what insurance companies pay - $${this.data.fairPrice?.toLocaleString() || '[Fair]'}. Any collection attempts for amounts above fair market value will be disputed as fraudulent charges."

---

REQUESTED RESOLUTION:

"I am requesting the following immediate actions:

1. Adjust my bill from $${this.data.chargedAmount?.toLocaleString() || '[Charged]'} to $${this.data.fairPrice?.toLocaleString() || '[Fair]'} within 5 business days
2. Send me a revised itemized statement showing the adjustment
3. Provide written confirmation that no collection activity will occur during the review period
4. Confirm in writing that the adjusted amount of $${this.data.fairPrice?.toLocaleString() || '[Fair]'} represents payment in full

Once I receive the adjusted bill, I will remit payment immediately."

---

PROFESSIONAL CLOSING:

"I want to be clear: I am willing and able to pay for the medical services I received. However, I will only pay what is fair and what you accept from insurance companies.

I understand you need to review this with a supervisor. I will wait on hold, or you may call me back within 24 hours at [Your Phone Number].

Please provide me with:
• Your full name and employee ID
• A reference number for this call
• The name and direct phone number of your supervisor
• A timeline for resolution

Thank you for your time. I expect a fair resolution to this matter."

---

FOLLOW-UP NOTES:

Document everything:
□ Date and time of call
□ Name of representative
□ Reference number
□ Promised resolution timeline
□ Next steps

If no resolution within 5 business days, escalate to:
□ Hospital Patient Advocate
□ Hospital Compliance Officer
□ State Attorney General
□ CMS Complaint Portal

---

PAYMENT AUTHORITY:

You are authorized to pay: $${this.data.fairPrice?.toLocaleString() || '[Fair Price]'}
You are NOT authorized to pay: $${this.data.chargedAmount?.toLocaleString() || '[Charged Amount]'}

Stand firm. The data supports your position.

---

Generated: ${new Date().toLocaleDateString()}
Procedure: ${this.data.procedure || '[Procedure]'}
Fair Market Rate: $${this.data.fairPrice?.toLocaleString() || '[Fair]'}
Overcharge: $${this.data.savings?.toLocaleString() || '[Savings]'} (${this.data.percentageOver || '[X]'}% over)

This is a STRONGLY WORDED but PROFESSIONAL dispute. Use it with confidence.
The law and the data are on your side.`;
        },

        /**
         * Download negotiation script
         */
        async downloadNegotiationScript() {
            // Show loading state
            const button = event.target.closest('button');
            const originalHTML = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Script...';

            try {
                // Generate script (with OpenAI or fallback)
                const script = await this.generateNegotiationScript();

                // Create text file
                const blob = new Blob([script], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);

                // Download
                const a = document.createElement('a');
                a.href = url;
                a.download = `negotiation-script-${this.data.procedureCode?.replace(/\s+/g, '-') || 'bill'}-${Date.now()}.txt`;
                a.click();

                URL.revokeObjectURL(url);

                // Success message
                button.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);

            } catch (error) {
                console.error('Script generation error:', error);
                alert('Error generating script. Please try again.');
                button.innerHTML = originalHTML;
                button.disabled = false;
            }
        },

        /**
         * Open API key modal
         */
        openAPIKeyModal() {
            const modal = document.getElementById('apiKeyModal');
            const input = document.getElementById('apiKeyInput');

            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                // Load existing key if present (show first 10 chars only)
                const existingKey = localStorage.getItem('openai_api_key');
                if (existingKey && input) {
                    input.value = existingKey;
                    input.select();
                }
            }
        },

        /**
         * Close API key modal
         */
        closeAPIKeyModal() {
            const modal = document.getElementById('apiKeyModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        },

        /**
         * Save API key to localStorage
         */
        saveAPIKey() {
            const input = document.getElementById('apiKeyInput');
            const apiKey = input?.value.trim();

            if (!apiKey) {
                alert('Please enter an API key');
                return;
            }

            // Validate format (basic check)
            if (!apiKey.startsWith('sk-')) {
                alert('Invalid API key format. OpenAI keys start with "sk-"');
                return;
            }

            // Save to localStorage
            localStorage.setItem('openai_api_key', apiKey);

            // Update status indicator
            this.updateAPIKeyStatus();

            // Close modal
            this.closeAPIKeyModal();

            // Success message
            alert('API key saved! Your negotiation scripts will now be AI-enhanced.');
        },

        /**
         * Remove API key from localStorage
         */
        removeAPIKey() {
            if (confirm('Are you sure you want to remove your OpenAI API key? Scripts will use the standard template.')) {
                localStorage.removeItem('openai_api_key');

                // Clear input
                const input = document.getElementById('apiKeyInput');
                if (input) {
                    input.value = '';
                }

                // Update status indicator
                this.updateAPIKeyStatus();

                // Close modal
                this.closeAPIKeyModal();

                alert('API key removed. Scripts will use the standard template.');
            }
        },

        /**
         * Update API key status indicator
         */
        updateAPIKeyStatus() {
            const statusEl = document.getElementById('apiKeyStatus');
            const apiKey = localStorage.getItem('openai_api_key');

            if (statusEl) {
                if (apiKey) {
                    statusEl.innerHTML = '✓ OpenAI Key Active (Click to Update)';
                    statusEl.style.color = 'var(--success-green)';
                } else {
                    statusEl.innerHTML = 'Add OpenAI Key for Enhanced Scripts';
                    statusEl.style.color = 'var(--payerset-blue)';
                }
            }
        },

        /**
         * Reset wizard
         */
        reset() {
            // Reset data
            this.data = {
                file: null,
                fileUrl: null,
                ocrText: null,
                procedure: null,
                procedureCode: null,
                chargedAmount: null,
                provider: null,
                providerNPI: null,
                dateOfService: null,
                zipCode: null,
                fairPrice: null,
                medicareRate: null,
                savings: null,
                percentageOver: null,
                verdict: null,
                insuranceStatus: null,
                financialSituation: null,
                previousActions: [],
                communicationPreference: null,
                urgency: null,
                providerRelationship: null,
                additionalNotes: null
            };

            // Reset to step 1
            this.currentStep = 1;

            // Hide all steps
            for (let i = 1; i <= this.totalSteps; i++) {
                const stepEl = document.getElementById(`step-${i}`);
                if (stepEl) {
                    stepEl.classList.remove('active');
                }
            }

            // Show step 1
            const step1 = document.getElementById('step-1');
            if (step1) {
                step1.classList.add('active');
            }

            // Reset upload zone
            const uploadZone = document.getElementById('uploadZone');
            if (uploadZone) {
                uploadZone.innerHTML = `
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>Drag your bill here</h3>
                    <p>or click to browse</p>
                    <span class="upload-hint">Supports: PDF, JPG, PNG (max 10MB)</span>
                    <input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" hidden>
                `;

                // Re-setup event listeners
                this.setupEventListeners();
            }

            // Update progress
            this.updateProgress();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Initialize wizard when DOM is ready
     */
    function initWizard() {
        wizard.init();
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWizard);
    } else {
        initWizard();
    }

    // Export to window for use in HTML onclick handlers
    window.wizard = wizard;

})();
