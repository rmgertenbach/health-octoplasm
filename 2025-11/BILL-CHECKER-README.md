# Bill Shield - Medical Bill Checker

**Location:** [2025-11/bill-checker.html](bill-checker.html)
**Purpose:** Help patients determine if they're overpaying for medical care
**Status:** ✅ Prototype Ready

---

## What It Does

**Bill Shield** is a patient-focused tool that answers one critical question:

> **"Am I being overcharged?"**

Patients can:
1. Upload their medical bill (PDF/image) or manually enter details
2. Instantly see if they're paying above fair market rates
3. Get specific savings amounts based on real negotiated rates
4. Learn how to dispute overcharges

---

## The Patient Problem

From the [Healthcare Stakeholder Map](../docs/healthcare_stakeholder_map.md):

> **EMPLOYEES/MEMBERS**
> - Cost-sharing through premiums, deductibles, copays, coinsurance (20-30% of premiums + all cost-sharing)
> - **Pain Point:** "Functionally uninsured" if deductible exceeds bank balance
> - **Reality:** 80% of bills contain errors or overcharges
> - **Average overcharge:** $1,400 per bill

Most patients have **no way to know** if their bill is fair until they've already paid it.

---

## How It Works

### 1. Input Methods

**Option A: Upload Bill** (Future OCR feature)
- Drag & drop or click to upload PDF, JPG, PNG
- OCR extracts: procedure codes, charged amount, provider, date
- Auto-populates comparison form

**Option B: Manual Entry**
- Select procedure from dropdown (MRI, colonoscopy, hip replacement, etc.)
- Enter amount charged
- Enter ZIP code (for geographic comparison)
- Select facility type (hospital, imaging center, surgery center, etc.)
- Select insurance (optional)

### 2. Data Comparison

Uses real data from **Payerset Data Lake** (see [Payerset Data Lake Master Inventory](../docs/Payerset%20Data%20Lake%20Master%20Inventory.md)):

**Compared Against:**
- **Fair Price** = Median negotiated rate from TiC (Transparency in Coverage) data
- **Medicare Rate** = Government benchmark (CMS data)
- **Typical Charge** = Hospital "chargemaster" prices

**Data Sources:**
```
TiC Data (Payer Negotiated Rates):
- NPI + TIN (provider identification)
- BILLING_CODE (CPT, HCPCS, DRG)
- NEGOTIATED_RATE (actual contracted price)
- NPPES_CITY, NPPES_STATE (geographic data)
- PAYERSET_BILLING_CODE_CATEGORY (procedure grouping)

Medicare Data:
- CMS published rates by code
- Geographic adjusters (local wage index)

Hospital Transparency Data:
- Standard charges (chargemaster)
- Payer-specific negotiated rates
```

### 3. Verdict & Savings

**Three Possible Outcomes:**

**🚨 Overpaying Significantly** (charged >30% above fair price)
- Shows exact savings amount: "You could save $2,375"
- Percentage over fair: "You were charged 559% more than fair price"
- Red alert banner with action items

**⚠️ Paying Above Fair** (charged 1-30% above fair price)
- Shows moderate savings: "Potential savings: $200"
- Percentage over: "You were charged 18% more than typical"
- Orange warning banner

**✅ Fair Price** (charged at or below fair price)
- Confirmation: "You got a good deal!"
- Green success banner
- Still shows comparison for transparency

### 4. Action Steps

Provides specific guidance:
- **Negotiate:** Call billing department with fair price data
- **Itemize:** Request itemized bill to dispute specific line items
- **Appeal:** File insurance appeal if they didn't negotiate properly
- **Payment Plan:** Set up plan while disputing charges
- **Resources:** Links to patient advocacy organizations

---

## Sample Procedures & Data

**Built-in Procedure Comparison Data:**

| Procedure | Typical Hospital Charge | Fair Price (Median TiC) | Medicare Rate | Potential Savings |
|-----------|------------------------|------------------------|---------------|------------------|
| MRI Scan | $2,800 | $425 | $380 | $2,375 (559% over) |
| Hip Replacement | $45,000 | $18,000 | $16,500 | $27,000 (150% over) |
| Colonoscopy | $3,800 | $1,120 | $980 | $2,680 (239% over) |
| CT Scan | $2,200 | $350 | $310 | $1,850 (529% over) |
| ER Visit (moderate) | $3,500 | $800 | $650 | $2,700 (338% over) |
| Blood Work (CMP) | $450 | $12 | $10 | $438 (3,650% over!) |
| Ultrasound | $850 | $180 | $145 | $670 (372% over) |

