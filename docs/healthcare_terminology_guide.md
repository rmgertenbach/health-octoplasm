# Healthcare Finance Terminology Guide
## Essential Terms and Concepts for Transparency Work

---

## Part 1: Payment and Pricing Terminology

### PMPM (Per Member Per Month)
**Definition**: A flat fee paid each month for each person covered, regardless of whether they use services.

**How it's used**:
- **Carrier/TPA fees**: "We charge $25 PMPM for administration"
- **Wraparound networks**: "Blue Cross charges $18 PMPM for out-of-area coverage"
- **Capitation payments**: "We pay the primary care group $45 PMPM to manage all primary care"
- **Reinsurance premiums**: "$500 PMPM for stop-loss coverage starting at $50K"

**Why it matters**:
- Creates predictable costs for budgeting
- Aligns incentives (provider gets paid whether patient comes in or not)
- Can hide true costs when bundled with other fees
- Mark Cuban's example: Less than $500 PMPM for family reinsurance

**Related terms**:
- **PMPY** (Per Member Per Year): Annual equivalent
- **PEPM** (Per Employee Per Month): Same as PMPM but counts only employees, not dependents
- **Capitation**: PMPM payment for all care (provider takes full risk)

---

### Spread Pricing
**Definition**: The difference between what a middleman (carrier/TPA/PBM) charges an employer and what they actually pay the provider or pharmacy.

**How it works**:

**Medical Example**:
```
Hospital bills: $10,000
Carrier "negotiated rate": $10,000
Carrier charges employer: $13,000
Carrier pays hospital: $9,500 (underpayment)
Carrier keeps: $3,500 spread
```

**Pharmacy Example**:
```
Pharmacy's drug cost (NADAC): $20
PBM charges employer: $150
PBM pays pharmacy: $25
PBM keeps: $125 spread (625% markup!)
```

**Why it's problematic**:
- Hidden from employer in aggregate reporting
- Not disclosed in contracts (buried in fine print)
- Can be 20-40% of total costs
- Cynthia Fisher's research: ~30% spread on medical claims
- Creates incentive to INCREASE prices (higher prices = higher spread dollars)

**How it's hidden**:
- Reported as "total claims paid" (includes spread)
- Mixed with legitimate administrative fees
- Buried in subsidiary transactions
- Protected by NDAs and complex contracts

**Types of spread**:
- **Medical spread**: Difference between provider payment and employer charge
- **Pharmacy spread**: Difference between pharmacy reimbursement and employer charge
- **Rebate retention**: PBM keeps manufacturer rebates instead of passing through
- **Network access fees**: Charges for using "proprietary" networks
- **Data access fees**: Charging employers to see their own data

**Your role**: Your transparency tools must expose spread by showing:
- What employers actually pay
- What providers/pharmacies actually receive
- The difference (the spread)
- Comparisons to market rates (Medicare, cash, NADAC)

---

### Cost-Sharing Terms

**Deductible**
- Amount patient must pay before insurance coverage begins
- Example: $3,000 deductible means patient pays first $3,000 of care
- "High deductible" = $1,500+ individual, $3,000+ family (IRS definition)
- Problem: 40% of Americans have < $400 in savings

**Coinsurance**
- Percentage patient pays after meeting deductible
- Example: 80/20 means insurance pays 80%, patient pays 20%
- Continues until out-of-pocket maximum reached
- Can be catastrophic for expensive care (20% of $100,000 = $20,000)

**Copay (Copayment)**
- Flat fee per service
- Example: $25 to see primary care doctor, $50 for specialist
- Usually applies even if deductible not met
- Can be tiered (generic drug $10, brand $40, specialty $100)

**Out-of-Pocket Maximum (OOPM)**
- Cap on what patient pays in a year (deductible + coinsurance + copays)
- Example: $19,200 for family (common ACA maximum)
- After hitting OOPM, insurance pays 100%
- Problem: Most families can't afford to reach it

