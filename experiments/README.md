# Healthcare Transparency Platform - Experiments

**Status:** Phase 1 Prototypes Complete ✅

This folder contains working prototypes of the Healthcare Transparency Platform, demonstrating the vision outlined in [PLAN.md](../PLAN.md).

## 🎯 What's Here

A fully functional prototype platform with:
- **3 persona-based experiences** (Patients, Employers, Providers)
- **Interactive tools** using mock Payerset-structure data
- **Beautiful, responsive design** built with vanilla HTML/CSS/JS
- **Real transparency concepts** brought to life

## 🚀 Quick Start

### View the Platform

Simply open these files in your browser:

1. **Main Entry Point:** `index.html` - Persona selector landing page
2. **Patient Experience:** `patients/index.html` → `patients/search.html`
3. **Employer Experience:** `employers/index.html` → `employers/benchmark.html` → `employers/spread-calculator.html`

### Recommended Order

1. Start at `index.html` to see the persona selector
2. Try the **Patient search tool** at `patients/search.html` (select "MRI Scan" or "Hip Replacement")
3. Run the **Employer audit tool** at `employers/benchmark.html` (click "Run Full Audit Analysis")
4. See **Spread pricing detection** at `employers/spread-calculator.html` (click "Analyze Sample Claims Data")

## 📁 Folder Structure

```
experiments/
├── index.html                    # Main landing page (persona selector)
│
├── patients/                     # Patient portal
│   ├── index.html               # Patient landing page
│   └── search.html              # Cost comparison tool (LIVE DEMO)
│
├── employers/                    # Employer command center
│   ├── index.html               # Employer landing page
│   ├── benchmark.html           # Rate benchmarking tool (LIVE DEMO)
│   └── spread-calculator.html   # Spread pricing detector (LIVE DEMO)
│
├── providers/                    # Provider marketplace (future)
│   └── index.html               # Coming soon
│
├── learn/                        # Educational content (future)
│   └── stakeholder-map.html     # Coming soon
│
├── shared/                       # Shared resources
│   ├── styles.css               # Complete design system
│   ├── components.js            # Reusable UI components
│   └── data-mock.js             # Mock Payerset-structure data
│
└── assets/                       # Images, icons, illustrations
    ├── illustrations/
    └── icons/
```

## 🎨 Design System

Located in `shared/styles.css`:

- **Persona colors:** Blue (patients), Orange (employers), Purple (providers)
- **Alignment colors:** Green (aligned), Red (extractive), Yellow (mixed), Blue (neutral)
- **Typography scale:** 1.250 ratio (Major Third)
- **Spacing:** 8px base unit
- **Components:** Cards, buttons, forms, badges, alerts, grids
- **Responsive:** Mobile-first with breakpoints at 768px, 1024px, 1440px

## 💾 Mock Data

Located in `shared/data-mock.js`:

Represents the Payerset data structure with realistic examples:

- **Providers:** 5 sample providers (Austin, TX area) with NPIs, locations, specialties, quality grades
- **Procedures:** 7 common procedures (MRI, Hip Replacement, Colonoscopy, etc.)
- **Negotiated Rates:** Real-looking TiC data showing what different payers/providers charge
- **Employer Benchmarks:** Sample 500-employee company with overpayment analysis
- **Spread Pricing:** Claims data showing hidden fees

### Key Functions:
```javascript
HealthcareData.searchProviders('mri', '78701')  // Search for providers
HealthcareData.getEmployerBenchmark()           // Get employer audit data
HealthcareData.getSpreadPricingAnalysis()       // Get spread pricing data
```

## 🔧 UI Components

Located in `shared/components.js`:

Reusable components for common patterns:

```javascript
HealthcareUI.createProviderCard(provider)           // Provider comparison cards
HealthcareUI.createOverpaymentAlert(data)          // Overpayment alerts
HealthcareUI.createSavingsOpportunityCard(opp)     // Savings opportunity cards
HealthcareUI.showModal(title, content)            // Modal dialogs
HealthcareUI.showToast(message, type)             // Toast notifications
HealthcareUI.formatCurrency(amount)                // Currency formatting
HealthcareUI.initializeSearchAutocomplete(...)     // Search autocomplete
```