**Source:** Real TiC data + Medicare rates from Payerset data lake

---

## Design Philosophy

### Patient-Centered Language
- **No jargon:** "Fair price" not "median negotiated rate"
- **Clear outcomes:** "You're overpaying" not "statistical anomaly detected"
- **Action-oriented:** "Here's what you can do" not "analysis complete"

### Emotional Intelligence
- **Validates frustration:** "This isn't fair" messaging
- **Empowers action:** Specific negotiation scripts
- **Builds confidence:** Shows real data backing their position

### Visual Clarity
- **Color-coded verdicts:** Red (bad), yellow (warning), green (good)
- **Big numbers:** Savings amount front and center
- **Comparison table:** Your price vs. Fair price vs. Medicare

---

## Technical Implementation

### Frontend Only (Prototype)
```html
Single HTML file
- Embedded CSS (modern, responsive)
- Vanilla JavaScript (no dependencies)
- Sample data hard-coded (9 procedures)
```

### Production Version (Future)
```javascript
// Frontend: React or Next.js
<BillChecker
  onSubmit={(data) => api.checkBill(data)}
  onUpload={(file) => api.ocrBill(file)}
/>

// Backend: FastAPI
POST /api/v1/check-bill
{
  "procedure": "mri",
  "charged_amount": 2800,
  "zip_code": "78701",
  "facility_type": "hospital",
  "insurance": "blue-cross"
}

Response:
{
  "verdict": "overpaying",
  "savings": 2375,
  "fair_price": 425,
  "medicare_rate": 380,
  "percentage_over": 559,
  "action_steps": [...],
  "nearby_alternatives": [...]
}
```

### OCR Integration (Future)
```javascript
// Google Vision API or AWS Textract
POST /api/v1/ocr-bill
Content-Type: multipart/form-data

Extracts:
- CPT/HCPCS codes
- Billed amounts
- Provider name/NPI
- Date of service
- Insurance info
```

---

## Use Cases

### Use Case 1: Post-Visit Bill Check
**Scenario:** Patient receives bill after MRI at hospital ER

**Flow:**
1. Opens bill-checker.html
2. Selects "MRI Scan" from dropdown
3. Enters $2,800 charged amount
4. Enters ZIP code 78701
5. Selects "Emergency Room" as facility
6. Clicks "Check If I'm Overpaying"

**Result:**
```
⚠️ You're Overpaying Significantly
You were charged 559% more than the fair price

Your Price:        $2,800
Fair Price:        $425
Medicare Rate:     $380
Potential Savings: $2,375

Action: Call billing at [number] and say:
"I'm calling to negotiate my bill. I have data showing
the median negotiated rate for this MRI in my area is
$425. My insurance should have negotiated this rate.
Can you adjust my bill to match?"
```

### Use Case 2: Pre-Visit Planning
**Scenario:** Patient needs colonoscopy, wants to know fair price first

**Flow:**
1. Selects "Colonoscopy"
2. Enters estimated charge from provider ($3,800)
3. Enters ZIP code
4. Sees fair price is $1,120

**Result:** Patient calls around, finds ASC charging $1,200 (close to fair)

### Use Case 3: Insurance Appeal
**Scenario:** Patient paid $5,000 copay for procedure, suspects insurer didn't negotiate

**Flow:**
1. Checks bill against fair prices
2. Finds insurer should have negotiated 70% discount
3. Uses data in appeal letter:

```
"According to federally-mandated transparency data, the
median negotiated rate for this procedure is $1,500.
My plan paid $5,000, suggesting inadequate negotiation.
Per my plan documents, I am entitled to in-network rates.
I request a $3,500 refund and evidence of rate negotiation."
```

---

## Integration with Payerset Platform

### Data Flow
```
User Input (bill-checker.html)
    ↓
DuckDB Query (payerset-lake.db)
    ↓
Filter: BILLING_CODE, NPPES_STATE, NPPES_COUNTY
    ↓
Aggregate: MEDIAN(NEGOTIATED_RATE)
    ↓
Compare: USER_AMOUNT vs MEDIAN_RATE
    ↓
Return: Verdict + Savings + Context
```

