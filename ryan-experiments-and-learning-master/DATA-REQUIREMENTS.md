# Data Requirements for Healthcare Transparency Platform

**Date:** November 21, 2024
**Purpose:** Comprehensive guide to data needed for full product functionality
**Status:** Requirements gathering

---

## Executive Summary

To transform this from a prototype with mock data into a production-ready healthcare transparency platform, we need to integrate real-world pricing data, regulatory information, provider details, and success metrics. This document outlines all required data sources, their structure, usage, and acquisition methods.

---

## 1. CPT Code Database

### What It Is
Current Procedural Terminology (CPT) codes are standardized medical procedure codes maintained by the American Medical Association (AMA).

### Why We Need It
- Validate procedure codes from bills
- Match procedures to pricing data
- Display procedure descriptions
- Link to official documentation

### Data Structure
```json
{
  "code": "70553",
  "shortDescription": "MRI brain w/o & w/dye",
  "longDescription": "Magnetic resonance imaging, brain, including brain stem; without contrast material, followed by contrast material(s) and further sequences",
  "category": "Radiology",
  "subcategory": "Diagnostic Imaging",
  "rvuWork": 2.51,
  "rvuPracticeExpense": 25.88,
  "rvuMalpractice": 2.01,
  "totalRVU": 30.40,
  "nationalAverage": 425.00,
  "priceRange": {
    "min": 280,
    "max": 3500,
    "median": 425,
    "p25": 350,
    "p75": 550
  },
  "relatedCodes": ["70551", "70552"],
  "modifiers": ["26", "TC"],
  "amaUrl": "https://www.ama-assn.org/...",
  "cmsUrl": "https://www.cms.gov/..."
}
```

### Acquisition Methods
**Option 1: Purchase from AMA** ($400-$1,500/year)
- Official source
- Annual updates
- Full descriptions
- Legal usage rights

**Option 2: CMS Public Files** (Free)
- Medicare Physician Fee Schedule
- Limited descriptions
- No AMA copyright issues
- Update quarterly

**Option 3: Open Datasets** (Free)
- NPIRegistry.org
- Data.CMS.gov
- Incomplete but usable

**Recommendation:** Start with CMS public files, upgrade to AMA license as product scales.

---

## 2. Hospital Price Transparency Data

### What It Is
Under federal law (Hospital Price Transparency Rule, effective Jan 2021), all US hospitals must publish machine-readable files with negotiated rates.

### Why We Need It
- Real negotiated rates by insurance company
- Provider-specific pricing
- Geographic variations
- Evidence for negotiation scripts

### Data Structure
```json
{
  "hospital": {
    "name": "Central Hospital",
    "npi": "1234567890",
    "address": "123 Medical Dr, City, ST 12345",
    "ein": "12-3456789",
    "updated": "2024-11-01"
  },
  "rates": [
    {
      "code": "70553",
      "description": "MRI BRAIN W/O & W/DYE",
      "payer": "Blue Cross Blue Shield",
      "plan": "PPO Standard",
      "negotiatedRate": 425,
      "chargemaster": 2800,
      "discountPercent": 84.8,
      "effectiveDate": "2024-01-01"
    },
    {
      "code": "70553",
      "payer": "Aetna",
      "plan": "HMO Gold",
      "negotiatedRate": 398,
      "chargemaster": 2800,
      "discountPercent": 85.8
    }
  ]
}
```

### Acquisition Methods
**Method 1: Direct Hospital Scraping**
- Visit each hospital's website
- Find price transparency link (usually in footer)
- Download JSON/CSV files
- Parse and normalize data
- **Challenges:** Each hospital formats differently, files are huge (1-50GB), many hospitals non-compliant

**Method 2: Third-Party Aggregators**
- Turquoise Health API
- Dolbey Price Transparency API
- PatientRightsAdvocate.org dataset
- **Cost:** $500-$5,000/month depending on usage