## ✨ Key Features Implemented

### Patient Tools
- ✅ **Search & Compare** - Find providers by procedure, compare prices + quality
- ✅ **Cost Estimation** - See insurance rates, cash prices, estimated out-of-pocket
- ✅ **Quality Grades** - Display Leapfrog safety grades (A-F)
- ✅ **Geographic Search** - Distance calculation, directions to providers
- ✅ **Value Recommendations** - Identify "best value" (quality + price)

### Employer Tools
- ✅ **Benchmark Dashboard** - Compare rates vs. Medicare + peers
- ✅ **Overpayment Detection** - Calculate total overpayment vs. fair rates
- ✅ **ROI Analysis** - Show potential savings by procedure
- ✅ **Spread Pricing Detector** - Reveal hidden TPA/PBM fees
- ✅ **Contract Red Flags** - Educate on problematic TPA clauses

### Design Features
- ✅ Responsive mobile-first design
- ✅ Smooth animations and transitions
- ✅ Accessible color contrast (WCAG AA)
- ✅ Loading states and user feedback
- ✅ Interactive data visualizations

## 🎯 What's Working

### Fully Functional
- All landing pages (main, patients, employers)
- Patient search tool with 7 procedures
- Employer benchmark analysis
- Spread pricing detection
- Mock data integration
- Component library
- Responsive design

### Mock/Placeholder
- Quality data (shows Grade A/B/C but not real Leapfrog integration yet)
- "Book Appointment" buttons (show modal explaining next steps)
- Provider details modals (work, but limited data)
- Download reports (show "coming soon" modal)

## 📊 Demo Data Highlights

### Sample Providers (Austin, TX)
- **HighQuality Imaging Center** - MRI for $425 (Grade A)
- **MegaHealth Hospital System** - MRI for $2,800 (Grade C)
- **Austin Orthopedics Group** - Hip replacement $18K (Grade A)
- **Community Health Center** - Mid-priced, Grade B
- **Premium Surgical Institute** - ASC, Grade A

### Sample Employer (TechCo Austin)
- 500 employees, $8M annual spend
- Paying 30% above fair rates
- $2.4M potential savings identified
- Top opportunity: Colonoscopy (paying $3,800 vs. $1,120 fair rate = 239% overpayment)

### Sample Spread Pricing
- $12.5M total employer paid
- $10.2M actually reached providers
- $2.3M kept as spread (18.4% average)

## 🚀 Next Steps (Future Development)

### Priority 1: Real Data Integration
- [ ] Connect to actual Payerset DuckDB queries
- [ ] Integrate Leapfrog quality data
- [ ] Add real-time search functionality
- [ ] Enable employer claims upload

### Priority 2: Missing Pages
- [ ] Provider landing page and tools
- [ ] Healthcare 101 educational modules
- [ ] Interactive stakeholder map
- [ ] Spread pricing explainer (enhanced)

### Priority 3: Advanced Features
- [ ] User accounts and saved searches
- [ ] PDF report generation
- [ ] Bill checker (OCR + validation)
- [ ] Direct contract builder
- [ ] API endpoints

### Priority 4: Production Polish
- [ ] React/Next.js migration
- [ ] Backend API (FastEndpoints)
- [ ] Authentication (FusionAuth)
- [ ] Analytics integration
- [ ] SEO optimization

## 🎨 Design Philosophy

**Clean & Trustworthy:** Inspired by Stripe and Linear
- Generous whitespace
- Clear typography hierarchy
- Subtle animations
- Professional color palette
- Data visualization that tells stories

**Progressive Disclosure:** Simple on surface, depth available
- Essential info upfront
- "Learn More" expands details
- Tooltips for definitions
- Modals for complex content