**Cost-Sharing Reduction (CSR)**
- ACA subsidies that lower deductibles/copays for low-income enrollees
- Only available on exchange plans
- Separate from premium subsidies
- Politically controversial, funding uncertain

---

### Reference Pricing Terms

**Medicare Rates**
- Prices Medicare pays providers (set by government)
- Used as benchmark: "We'll pay Medicare + 40%"
- Generally covers provider costs but not excessive profits
- Varies by geography (adjusted for local costs)
- **Problem**: Politically sensitive, hospitals claim they "lose money" on Medicare

**DRG (Diagnosis-Related Group)**
- How Medicare pays hospitals for inpatient stays
- Bundled payment for entire admission based on diagnosis
- Example: DRG 470 = hip/knee replacement = $15,000 (roughly)
- Private insurance often uses DRG as reference ("DRG × 2.5")

**NADAC (National Average Drug Acquisition Cost)**
- What pharmacies actually pay wholesalers for drugs
- Updated weekly by CMS (Centers for Medicare & Medicaid Services)
- Transparent benchmark for pharmacy pricing
- **Critical for your work**: Shows PBM spread clearly
- Example: NADAC = $20, PBM charges $150 = $130 spread

**AWP (Average Wholesale Price)**
- Outdated "list price" for drugs (like hospital chargemaster)
- Inflated and meaningless ("Ain't What's Paid")
- Still used in many PBM contracts: "AWP minus 18%"
- **Problem**: AWP itself is inflated, so "discount" is fake
- Being replaced by NADAC in better contracts

**WAC (Wholesale Acquisition Cost)**
- Manufacturer's list price to wholesalers
- More accurate than AWP but still not what's actually paid
- Used for specialty drugs
- Doesn't include rebates/discounts

**MAC (Maximum Allowable Cost)**
- PBM's internal price list (usually proprietary)
- Used to determine pharmacy reimbursement
- Often not disclosed to employers
- Can be manipulated to increase spread

**Chargemaster Rates**
- Hospital's official price list (fantasy numbers)
- 3-5× actual payments
- Used to calculate "discounts"
- Example: Chargemaster = $100,000, insurance pays $30,000 = "70% discount!"
- **Meaningless for analysis**: Ignore these completely

---

## Part 2: Insurance Plan Types and Networks

### HMO (Health Maintenance Organization)

**Structure**:
- Requires choosing a primary care physician (PCP)
- PCP acts as "gatekeeper" (must refer you to specialists)
- Only covers in-network care (except emergencies)
- Most restrictive but usually cheapest

**How it works**:
- Patient sees PCP for any issue
- PCP coordinates all care
- Need referral to see specialist
- Out-of-network care not covered

**Payment model**:
- Often uses capitation (PMPM to medical groups)
- Medical group manages all care within budget
- Incentive to keep costs down (can lead to underutilization)

**Pros**:
- Lower premiums
- Coordinated care
- Less paperwork
- Preventive focus (theoretically)

**Cons**:
- Limited provider choice
- Referral requirements slow access
- Can't see out-of-network providers
- May delay necessary care

**Example**: Kaiser Permanente (classic HMO - owns hospitals and employs doctors)

---

### PPO (Preferred Provider Organization)

**Structure**:
- Large network of "preferred" providers
- Can see any provider (in or out of network)
- No PCP requirement
- No referrals needed

**How it works**:
- Lower cost-sharing for in-network providers
- Higher cost-sharing for out-of-network providers
- Patient has flexibility to choose
- Most common plan type for employers

**Payment model**:
- Fee-for-service (provider paid per service)
- "Negotiated rates" with in-network providers
- Balance billing possible for out-of-network

**Cost-sharing example**:
```
In-Network:
- $1,500 deductible
- 80/20 coinsurance
- $6,000 out-of-pocket max

Out-of-Network:
- $3,000 deductible
- 60/40 coinsurance
- $12,000 out-of-pocket max
```