**Method 3: CMS Enforcement Data**
- CMS maintains list of compliant hospitals
- Can scrape from CMS website
- **Limitation:** Not all hospitals compliant

**Recommendation:** Start with top 100 hospitals by volume, use Turquoise Health API for aggregated data ($500/mo starter plan).

---

## 3. Medicare/Medicaid Fee Schedules

### What It Is
Government-set payment rates for medical procedures under Medicare and Medicaid programs.

### Why We Need It
- Benchmark pricing
- Legal reference point (hospitals can't charge uninsured patients more than Medicare + reasonable markup)
- Validate "fair price" calculations

### Data Structure
```json
{
  "year": 2024,
  "code": "70553",
  "locality": "01 (Manhattan, NY)",
  "facilityRate": 380.12,
  "nonFacilityRate": 425.67,
  "conversionFactor": 33.2875,
  "geographicPractice": 1.114,
  "componentBreakdown": {
    "work": 83.52,
    "practiceExpense": 261.18,
    "malpractice": 35.42
  },
  "effectiveDate": "2024-01-01"
}
```

### Acquisition Methods
**Option 1: CMS Public Files** (Free, Official)
- Download from CMS.gov
- Quarterly updates
- CSV format
- API available via Data.CMS.gov

**Option 2: Pre-processed APIs**
- Fair Health Consumer
- Healthcare Bluebook API
- **Cost:** Free tier available, $200-$1,000/mo for commercial

**Recommendation:** Use CMS public files (free), update quarterly. Direct download from: https://www.cms.gov/medicare/physician-fee-schedule/search

---

## 4. Geographic Pricing Variations

### What It Is
Medical costs vary significantly by region due to cost of living, competition, and market dynamics.

### Why We Need It
- Accurate local pricing
- Compare patient's bill to regional averages
- Adjust negotiation strategies by market

### Data Structure
```json
{
  "zipCode": "10001",
  "msaCode": "35620",
  "msaName": "New York-Newark-Jersey City, NY-NJ-PA",
  "state": "NY",
  "costIndex": 1.23,
  "procedures": {
    "70553": {
      "median": 525,
      "mean": 612,
      "min": 350,
      "max": 4200,
      "sampleSize": 1247,
      "providers": [
        {
          "name": "NYU Langone",
          "npi": "1234567890",
          "avg": 485,
          "volume": 245
        }
      ]
    }
  }
}
```

### Acquisition Methods
**Option 1: FAIR Health Database**
- Largest claims database in US
- ZIP code level pricing
- Insurance and uninsured rates
- **Cost:** $1,000-$10,000/month

**Option 2: CMS Geographic Adjustment Files**
- Geographic Practice Cost Indices (GPCI)
- Free from CMS
- Updated annually
- **Limitation:** Only adjustment factors, not actual prices

**Option 3: Aggregated Hospital Data**
- Compile from hospital price transparency files
- Calculate regional medians
- **Challenge:** Data processing intensive

**Recommendation:** Start with CMS GPCI for cost adjustments, upgrade to FAIR Health as product scales.

---

## 5. Provider-Specific Data

### What It Is
Information about healthcare providers, hospitals, and practice groups.

### Why We Need It
- Validate NPI numbers
- Display provider details
- Link to reviews
- Check compliance history

### Data Structure
```json
{
  "npi": "1234567890",
  "type": "Organization",
  "name": "Central Hospital",
  "legalName": "Central Healthcare System Inc.",
  "address": {
    "street": "123 Medical Drive",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  },
  "phone": "(555) 123-4567",
  "fax": "(555) 123-4568",
  "taxonomy": "282N00000X (General Acute Care Hospital)",
  "medicareEnrolled": true,
  "medicaidEnrolled": true,
  "ein": "12-3456789",
  "ownership": "Non-Profit",
  "bedCount": 450,
  "traumaLevel": "Level II",
  "ratings": {
    "cms": 3,
    "leapfrog": "B",
    "healthgrades": 4.2
  },
  "priceTransparencyUrl": "https://centralhospital.com/pricing",
  "financialAssistanceUrl": "https://centralhospital.com/charity-care",
  "billingPhone": "(555) 123-4500",
  "complianceHistory": {
    "cmsPenalties": [],
    "priceTransparencyCompliant": true,
    "lastInspection": "2024-05-15"
  }
}
```

### Acquisition Methods
**Option 1: NPPES NPI Registry** (Free, Official)
- Download full database
- 7+ million providers
- Updated monthly
- API available

**Option 2: CMS Hospital Compare** (Free)
- Quality ratings
- Patient satisfaction scores
- Safety metrics

**Option 3: Commercial Provider Databases**
- Definitive Healthcare
- MD.com
- **Cost:** $5,000-$50,000/year

**Recommendation:** Use free NPPES database, supplement with CMS Hospital Compare. Download from: https://download.cms.gov/nppes/NPI_Files.html

---

## 6. Insurance Company Data

### What It Is
Information about insurance payers, their plans, and typical reimbursement rates.

### Why We Need It
- Determine if insurance should have covered procedure
- Reference typical coverage rates
- Generate appeals for denied claims

### Data Structure
```json
{
  "payerName": "Blue Cross Blue Shield of Illinois",
  "payerId": "BCBS-IL",
  "parentCompany": "Health Care Service Corporation",
  "phone": "1-800-xxx-xxxx",
  "website": "https://www.bcbsil.com",
  "coverageArea": ["IL", "TX", "MT", "NM", "OK"],
  "planTypes": ["HMO", "PPO", "EPO", "POS"],
  "averageReimbursement": {
    "70553": {
      "inNetwork": 425,
      "outOfNetwork": 520
    }
  },
  "denialReasons": [
    "Not medically necessary",
    "Prior authorization required",
    "Out of network"
  ],
  "appealProcess": {
    "firstLevel": "Internal review",
    "timeframe": "30 days",
    "url": "https://www.bcbsil.com/appeals"
  }
}
```

### Acquisition Methods
**Option 1: Transparency in Coverage Files** (Free, New 2023 Law)
- Insurance companies must publish negotiated rates
- Machine-readable JSON files
- Similar to hospital transparency data
- **Challenge:** Massive files (100GB+), inconsistent formats

**Option 2: Claims Databases**
- FAIR Health
- Milliman MedInsight
- **Cost:** $10,000+/year

**Option 3: Manual Compilation**
- Build from user submissions
- Crowdsource data
- Verify through transparency files

**Recommendation:** Start with manual compilation, gradually process TiC files for major insurers.

---

## 7. State-Specific Regulations

### What It Is
Healthcare billing laws vary by state. Some states have stronger patient protections.

### Why We Need It
- Tailor negotiation scripts to state laws
- Reference specific statutes
- Escalation paths by state

### Data Structure
```json
{
  "state": "NY",
  "stateName": "New York",
  "laws": [
    {
      "name": "New York Surprise Bill Law",
      "code": "Financial Services Law § 606",
      "summary": "Prohibits balance billing for emergency services and certain in-network facility services",
      "effectiveDate": "2015-03-31",
      "coverage": "Emergency services, in-network facility services",
      "protections": [
        "Balance billing prohibited",
        "Independent dispute resolution available",
        "Maximum patient responsibility = in-network cost sharing"
      ],
      "url": "https://www.dfs.ny.gov/consumers/health_insurance/surprise_medical_bills"
    }
  ],
  "regulatoryAgencies": [
    {
      "name": "New York State Department of Financial Services",
      "complainUrl": "https://www.dfs.ny.gov/complaint",
      "phone": "1-800-342-3736"
    }
  ],
  "statutes": {
    "priceTransparency": true,
    "charityCareMandatory": true,
    "charityThreshold": "400% FPL",
    "balanceBillingProhibited": true,
    "medicalDebtProtections": [
      "Cannot report to credit bureau within 180 days",
      "3-year lookback for charity care eligibility"
    ]
  }
}
```

### Acquisition Methods
**Method 1: Manual Legal Research**
- Review state statutes
- Consult healthcare attorneys
- Ongoing monitoring
- **Time:** 50+ hours per state

**Method 2: Commercial Legal Databases**
- Lexis Nexis
- Westlaw
- **Cost:** $5,000-$20,000/year

**Method 3: Patient Advocacy Groups**
- Dollar For
- Community Catalyst
- Patient Rights Advocate
- Often publish state guides

**Recommendation:** Start with top 10 states by population, use patient advocacy group resources.

---

## 8. Financial Assistance Programs

### What It Is
Most hospitals are required to offer charity care and financial assistance. Programs vary by hospital.

### Why We Need It
- Help patients who can't afford bills
- Reference specific hospital programs
- Calculate eligibility

### Data Structure
```json
{
  "hospital": "Central Hospital",
  "npi": "1234567890",
  "program": {
    "name": "Financial Assistance Program",
    "type": "Charity Care",
    "eligibility": [
      {
        "incomeThreshold": "200% FPL",
        "discount": 100,
        "description": "Free care"
      },
      {
        "incomeThreshold": "200-400% FPL",
        "discount": 80,
        "description": "80% discount"
      },
      {
        "incomeThreshold": "400-600% FPL",
        "discount": 50,
        "description": "50% discount"
      }
    ],
    "applicationProcess": {
      "url": "https://centralhospital.com/charity-care",
      "forms": ["FAP Application", "Proof of income"],
      "submitTo": "Financial Counseling Dept",
      "phone": "(555) 123-4567",
      "email": "financialaid@centralhospital.com",
      "turnaroundTime": "30 days"
    },
    "fplGuidelines": {
      "year": 2024,
      "1person": 15060,
      "2person": 20440,
      "3person": 25820,
      "4person": 31200
    }
  }
}
```

### Acquisition Methods
**Method 1: Hospital Websites**
- Required by IRS for non-profits
- Usually under "Billing" or "Financial Assistance"
- PDF or web pages

**Method 2: Dollar For Database**
- Aggregates charity care policies
- Free public database
- dollarfor.org

**Method 3: State Hospital Associations**
- Publish guidelines
- Advocacy resources

**Recommendation:** Integrate Dollar For database, scrape additional hospitals as needed.

---

## 9. Success Rate & Outcome Tracking

### What It Is
Track which negotiation strategies work, what savings patients achieve, and continuously improve recommendations.

### Why We Need It
- Improve negotiation scripts
- A/B test strategies
- Show ROI to users
- Build case studies

### Data Structure
```json
{
  "negotiationId": "abc123",
  "patientId": "anon-xyz789",
  "timestamp": "2024-11-21T10:30:00Z",
  "bill": {
    "procedureCode": "70553",
    "originalAmount": 2800,
    "fairPrice": 425,
    "overcharge": 2375,
    "overchargePercent": 559
  },
  "patient": {
    "state": "NY",
    "insuranceStatus": "uninsured",
    "financialSituation": "financial_hardship"
  },
  "actions": [
    {
      "date": "2024-11-21",
      "action": "downloaded_script",
      "method": "phone"
    },
    {
      "date": "2024-11-22",
      "action": "called_billing",
      "duration": 15,
      "outcome": "transferred_to_supervisor"
    },
    {
      "date": "2024-11-25",
      "action": "follow_up_call",
      "outcome": "offered_payment_plan"
    }
  ],
  "finalOutcome": {
    "resolved": true,
    "finalAmount": 500,
    "savingsAchieved": 2300,
    "savingsPercent": 82,
    "timeToResolution": 4,
    "satisfactionScore": 5,
    "wouldRecommend": true
  }
}
```

### Acquisition Methods
**Method 1: User Self-Reporting**
- Survey after download
- Follow-up emails
- Incentivize with rewards

**Method 2: Integration with Action Tracking**
- In-app progress tracker
- Check-ins at each step
- Automated reminders

**Method 3: Anonymous Analytics**
- Track downloads, outcomes
- Aggregate by procedure, state
- Privacy-preserving

**Recommendation:** Build optional outcome reporting into product, incentivize with charitable donation for each report.

---

## 10. Legal Precedents & Case Law

### What It Is
Court cases and regulatory actions related to medical billing disputes.

### Why We Need It
- Strengthen negotiation arguments
- Reference successful cases
- Warn about legal risks

### Data Structure
```json
{
  "caseId": "2023-cv-12345",
  "caseName": "Patient v. Hospital",
  "court": "NY Supreme Court",
  "year": 2023,
  "summary": "Court ruled hospital must accept Medicare rates for uninsured patient",
  "outcome": "Plaintiff victory",
  "relevantLaw": "NY Financial Services Law § 606",
  "keyFinding": "Charging uninsured patients 600% above Medicare rates deemed unconscionable",
  "citation": "123 N.Y.S.2d 456 (2023)",
  "applicableStates": ["NY"],
  "applicableSituations": ["uninsured", "price_gouging"],
  "url": "https://caselaw.findlaw.com/..."
}
```

### Acquisition Methods
**Method 1: Legal Research Services**
- Westlaw
- Lexis Nexis
- **Cost:** $5,000+/year

**Method 2: Patient Advocacy Groups**
- Track major cases
- Publish summaries
- Often free

**Method 3: Public Court Records**
- PACER (federal cases)
- State court websites
- **Cost:** $0.10/page

**Recommendation:** Partner with healthcare law clinic, have law students research and summarize cases.

---

## 11. Template Documents

### What It Is
Pre-written letters, scripts, and forms for common medical billing situations.

### Why We Need It
- Users need ready-to-send documents
- Multiple communication formats
- Legally sound language

### Document Types Needed

#### A. Negotiation Phone Script
- Already built (OpenAI + failsafe)
- Need variants:
  - Insured vs uninsured
  - Collections vs. fresh bill
  - Payment plan vs. full discount
  - Email version
  - Letter version

#### B. Itemized Bill Request Letter
```markdown
[Date]
[Your Name]
[Address]

Billing Department
[Hospital Name]
[Address]

Re: Request for Itemized Bill - Account #[XXX]

Dear Billing Department:

I am writing to formally request an itemized bill for services
rendered on [DATE]. Under federal law (Affordable Care Act § 2718(b)),
I have the right to receive a detailed breakdown of all charges.

Please provide:
1. Complete itemized list of all services, procedures, medications
2. Corresponding CPT/HCPCS codes
3. Unit prices and quantities
4. Date and time of each service

I expect this within 10 business days as required by law.

Sincerely,
[Signature]
```

#### C. Dispute Letter
#### D. Financial Assistance Application Letter
#### E. Insurance Appeal Letter
#### F. Credit Bureau Dispute Letter
#### G. Attorney General Complaint
#### H. CMS Complaint Form

### Recommendation
Build library of 15-20 templates, make them dynamically populated with bill data.

---

## 12. Provider Reviews & Ratings

### What It Is
Crowdsourced feedback about providers' billing practices and negotiation outcomes.

### Why We Need It
- Warn others about price gouging
- Identify provider-friendly hospitals
- Build community

### Data Structure
```json
{
  "reviewId": "rev-123",
  "provider": {
    "npi": "1234567890",
    "name": "Central Hospital"
  },
  "date": "2024-11-20",
  "reviewer": "anon-abc",
  "procedure": "70553",
  "experience": {
    "chargedAmount": 2800,
    "negotiatedAmount": 500,
    "savingsPercent": 82,
    "timeToResolve": 7,
    "difficulty": "moderate",
    "willingToNegotiate": true,
    "staffHelpfulness": 4,
    "wouldReturn": true
  },
  "tips": "Ask for financial counselor immediately. They have authority to approve discounts up to 80% on the spot.",
  "warnings": "Initial billing rep will say discounts aren't available. Escalate to supervisor.",
  "verified": true,
  "upvotes": 47
}
```

### Implementation
- Already have `/2025-11/provider-reviews.html` page
- Need backend to store reviews
- Moderation system
- Verification (require proof of bill?)

---

## 13. OCR Training Data

### What It Is
Sample medical bills for training OCR models to extract data accurately.

### Why We Need It
- Improve OCR accuracy (Phase 3)
- Handle various bill formats
- Reduce manual data entry

### Data Needed
- 1,000+ sample bills (anonymized)
- Labeled with correct extractions
- Various formats (PDF, image, scan)
- Different hospitals/providers

### Acquisition Methods
**Method 1: User Submissions**
- Offer incentive for uploading bills
- Anonymize automatically
- Manual labeling

**Method 2: Synthetic Generation**
- Create fake bills based on real templates
- Faster, no privacy issues
- Less realistic

**Method 3: Purchase Datasets**
- Medical AI companies
- **Cost:** $5,000-$50,000

**Recommendation:** Incentivize user uploads ($10 Amazon gift card per labeled bill), supplement with synthetic data.

---

## 14. Inflation & Trend Data

### What It Is
Historical pricing trends to show how costs are changing over time.

### Why We Need It
- "Your bill increased 300% faster than inflation"
- Validate price gouging claims
- Forecast future costs

### Data Structure
```json
{
  "code": "70553",
  "priceHistory": [
    {
      "year": 2020,
      "medianPrice": 380,
      "cpi": 258.8
    },
    {
      "year": 2024,
      "medianPrice": 425,
      "cpi": 310.5,
      "inflationAdjusted": 452,
      "realIncrease": -5.9
    }
  ]
}
```

### Acquisition Methods
- Historical CMS fee schedules (free)
- FAIR Health historical data
- BLS CPI data (free)

---

## 15. Payment Plan Calculators

### What It Is
Calculate affordable payment plans based on income and expenses.

### Why We Need It
- Help patients who can't pay full amount
- Generate counter-offers
- Reference federal poverty guidelines

### Data Structure
```json
{
  "calculation": {
    "totalDebt": 2800,
    "targetAmount": 500,
    "income": {
      "monthly": 3000,
      "annual": 36000,
      "fplPercent": 239
    },
    "expenses": {
      "housing": 900,
      "food": 400,
      "utilities": 200,
      "transport": 300,
      "insurance": 150,
      "other": 500,
      "total": 2450
    },
    "disposable": 550,
    "recommended": {
      "monthlyPayment": 50,
      "downPayment": 0,
      "term": 10,
      "totalPaid": 500,
      "interest": 0
    },
    "alternatives": [
      {
        "scenario": "12-month plan",
        "payment": 42,
        "term": 12
      }
    ]
  }
}
```

---

## Data Integration Priority

### Phase 3 (MVP Data - Next 2-3 months)
1. **CPT Code Database** - CMS public files
2. **Medicare Fee Schedules** - CMS.gov
3. **Provider Data** - NPPES NPI Registry
4. **Sample Hospital Transparency Data** - Top 20 hospitals
5. **State Laws** - Top 10 states

**Cost:** $0 (all free sources)
**Time:** 40 hours data engineering

### Phase 4 (Enhanced Data - Months 4-6)
6. **Geographic Pricing** - Fair Health Consumer (free tier)
7. **Financial Assistance Programs** - Dollar For integration
8. **Template Library** - 15 core documents
9. **Success Tracking** - Build analytics pipeline
10. **Provider Reviews** - Launch review system

**Cost:** $500/month (Fair Health)
**Time:** 80 hours development

### Phase 5 (Premium Data - Months 7-12)
11. **Hospital Price Transparency** - Turquoise Health API
12. **Insurance TiC Files** - Major payers
13. **Legal Precedents** - Law school partnership
14. **OCR Training Data** - User submissions
15. **Trend Analysis** - Historical datasets

**Cost:** $1,500/month (APIs + data sources)
**Time:** 120 hours + ongoing

---

## Data Storage & Infrastructure

### Database Design
```
PostgreSQL Main Database:
├── cpt_codes (250k rows)
├── hospitals (6,500 rows)
├── providers (7M rows)
├── rates (100M+ rows) → Time-series DB
├── states (50 rows)
├── regulations (500 rows)
├── templates (20 rows)
├── reviews (growing)
└── user_data (encrypted)

S3 Buckets:
├── price-transparency-files/ (1TB+)
├── ocr-training-data/ (100GB)
└── user-uploads/ (temporary, encrypted)

Redis Cache:
├── frequent-lookups (CPT codes, NPI)
└── rate-limiting

Elasticsearch:
├── full-text search (regulations, templates)
└── provider search
```

### Cost Estimate
- Database hosting: $100/month (AWS RDS)
- Storage: $50/month (S3)
- Cache: $20/month (Redis)
- APIs: $500-$1,500/month
- **Total:** $670-$1,670/month

---

## Legal & Compliance Considerations

### Data Usage Rights
- CMS data: Public domain ✓
- AMA CPT codes: Requires license
- Hospital transparency files: Public but check terms
- FAIR Health: Restricted commercial use
- User data: HIPAA compliance if handling PHI

### Privacy Requirements
- HIPAA if storing health data
- GDPR if EU users
- State privacy laws (CCPA, etc.)
- Anonymize all examples
- Secure data in transit/rest

### Recommended Approach
1. Start with public/free data
2. Anonymize everything
3. Don't store PHI (process client-side)
4. Get legal review before launch

---

## Success Metrics

### Data Quality KPIs
- CPT code coverage: 95%+ of common procedures
- Pricing accuracy: Within 10% of actual negotiated rates
- Provider coverage: Top 500 hospitals
- Geographic coverage: All 50 states
- Update frequency: Quarterly minimum

### User Impact KPIs
- Average savings: $1,000+ per user
- Success rate: 60%+ achieve some reduction
- Time to resolution: <30 days median
- User satisfaction: 4.5+ stars

---

## Roadmap Summary

| Phase | Timeline | Focus | Cost |
|-------|----------|-------|------|
| **Phase 3** | Months 1-3 | Core data (CPT, Medicare, NPI) | $0/mo |
| **Phase 4** | Months 4-6 | Enhanced features | $500/mo |
| **Phase 5** | Months 7-12 | Premium data sources | $1,500/mo |
| **Scale** | Year 2+ | Full national coverage | $5,000/mo |

---

## Immediate Next Steps

1. **Download CMS CPT/Medicare Data** - 4 hours
2. **Set up PostgreSQL database** - 2 hours
3. **Import NPPES NPI Registry** - 8 hours
4. **Scrape 20 hospital transparency files** - 16 hours
5. **Build data ingestion pipeline** - 16 hours

**Total: 46 hours to working MVP data layer**

---

## Conclusion

This platform requires significant data integration work, but most critical data is freely available from CMS and other government sources. The path from prototype to production involves:

1. **Free data first** (Phase 3) - Proves concept
2. **Basic paid APIs** (Phase 4) - Improves accuracy
3. **Premium sources** (Phase 5) - Scales nationally

With this data, the bill analyzer transforms from a compelling demo into a genuinely useful tool that can save patients thousands of dollars and shift power dynamics in medical billing negotiations.