**Mobile-First:** Works beautifully on all devices
- Touch-friendly targets (min 44px)
- Swipeable cards
- Responsive grids
- Optimized for both phone and desktop workflows

## 📝 Code Quality

- **Clean HTML:** Semantic markup, accessible structure
- **Modular CSS:** Design system with CSS variables, reusable classes
- **Vanilla JavaScript:** No dependencies, easy to understand and modify
- **Well-commented:** Explains intent and data structures
- **Performance:** Fast load times, optimized animations

## 🔄 Converting to Production

This prototype is designed for easy migration to a production stack:

1. **Design System** → Tailwind CSS (already uses similar utility patterns)
2. **Components** → React components (JS functions → JSX components)
3. **Mock Data** → API calls to DuckDB via FastEndpoints
4. **Static Pages** → Next.js pages with SSR/SSG
5. **Styling** → Same CSS variables, converted to Tailwind config

## 📚 Related Documentation

- [../PLAN.md](../PLAN.md) - Comprehensive strategic plan
- [../docs/Payerset Data Lake Master Inventory.md](../docs/Payerset%20Data%20Lake%20Master%20Inventory.md) - Data structure reference
- [../docs/Healthcare Stakeholder Map.md](../docs/Healthcare%20Stakeholder%20Map.md) - Ecosystem analysis
- [../docs/PBGH Transparency Impact.md](../docs/PBGH%20Transparency%20Impact.md) - Case study proof points

## 🎉 What We've Built

This is **healthcare's Kayak moment** - making complex transparency data actionable for everyone:

- **For Patients:** "Know Before You Go" - Compare prices, find quality care, stop surprise bills
- **For Employers:** "Stop the Bleeding" - Detect overpayment, eliminate spread pricing, meet CAA compliance
- **For Providers:** "Prove Your Value" - Market intelligence, direct contract tools, quality differentiation (coming soon)

## 🚦 How to Test

### Patient Flow
1. Open `patients/index.html`
2. Click "Search Providers" or pick "MRI Scan"
3. Should see 3 providers with prices ranging $425-$2,800
4. Note the "Best Value" recommendation (HighQuality Imaging - Grade A, $425)
5. Click around - modals, buttons, all work

### Employer Flow
1. Open `employers/index.html`
2. Read the value prop (30% overpayment, PBGH case study)
3. Click "Get Free Audit"
4. Click "Run Full Audit Analysis"
5. See the $2.4M overpayment alert
6. Scroll through savings opportunities and detailed table
7. Try the spread pricing detector: `employers/spread-calculator.html`

### Design System Test
1. Open any page and resize browser window
2. Should be fully responsive (mobile → tablet → desktop)
3. All buttons should have hover states
4. Cards should have subtle shadows and animations
5. Colors should match persona (blue for patients, orange for employers)

## 💡 Tips for Demos

1. **Start with the patient search** - Most intuitive, shows immediate value
2. **Show the $2.4M overpayment** - Employers' eyes will pop
3. **Explain spread pricing** - The $13K → $10K → $3K spread visual is powerful
4. **Emphasize real data** - This uses the actual TiC/Hospital Transparency structure
5. **Mobile-first** - Open on phone to show it works everywhere

## 🐛 Known Limitations

- Mock data only (not connected to real Payerset DB yet)
- Quality grades are placeholder (need Leapfrog integration)
- No user accounts or saved searches
- PDF downloads not implemented (show modal instead)
- Provider tools not built yet
- Educational modules incomplete

## 📈 Success Metrics (When Live)

Based on [PLAN.md](../PLAN.md):
- **North Star:** Total healthcare dollars identified as overpayment
- **Patient:** 10K searches/month by end of Year 1
- **Employer:** 100 audits completed in Year 1
- **Impact:** $100M overpayment identified in Year 1

---

**Built with:** Vanilla HTML, CSS, JavaScript - No frameworks, no dependencies, just clean code.

**Status:** ✅ Phase 1 Complete - Ready for user testing and feedback

**Next:** Get feedback, iterate on design, prepare for real data integration