**Pros**:
- Provider choice and flexibility
- No referrals needed
- Can see specialists directly
- Out-of-network coverage available

**Cons**:
- Higher premiums
- Higher cost-sharing
- Complex to understand costs
- Easy to accidentally go out-of-network

**Problem for transparency**: 
- "Negotiated rates" are opaque
- Patients don't know costs until after care
- Balance billing risk out-of-network
- Wide variation in network pricing

---

### EPO (Exclusive Provider Organization)

**Structure**:
- Like PPO but NO out-of-network coverage (except emergencies)
- No PCP requirement
- No referrals needed
- More restrictive than PPO, less than HMO

**How it works**:
- Must use network providers
- Can see any in-network provider directly
- Emergency care covered out-of-network
- Growing in popularity (cheaper than PPO)

**Payment model**:
- Fee-for-service within network
- No coverage out-of-network (patient pays 100%)

**Pros**:
- Lower premiums than PPO
- No referrals needed
- Can see specialists directly
- Simpler than PPO (only one network)

**Cons**:
- No out-of-network coverage
- Limited to network providers
- If network is narrow, very restrictive
- Travel issues (no coverage outside network area)

**Why it exists**:
- Insurers can negotiate harder (providers must join or lose all patients)
- Employers save money vs. PPO
- Patients get some flexibility vs. HMO

---

### POS (Point of Service)

**Structure**:
- Hybrid of HMO and PPO
- Requires PCP like HMO
- But allows out-of-network care like PPO (at higher cost)
- Least common plan type

**How it works**:
- Choose PCP who coordinates care
- Need referrals for specialists (if staying in-network)
- Can go out-of-network without referral (but pay more)

**Cost-sharing tiers**:
```
In-Network (with referral):
- Lowest cost
- HMO-like pricing

In-Network (without referral):
- Medium cost
- PPO-like pricing

Out-of-Network:
- Highest cost
- 50/50 coinsurance or worse
```

**Pros**:
- Balance of cost and flexibility
- Coordinated care option
- Out-of-network safety net

**Cons**:
- Most complex to understand
- Referral requirements confusing
- Least common (limited availability)
- Administrative complexity

---

### High-Deductible Health Plan (HDHP)

**Not a network type** - can be paired with PPO, EPO, or HMO
**Key feature**: High deductible ($1,600+ individual, $3,200+ family for 2024)

**Structure**:
- High deductible before coverage starts
- Usually paired with HSA (Health Savings Account)
- Preventive care covered 100% (ACA requirement)
- Everything else: patient pays until deductible met

**Why it exists**:
- "Consumer-driven healthcare" theory
- Lower premiums for employer
- HSA tax advantages
- "Skin in the game" for patients

**Reality** (as discussed in main article):
- Creates functionally uninsured population
- Delays necessary care
- Turns providers into debt collectors
- Savings mostly go to insurance companies

**HSA (Health Savings Account)**:
- Tax-advantaged savings for medical expenses
- Triple tax benefit (contributions, growth, withdrawals all tax-free)
- Rolls over year to year (unlike FSA)
- Becomes retirement account after 65
- Requires HDHP enrollment
- 2024 limits: $4,150 individual, $8,300 family

---

### Network Tier Terminology

**Narrow Network**
- Limited number of providers
- Usually lower cost
- May exclude expensive hospitals
- Risk: Limited access, especially specialists

**Tiered Network**
- Providers grouped by cost/quality
- Tier 1: Lowest cost-sharing (high-value providers)
- Tier 2: Medium cost-sharing (standard providers)
- Tier 3: Highest cost-sharing (expensive/low-value providers)
- Goal: Steer patients to high-value care

**High-Performance Network**
- Marketing term for narrow/tiered networks
- Supposedly includes only high-quality, efficient providers
- Reality: Often just excludes expensive providers regardless of quality
- **Be skeptical**: "High-performance" may mean "we pay them less"