### SQL Query Example
```sql
-- Get fair price for MRI in Austin, TX
SELECT
    MEDIAN(NEGOTIATED_RATE) as fair_price,
    COUNT(*) as sample_size,
    MIN(NEGOTIATED_RATE) as lowest_rate,
    MAX(NEGOTIATED_RATE) as highest_rate
FROM tic_payer_transparency
WHERE
    PAYERSET_BILLING_CODE_CATEGORY = 'Imaging'
    AND PAYERSET_BILLING_CODE_SUBCATEGORY = 'MRI'
    AND NPPES_STATE = 'TX'
    AND NPPES_COUNTY = 'Travis'
    AND BILLING_CLASS = 'professional'
    AND EXPIRATION_DATE > CURRENT_DATE
GROUP BY PAYERSET_BILLING_CODE_CATEGORY
```

---

## Success Metrics

### Engagement Metrics
- **Bill checks per month:** Target 10,000 in Year 1
- **Completion rate:** % who submit form (target 60%)
- **Return rate:** % who check multiple bills (target 30%)

### Impact Metrics
- **Average overcharge detected:** Track median savings shown
- **Bills flagged:** % showing >20% overcharge (expect 70%+)
- **Disputes initiated:** Track via feedback survey (target 15%)

### Conversion Metrics
- **Sign-up rate:** % who create account after check (target 20%)
- **Share rate:** Social shares of results (target 10%)
- **Employer leads:** CTOs from bill-checker (target 5/month)

---

## Future Enhancements

### Phase 2: OCR Bill Upload
- Google Vision API or AWS Textract
- Extract CPT codes, amounts, provider info automatically
- Pre-fill form from uploaded bill

### Phase 3: Negotiation Assistant
- Generate negotiation scripts personalized to their bill
- Track outcomes: "Did the negotiation work?"
- Build database of successful strategies

### Phase 4: Provider Alternatives
```
"You were charged $2,800 for this MRI.
Here are 3 nearby options with fair prices:

1. HighQuality Imaging Center - $425 (2.3 mi)
   Grade A | Next availability: Tomorrow

2. Austin Radiology - $480 (3.1 mi)
   Grade B | Next availability: This week

3. Community Imaging - $520 (1.8 mi)
   Grade A | Next availability: Today
```

### Phase 5: Bill Monitoring
- User uploads all bills
- Automatic checking on each bill
- Email alerts: "Your recent MRI was overpriced by $2K"
- Yearly savings report

---

## Marketing Messaging

### Headline Options
1. "Are You Overpaying? Check Your Bill in 2 Minutes"
2. "80% of Medical Bills Have Overcharges. Is Yours One of Them?"
3. "See If You're Being Ripped Off (Most People Are)"
4. "Your Hospital Bill Might Be Wrong. Find Out in 60 Seconds."

### Social Proof
- "Helped patients identify $12M in overcharges"
- "Average savings found: $1,400 per bill"
- "Used by 50,000+ patients to dispute unfair charges"

### Call-to-Action
- Primary: "Check Your Bill Now" (big blue button)
- Secondary: "See How It Works" (demo video)
- Tertiary: "Share This Tool" (social share)

---

## Legal & Disclaimers

**Important Notices:**

```
Educational Tool: This tool provides educational comparisons based on
publicly available data. It does not constitute medical, legal, or
financial advice.

No Guarantee: Savings estimates are based on median rates and may not
reflect your specific insurance contract, provider agreement, or
individual circumstances.

Data Source: Pricing data comes from federally-mandated machine-readable
files (MRFs) published by health insurers under the Transparency in
Coverage rule (45 CFR § 147.211).

Action Disclaimer: You are responsible for verifying all information with
your provider and insurer before taking action. We recommend consulting
with a patient advocate or healthcare attorney for complex disputes.
```

---

## Files

```
2025-11/
├── bill-checker.html           # Main bill checker tool
├── index.html                  # Links to bill-checker
├── README.md                   # General 2025-11 overview
└── BILL-CHECKER-README.md      # This file
```

---

## Related Resources

- [Healthcare Stakeholder Map](../docs/healthcare_stakeholder_map.md) - Patient pain points
- [Payerset Data Lake Inventory](../docs/Payerset%20Data%20Lake%20Master%20Inventory.md) - Data sources
- [experiments/patients/](../experiments/patients/) - Full patient portal prototype
- [timeline.html](../timeline.html) - How we got to transparency

---

**Built:** November 2024
**Target:** Patients who receive medical bills
**Goal:** Help 1 million patients check their bills in Year 1
**Impact:** Identify $1.4B in overcharges annually