**Centers of Excellence (COE)**
- Specific providers selected for complex care (transplants, joint replacements, cancer)
- Usually negotiated rates or bundled pricing
- Often includes travel coverage
- Example: Fly to Mayo Clinic for hip replacement, all costs covered

**Direct Contracting Network** (as discussed in main article)
- Employer negotiates directly with providers
- No carrier intermediary
- Usually cash prices or Medicare-based
- May need "wraparound network" for uncovered services

---

## Part 3: Administrative and Payment Terms

### Claims Processing Terms

**Claim**
- Bill from provider to insurance for services rendered
- Contains: Patient info, diagnosis codes (ICD), procedure codes (CPT/DRG), charges
- Submitted electronically (usually)
- Processed by carrier/TPA

**Adjudication**
- Process of evaluating and paying a claim
- Checks: Eligibility, coverage, medical necessity, pricing
- Results in: Paid, denied, or pended (needs more info)
- **Problem**: Can take 30-90+ days, creating cash flow issues for providers

**EOB (Explanation of Benefits)**
- Document showing how claim was processed
- Shows: Billed charges, allowed amount, insurance paid, patient owes
- **Notorious**: Confusing, appears like a bill (but isn't), incomprehensible language
- **Patient experience**: "This is not a bill" (but looks exactly like a bill)

**Remittance Advice**
- What providers receive showing payment details
- Provider version of EOB
- Shows: Claim ID, payment amount, adjustments, denial reasons
- Often received separately from actual payment (creates reconciliation headaches)

**Clean Claim**
- Claim with no errors, processed immediately
- Industry standard: 95%+ should be clean claims
- **Reality**: Many carriers deliberately complicate to delay payment

**Pended Claim**
- Claim needing additional information
- Stops payment clock
- Often used to delay payment (time value of money)
- Providers must resubmit with additional documentation

---

### Denial and Authorization Terms

**Prior Authorization (Pre-Auth, PA)**
- Approval required before service
- Carrier/TPA reviews medical necessity
- Required for expensive services (MRI, surgery, specialty drugs)
- **Problem**: Administrative burden, delays care, often denied inappropriately

**Denial**
- Claim rejected, not paid
- Reasons: Not medically necessary, not covered, coding error, eligibility issue
- Can be appealed
- **50% of denials overturned on appeal** (but most patients don't appeal)

**Denial Rate**
- Percentage of claims denied
- Varies wildly: 5-25% depending on carrier
- **Transparency question**: What's the denial rate in your contract?
- High denial rates = cash flow problems for providers

**Step Therapy**
- Must try cheaper treatment before expensive one
- Example: Generic drug → brand drug → specialty drug
- Insurance forces progression even if doctor prescribes specialty first
- Delays effective treatment

**Medical Necessity**
- Vague standard for coverage decisions
- "Appropriate care for condition"
- **Problem**: Carriers define this themselves (often restrictively)
- Frequent denial reason

**Utilization Management (UM)**
- Process to ensure appropriate use of services
- Includes: Prior auth, concurrent review, retrospective review
- **Goal**: Reduce inappropriate/wasteful care
- **Reality**: Often used to delay/deny payment

**Concurrent Review**
- Review while patient is hospitalized
- Determines if continued stay is necessary
- Can result in mid-stay denial (hospital absorbs cost)

---

### Financial Terms

**Premium**
- Monthly payment for insurance coverage
- Split between employer and employee (typically 70/30 or 80/20)
- **Self-insured reality**: Not actually premium, it's budget for claims + admin fees
- Fully-insured: True premium paid to carrier who takes risk

**Premium Equivalent**
- What self-insured employers would pay if fully-insured
- Used for budgeting and comparisons
- Includes: Expected claims + admin fees + stop-loss + margin

**Float**
- Money carriers hold between receiving premiums and paying claims
- Can be invested for profit
- Average 45-60 days
- At scale (billions of dollars), generates significant investment income
- **Episode 482**: Preston Alexander details how carriers profit from float

**Stop-Loss Insurance (Reinsurance)**
- Insurance for self-insured employers
- Protects against catastrophic claims
- Two types:
  - **Specific stop-loss**: Per individual (kicks in at $50K, $100K, $250K, etc.)
  - **Aggregate stop-loss**: Total claims above expected amount
- **Cost**: $500 PMPM for family coverage is Cuban's example

**Attachment Point**
- Dollar amount where stop-loss begins
- Example: $100K attachment point = employer pays first $100K per person
- Lower attachment = higher stop-loss premium
- Higher attachment = more risk for employer

**Lasering**
- Stop-loss carrier excludes specific known conditions
- Example: Employee with cancer? Carrier "lasers" them (won't cover)
- Protects stop-loss carrier, exposes employer
- Can make stop-loss worthless for sickest employees

---

### MLR and Financial Reporting Terms

**MLR (Medical Loss Ratio)**
- Percentage of premiums spent on medical care (vs. admin/profit)
- ACA requires 80-85% MLR (small group/individual vs. large group)
- Carriers must rebate excess if below threshold
- **Perverse incentive**: Higher prices = higher dollar profit (15% of bigger number)

**MLR Calculation**:
```
Medical Costs / (Premium Revenue - Taxes - Regulatory Fees) ≥ 85%

If $100M premium and 85% MLR:
- Must spend $85M on medical
- Keep $15M for admin + profit

If prices rise to $120M premium:
- Must spend $102M on medical
- Keep $18M for admin + profit
- (+$3M profit from medical inflation!)
```

**Why vertical integration matters**:
- Own PBM? Paying yourself counts as "medical costs"
- Own medical group? Paying yourself counts as "medical costs"
- Own specialty pharmacy? Paying yourself counts as "medical costs"
- Can hit 85% MLR while extracting profit through subsidiaries

**Intercompany Eliminations**
- Money transferred between subsidiaries
- Major carrier example: $161 billion in intercompany transfers (0.3% of US GDP!)
- Hides true profit and spreads
- Regulatory arbitrage

**Risk Adjustment**
- Payment adjustments based on patient health status
- Sicker populations get higher payments
- **Problem**: Incentive to upcode diagnoses (make patients appear sicker)
- Medicare Advantage uses extensively

---

## Part 4: Value-Based Care and Alternative Payment Models

### Capitation
- Fixed PMPM payment regardless of services provided
- Provider takes full risk
- Example: $45 PMPM for all primary care services
- **Incentive**: Keep patients healthy (profit = PMPM - costs)
- **Risk**: Underutilization, cherry-picking healthy patients

### Bundled Payments
- Single payment for entire episode of care
- Example: $25,000 for hip replacement (includes surgery, hospital, PT, complications)
- Provider keeps savings if efficient
- Provider absorbs costs if complications
- **Better than fee-for-service**: Rewards efficiency and quality

### Shared Savings
- Provider shares in cost reductions below benchmark
- Upside only (no risk for overspending)
- Example: Reduce costs 10%? Provider gets 50% of savings
- Entry model for providers new to risk

### Shared Risk
- Provider shares in savings AND losses
- Two-sided risk
- Higher potential rewards, higher potential losses
- More aggressive than shared savings

### Value-Based Payments**
- Umbrella term for non-fee-for-service payment
- Includes: Capitation, bundled payments, shared savings/risk
- Goal: Pay for outcomes, not volume
- **Reality**: Only ~35% of payments value-based (despite decade of hype)

---

## Part 5: Contract and Negotiation Terms

### Most Favored Nations (MFN)
- Clause requiring provider to give lowest rate
- "We get your best price or better"
- **Problem**: Prevents competition (everyone gets same rate)
- **Illegal in many contexts** (antitrust)

### All-or-Nothing Clause**
- Must contract with all facilities/providers in system
- Can't select only low-cost, high-quality providers
- **Example**: Want community hospital? Must also take expensive academic center
- Anticompetitive but common

### Anti-Steering Clause
- Prohibits plan from steering patients away
- Can't offer incentives to use other providers
- Protects expensive/low-quality providers
- **Red flag in contracts**

### Anti-Tiering Clause
- Prohibits placing provider in unfavorable tier
- All system facilities must be same tier (usually Tier 1)
- Prevents value-based benefit design
- **Negotiating leverage**: Large systems demand this

### Gag Clause
- Prohibits disclosing contract terms
- Can't tell patients about cash prices
- Can't share savings information
- **Banned by CAA in 2021** (but enforcement weak)

### Silent PPO
- Network leases/rents to other insurers without provider knowledge
- Provider contracts with PPO A
- PPO A leases network to PPO B, C, D...
- Provider sees patients from unknown networks at contracted rates
- Reduces provider revenue, no negotiation

### Reference-Based Pricing (RBP)
- Employer sets maximum payment (usually Medicare + X%)
- Pays that amount regardless of provider's charge
- Provider can balance bill patient (major risk)
- **Requires patient protection**: Employer negotiates or covers balance billing

### Balance Billing
- Provider bills patient for difference between charged amount and insurance payment
- Example: Provider charges $20K, insurance pays $10K, patient gets bill for $10K
- **Protected against**: In-network (by contract) and emergencies (by law)
- **Risk**: Out-of-network non-emergency care

---

## Part 6: Quality and Performance Metrics

### HEDIS (Healthcare Effectiveness Data and Information Set)
- Standardized quality measures
- Examples: Diabetes control, cancer screening, prenatal care
- Used to compare health plans
- **Problem**: Doesn't measure what patients care about most

### Star Ratings
- CMS quality ratings (1-5 stars) for Medicare Advantage and Part D
- Based on HEDIS measures, patient satisfaction, process measures
- Higher stars = higher payments from Medicare
- **Gaming potential**: Plans optimize for measured items, ignore rest

### Leapfrog Score
- Hospital safety grade (A, B, C, D, F)
- Based on: Infections, errors, injuries, safety practices
- Independent, publicly reported
- **Valuable for your work**: Real quality indicator

### NQF (National Quality Forum)
- Organization that endorses quality measures
- Ensures measures are evidence-based and important
- Used by CMS and commercial payers

### NCQA (National Committee for Quality Assurance)
- Accredits health plans
- Administers HEDIS
- "NCQA accredited" is marketing term (most large plans are)

---

## Part 7: Pharmacy-Specific Terms (PBM World)

### Formulary
- List of covered drugs
- Tiered: Tier 1 (generic), Tier 2 (preferred brand), Tier 3 (non-preferred brand), Tier 4 (specialty)
- PBM controls formulary (leverage for rebates)

### Rebates
- Money manufacturers pay PBMs for formulary placement
- Example: Drug A pays 40% rebate to be preferred over Drug B
- **Problem**: PBMs may not pass rebates to employers
- Creates perverse incentive (prefer high-cost drug with big rebate)

### Spread Pricing (Pharmacy)** - Already covered above
- Difference between what PBM charges employer and pays pharmacy
- Can be 100-600% markup
- Hidden in aggregate reporting

### Pass-Through PBM
- PBM passes all rebates to employer
- Charges transparent flat fee (not percentage)
- No spread pricing
- **What good looks like**: Mark Cuban advocates for this model

### DIR Fees (Direct and Indirect Remuneration)
- Fees PBMs charge pharmacies after claim is paid
- Retroactive clawbacks
- Reduce pharmacy reimbursement below NADAC
- Hidden from employers and patients
- **Predatory**: Especially hurts independent pharmacies

### Specialty Pharmacy
- Handles expensive, complex drugs (biologics, injectables)
- Often owned by PBMs
- Captive network (must use PBM's specialty pharmacy)
- Massive profits (30-40% margins)

### White Bagging vs. Brown Bagging
- **White bagging**: Specialty pharmacy ships drug to provider's office for administration
- **Brown bagging**: Patient picks up drug and brings to provider
- Both avoid hospital markups
- Hospitals hate this (lose revenue)

---

## Part 8: Regulatory and Legal Terms

### ERISA (Employee Retirement Income Security Act)
- Federal law governing employer benefit plans
- Preempts most state insurance laws for self-insured plans
- **Important**: Self-insured employers have more flexibility
- Sets fiduciary duty standards

### Fiduciary Duty
- Legal obligation to act in plan participants' best interest
- Applies to employers, not carriers/PBMs (usually)
- **Problem**: Often violated unknowingly
- Conflicts of interest rampant

### CAA (Consolidated Appropriations Act)
- 2021 law with transparency requirements
- Machine-readable files (MRFs)
- Gag clause prohibitions
- Broker/consultant disclosure requirements
- **Your data source**: MRFs must be published

### No Surprises Act
- Protects patients from surprise medical bills
- Covers emergencies and certain non-emergency situations
- Requires good faith estimates
- Independent dispute resolution for payment disputes

### HIPAA (Health Insurance Portability and Accountability Act)
- Protects patient privacy
- Governs how health information is shared
- **Not an excuse**: Employers can access de-identified data
- Often misused to prevent transparency

---

## Part 9: Terms You'll Hear in Your Work

### Data Analytics and Reporting

**Claims Data**
- Electronic records of all services billed
- Contains: Patient, provider, diagnosis, procedure, cost
- **Your primary data source**
- Often incomplete or dirty

**Eligibility File**
- Who's covered, when, what plan
- Demographic info (age, gender, location)
- Enrollment dates
- **Critical for**: Per member calculations, risk adjustment

**Attribution**
- Assigning patients to specific providers/practices
- Needed for quality measurement and payment
- **Problem**: Multiple attribution methods, results vary

**Risk Scoring**
- Predicting patient's expected costs
- Based on: Age, gender, diagnoses, prior utilization
- Higher score = sicker/more expensive patient
- **Used for**: Budgeting, risk adjustment, benchmark setting

**Trend Analysis**
- Tracking cost changes over time
- Components: Utilization × price
- Example: 8% trend = 3% more services × 5% higher prices
- **Your tool goal**: Separate price inflation from utilization changes

---

### Market and Network Terms

**Geographic Network**
- Provider coverage in specific area
- **Adequacy standards**: Must have X providers within Y miles
- Rural areas often have limited networks
- Travel issues for narrow networks

**Market Concentration**
- How consolidated provider market is
- **Measures**: HHI (Herfindahl-Hirschman Index)
- High concentration = monopoly pricing power
- **Example**: Single hospital system in region = no negotiating leverage

**Market Dominance**
- Provider(s) control large market share
- Can demand high prices
- Employers have few alternatives
- **Solution**: Direct contracting, travel benefits, telemedicine

---

## Part 10: How These Terms Connect to Your Work

### The Transparency Stack

**Level 1: Price Transparency**
- What does it actually cost? (Not chargemaster, not "discounts")
- Need: NADAC, Medicare rates, cash prices, actual contract rates
- **Your tools expose**: Real contracted rates, spread pricing

**Level 2: Payment Transparency**
- Who pays what to whom?
- Need: Claims flow tracking, spread identification
- **Your tools expose**: Value leakage, hidden fees

**Level 3: Quality Transparency**
- Is it worth the price?
- Need: Outcomes data, safety scores, patient experience
- **Your tools expose**: Value (quality per dollar)

**Level 4: Contract Transparency**
- What terms are costing money?
- Need: Contract analysis, clause identification
- **Your tools expose**: Anti-competitive terms, hidden costs

### Terms That Signal Problems

**Red flags in contracts**:
- "Average Wholesale Price" (AWP) - inflated benchmark
- "MAC pricing" without definition - PBM controls pricing
- "Administrative fees" without itemization - hiding spread
- "Performance guarantees" with huge loopholes
- "Most favored nations" - prevents competition
- "All or nothing" - forces expensive providers into network

**Red flags in negotiations**:
- "Our rates are proprietary" - hiding bad deals
- "You need us for network access" - leveraging market power
- "Industry standard pricing" - meaningless
- "Best-in-class discounts" - off inflated chargemaster

### Terms That Signal Solutions

**Green flags in contracts**:
- "Pass-through pricing" - transparency
- "NADAC-based pricing" - real benchmark
- "Claims data ownership" - employer controls data
- "Flat PMPM fee" - no spread incentive
- "Open formulary" - employer choice
- "Audit rights" - verification ability

**Green flags in negotiations**:
- "Here's our Medicare rate" - transparent
- "Cash price available" - real pricing
- "Bundled payment" - aligned incentives
- "Direct contract" - cutting out middlemen
- "Performance-based" - outcomes matter

---

## Quick Reference: Common Acronyms by Context

### When analyzing claims:
- PMPM, PEPM - Payment rates
- DRG, CPT - Procedure codes
- ICD - Diagnosis codes
- NPI - Provider identifier
- EOB - Payment explanation
- OOPM - Cost-sharing cap

### When evaluating pharmacy:
- NADAC - Real drug cost
- AWP - Fake drug cost
- MAC - PBM pricing
- DIR - Hidden pharmacy fee
- Rebate - Manufacturer payment
- Spread - PBM profit

### When reviewing networks:
- HMO, PPO, EPO, POS - Plan types
- COE - Centers of Excellence
- MFN - Pricing clause
- NDA - Secrecy clause
- RBP - Reference-based pricing

### When measuring quality:
- HEDIS - Quality measures
- Star Ratings - CMS scoring
- Leapfrog - Safety grade
- NQF - Measure endorsement

### When reading contracts:
- ASO - Admin services only
- TPA - Third-party administrator
- ERISA - Federal benefit law
- MLR - Medical cost percentage
- Stop-loss - Reinsurance

---

## The Essential Translation Guide

**What they say → What it means**:

"Industry-leading discounts off billed charges"
→ Meaningless (discounts off fake chargemaster)

"Proprietary high-performance network"  
→ We excluded expensive providers (maybe for good reason, maybe not)

"Average wholesale price minus 18%"
→ Inflated benchmark minus fake discount = overpaying

"Performance guarantees with risk-sharing"
→ We keep the upside, you take the downside (read fine print)

"Competitive PMPM administrative fees"
→ Plus hidden spread, DIR fees, rebate retention, data fees...

"Medical loss ratio of 85%"
→ We might be paying ourselves for services (check subsidiaries)

"Best available network access"
→ We have leverage with providers (possibly from size, possibly from exclusionary contracts)

"Transparent pass-through pricing"
→ (Hopefully true! But verify in contract - see if rebates, spreads, all fees disclosed)

---

## Final Note for Your Work

Every term in this guide represents either:
1. **A price** you need to make transparent
2. **A contract term** you need to flag as problematic or beneficial
3. **A payment flow** you need to track
4. **A quality measure** you need to connect to cost
5. **A regulatory requirement** you can leverage for data

Your job is to cut through this terminology thicket and show people:
- What they're really paying (not what they think they're paying)
- What they're really getting (not what they're told they're getting)
- Where value is leaking (spread, fees, poor quality)
- What better alternatives exist (direct contracting, transparent PBMs, high-value providers)

Remember Mark Cuban's principle: Healthcare business is simple - cost, payment, risk. 

All this terminology exists to obscure those three simple questions. Your transparency tools make the answers visible again.

**The question behind every term**: "Is this adding value or extracting it?"

That's what you're here to answer.