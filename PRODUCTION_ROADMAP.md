# Healthcare Transparency Platform - Production Roadmap

**Current Status:** Phase 1 Complete + Provider Portal + Education ✅
**Next Phase:** DuckDB Integration & Production Infrastructure

---

## 🎉 What We've Built

### Complete Prototype Platform (experiments/)

#### **Three Persona Experiences:**

1. **Patient Portal** ✅
   - Landing page with value proposition
   - Interactive search tool (7 procedures)
   - Cost comparison with quality grades
   - Healthcare 101 education (4 modules)
   - Mobile-responsive design

2. **Employer Command Center** ✅
   - Landing page with urgency + CAA compliance
   - Benchmark dashboard (detects 30% overpayment)
   - Spread pricing detector (reveals hidden fees)
   - Contract red flags guide
   - ROI calculations

3. **Provider Marketplace** ✅
   - Landing page with "Dr. Rodis problem"
   - Market intelligence dashboard
   - Competitive positioning analysis
   - Direct contract opportunity identification
   - Quality differentiation tools

#### **Supporting Infrastructure:**
- Complete design system ([shared/styles.css](experiments/shared/styles.css))
- Component library ([shared/components.js](experiments/shared/components.js))
- Mock data layer ([shared/data-mock.js](experiments/shared/data-mock.js))
- Responsive mobile-first design
- Smooth animations and interactions

---

## 🚀 Path to Production

### Phase 2: Real Data Integration (Weeks 1-2)

#### Goal: Connect to actual Payerset data via DuckDB

**Tasks:**

1. **Set up DuckDB Connection**
   ```
   - Install DuckDB in project
   - Configure connection to Parquet files
   - Test basic queries against TiC data
   - Implement connection pooling
   ```

2. **Create Data Access Layer**
   ```javascript
   // File: api/data-layer.js
   class PayersetDataAccess {
     async searchProviders(procedureCode, location) {
       // Query TiC negotiated rates
       // Join with NPPES provider data
       // Enrich with taxonomy and location
       // Return formatted results
     }

     async getEmployerBenchmark(procedures) {
       // Query negotiated rates by procedure
       // Compare to Medicare rates
       // Calculate overpayment
       // Return analysis
     }

     async detectSpreadPricing(claimsData) {
       // Compare claims to negotiated rates
       // Identify spread amounts
       // Calculate total impact
       // Return findings
     }
   }
   ```

3. **Replace Mock Data**
   ```
   - Update patients/search.html to call real API
   - Update employers/benchmark.html to use real data
   - Update providers/market-intel.html with actual rates
   - Maintain same UI/UX, just swap data source
   ```

4. **Performance Optimization**
   ```
   - Cache frequently accessed data (Redis/in-memory)
   - Index common query patterns
   - Optimize DuckDB queries (EXPLAIN ANALYZE)
   - Implement rate limiting
   ```

**Deliverables:**
- ✅ Functional DuckDB connection
- ✅ Data access layer with key queries
- ✅ Real data flowing to UI
- ✅ Sub-2 second response times

---

### Phase 3: API Infrastructure (Weeks 3-4)

#### Goal: Build production API layer

**Technology Stack:**
- **Backend:** .NET 8 with FastEndpoints (per Technical Overview)
- **Database:** DuckDB for analytics, PostgreSQL for app data
- **Caching:** Redis for frequently accessed data
- **Authentication:** FusionAuth (per Technical Overview)

**API Endpoints:**

```
POST /api/search/providers
{
  "procedureCode": "70553",
  "location": { "zipCode": "78701", "radius": 25 },
  "sortBy": "value" // or "price", "quality", "distance"
}

Response:
{
  "results": [...providers with rates...],
  "benchmarks": { "medicareRate": 850, "fairRate": 1200, "market": {...} },
  "metadata": { "count": 5, "queryTime": "421ms" }
}

POST /api/employer/benchmark
{
  "procedures": [
    { "code": "70553", "currentRate": 2400, "annualVolume": 120 },
    ...
  ]
}

Response:
{
  "summary": {
    "totalSpend": 8000000,
    "fairSpend": 5600000,
    "overpayment": 2400000,
    "overpaymentPercent": 0.30
  },
  "procedures": [...detailed analysis...],
  "opportunities": [...top savings...]
}

POST /api/provider/market-analysis
{
  "npi": "1234567890",
  "procedures": ["70553", "27130", ...]
}

Response:
{
  "provider": {...details...},
  "marketPosition": {...analysis...},
  "procedures": [...competitor comparison...],
  "opportunities": [...direct contract targets...]
}
```

**Tasks:**
1. Set up .NET FastEndpoints project
2. Implement data access layer
3. Create API endpoints
4. Add authentication middleware (FusionAuth)
5. Implement caching strategy
6. Add logging and monitoring
7. Write API documentation (Swagger)
8. Deploy to staging environment

**Deliverables:**
- ✅ Production API with 8-10 core endpoints
- ✅ Authentication and authorization
- ✅ API documentation
- ✅ Monitoring and logging
- ✅ Staging environment deployed

---

### Phase 4: Frontend Migration (Weeks 5-6)

#### Goal: Migrate from vanilla JS to Next.js/React

**Why Next.js:**
- Server-side rendering (SEO critical for patients)
- API routes (can co-locate with frontend)
- File-based routing (matches our current structure)
- Built-in optimization (images, fonts, etc.)
- Easy Vercel deployment

**Migration Strategy:**

```
Current Structure → Next.js Structure

experiments/
├─ index.html          → app/page.tsx
├─ patients/
│  ├─ index.html       → app/patients/page.tsx
│  ├─ search.html      → app/patients/search/page.tsx
│  └─ learn.html       → app/patients/learn/page.tsx
├─ employers/
│  ├─ index.html       → app/employers/page.tsx
│  ├─ benchmark.html   → app/employers/benchmark/page.tsx
│  └─ spread-calculator.html → app/employers/spread/page.tsx
├─ providers/
│  ├─ index.html       → app/providers/page.tsx
│  └─ market-intel.html → app/providers/market/page.tsx
└─ shared/
   ├─ styles.css       → app/globals.css + Tailwind
   ├─ components.js    → components/*.tsx
   └─ data-mock.js     → lib/api.ts (real API calls)
```

**Component Conversion Example:**

```javascript
// Old (experiments/shared/components.js)
function createProviderCard(provider) {
  const card = document.createElement('div');
  card.innerHTML = `...`;
  return card;
}

// New (components/ProviderCard.tsx)
export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="card">
      {/* JSX markup */}
    </div>
  );
}
```

**Tasks:**
1. Set up Next.js project
2. Install Tailwind CSS (convert CSS variables)
3. Convert shared components to React
4. Migrate pages one by one (patients → employers → providers)
5. Update API calls to use fetch/axios
6. Implement client-side state management (Zustand/Context)
7. Add SEO metadata (next/head)
8. Optimize images (next/image)
9. Test responsive design
10. Deploy to Vercel

**Deliverables:**
- ✅ Next.js application with all features
- ✅ Tailwind CSS styling (converted from our design system)
- ✅ React components (converted from our vanilla JS)
- ✅ SEO optimized
- ✅ Deployed to production (Vercel)

---

### Phase 5: Quality Data Integration (Weeks 7-8)

#### Goal: Integrate Leapfrog hospital safety grades

**Leapfrog Data:**
- Hospital Safety Grades (A, B, C, D, F)
- Updated twice per year (spring/fall)
- Available via API or CSV download
- Covers ~2,800 hospitals

**Integration Tasks:**
1. Obtain Leapfrog data access (partnership or purchase)
2. Map Leapfrog hospital IDs to our NPIs
3. Store grades in PostgreSQL (app database)
4. Update provider search to include quality filter
5. Display grades prominently in UI
6. Add quality explanations (what each grade means)
7. Implement "best value" algorithm (quality + price)

**Updated Search Logic:**
```javascript
// Before: Sort by price only
results.sort((a, b) => a.negotiatedRate - b.negotiatedRate);

// After: Sort by value score (quality + price)
results.sort((a, b) => {
  const qualityScore = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
  const aScore = qualityScore[a.qualityGrade] * 1000 - a.negotiatedRate;
  const bScore = qualityScore[b.qualityGrade] * 1000 - b.negotiatedRate;
  return bScore - aScore; // Higher score = better value
});
```

**Deliverables:**
- ✅ Leapfrog grades integrated for 2,800+ hospitals
- ✅ Quality-based search and filtering
- ✅ "Best value" algorithm implemented
- ✅ Quality explanations for patients

---

### Phase 6: Advanced Features (Weeks 9-12)

#### Goal: Build features that don't exist elsewhere

**Feature 1: Bill Checker (OCR + Validation)**
```
User uploads photo of medical bill
→ OCR extracts procedure codes and amounts
→ Compare to our transparency data
→ Flag overcharges
→ Generate negotiation script

Tech: Tesseract.js or cloud OCR (AWS Textract)
```

**Feature 2: Spread Pricing Detector (Claims Upload)**
```
Employer uploads CSV of claims data
→ Parse and validate
→ Match to our negotiated rates
→ Calculate spread per claim
→ Generate report

Security: Encrypt at rest, process server-side only, delete after analysis
```

**Feature 3: Direct Contract Builder**
```
Provider inputs their rates
→ Show savings vs. market
→ Generate professional proposal PDF
→ Email to local employers
→ Track interest/responses

Tech: PDF generation (puppeteer), email (SendGrid), CRM integration
```

**Feature 4: Geographic Heatmaps**
```
Show price variation by ZIP code
→ Interactive map (Mapbox)
→ Color-coded by price ranges
→ Identify high-cost vs. low-cost areas

Use case: Patients, employers, policy researchers
```

**Deliverables:**
- ✅ Bill checker (MVP: upload → validation → report)
- ✅ Spread detector (MVP: CSV upload → analysis → PDF)
- ✅ Direct contract tool (MVP: proposal generator)
- ✅ Geographic visualization (MVP: basic heatmap)

---

### Phase 7: User Accounts & Saved Features (Week 13+)

#### Goal: Persistent user experience

**User Features:**
```
- Create account (email or social login)
- Save favorite providers
- Save searches
- Set price alerts ("notify if hip replacement < $20K in Austin")
- Track claims (for employers)
- Document compliance (for employers)
- Build proposals (for providers)
```

**Authentication:**
- FusionAuth (per Technical Overview)
- OAuth support (Google, Microsoft)
- JWT tokens
- Role-based access control (patient/employer/provider)

**Database Schema:**
```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50), -- patient, employer, provider
  created_at TIMESTAMP,
  ...
);

-- saved_searches table
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  search_type VARCHAR(50), -- procedure, provider, market
  search_params JSONB,
  created_at TIMESTAMP
);

-- saved_providers table
CREATE TABLE saved_providers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  npi VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP
);

-- employer_claims (for spread analysis)
CREATE TABLE employer_claims (
  id UUID PRIMARY KEY,
  employer_id UUID REFERENCES users(id),
  claim_data JSONB, -- encrypted
  analysis_results JSONB,
  uploaded_at TIMESTAMP
);
```

**Deliverables:**
- ✅ FusionAuth integration
- ✅ User registration/login
- ✅ Saved searches and favorites
- ✅ Employer claims tracking
- ✅ Provider proposal management

---

## 🔧 Technical Infrastructure

### Current Setup (Prototypes)
```
experiments/
├─ Pure HTML/CSS/JavaScript
├─ No build process
├─ No dependencies
├─ Local file:// URLs
└─ Mock data only
```

### Target Production Setup

```
Frontend (Vercel)
├─ Next.js 14 (React 18)
├─ Tailwind CSS
├─ TypeScript
├─ Vercel Edge Functions
└─ CDN for static assets

Backend (Your infrastructure)
├─ .NET 8 with FastEndpoints
├─ DuckDB (analytics queries)
├─ PostgreSQL (app data)
├─ Redis (caching)
└─ FusionAuth (authentication)

Data Layer
├─ Payerset Parquet files (S3)
├─ DuckDB query engine
├─ Quarterly data updates
└─ Rectification pipeline
```

### Deployment Architecture

```
┌─────────────────┐
│   Cloudflare    │  (DNS, DDoS protection)
└────────┬────────┘
         │
┌────────▼────────┐
│   Vercel Edge   │  (Next.js, API routes, CDN)
└────────┬────────┘
         │
┌────────▼────────────────────────┐
│   Your .NET API (FastEndpoints) │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼──────┐
│DuckDB│  │PostgreSQL│
│(S3)  │  │(App DB)  │
└──────┘  └──────────┘
```

---

## 📊 Data Pipeline

### Current Data Flow (Mock)
```
User action → JavaScript function → Mock data object → Render UI
```

### Production Data Flow
```
User action
  → Next.js page (client)
  → API route (Next.js server) OR
  → .NET API endpoint
  → Data access layer
  → DuckDB query (Parquet files on S3)
  → Result processing & enrichment
  → JSON response
  → Client receives & renders
  → Cache in Redis (for subsequent requests)
```

### Example: Patient Searches MRI in Austin

```
1. User enters "MRI" and "78701" in search box

2. Frontend calls: POST /api/search/providers
   {
     "procedureCode": "70553", // MRI brain with contrast
     "location": { "zipCode": "78701", "radius": 25 }
   }

3. API server queries DuckDB:
   SELECT
     n.npi,
     n.negotiated_rate,
     n.negotiated_type,
     p.name,
     p.city,
     p.state,
     p.latitude,
     p.longitude,
     p.quality_grade,
     t.grouping as specialty
   FROM
     tic_negotiated_rates n
   JOIN
     nppes_providers p ON n.npi = p.npi
   JOIN
     nucc_taxonomy t ON p.primary_taxonomy = t.code
   WHERE
     n.billing_code = '70553'
     AND p.state = 'TX'
     AND DISTANCE(p.latitude, p.longitude, 30.2672, -97.7431) < 25
   ORDER BY
     (p.quality_score * 1000) - n.negotiated_rate DESC
   LIMIT 10;

4. Enrich results:
   - Calculate distance for each provider
   - Determine "best value" recommendation
   - Estimate out-of-pocket cost (based on typical coinsurance)
   - Compare to Medicare benchmark
   - Flag if any rates are > 200% of Medicare

5. Return JSON:
   {
     "results": [...10 providers with all data...],
     "benchmarks": {
       "medicareRate": 850,
       "fairRate": 1200,
       "marketMin": 425,
       "marketMax": 2800,
       "marketMedian": 1200
     },
     "metadata": {
       "count": 10,
       "queryTime": "421ms",
       "dataAsOf": "2025-01-01"
     }
   }

6. Frontend renders results in cards (exactly like prototype)
```

---

## 🔒 Security & Compliance

### Data Security
- ✅ All PII encrypted at rest (AES-256)
- ✅ TLS 1.3 for all connections
- ✅ No storing of user claims data (process and delete)
- ✅ HIPAA compliance for any PHI handling
- ✅ SOC 2 Type II certification (in progress per docs)

### Authentication & Authorization
- ✅ FusionAuth for user management
- ✅ JWT tokens with short expiration
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization

### Transparency Data Compliance
- ✅ Proper attribution to source (TiC, Hospital Transparency)
- ✅ "Data as of" timestamps
- ✅ Disclaimers about estimates
- ✅ Terms of use
- ✅ Privacy policy

---

## 💰 Cost Estimates

### Infrastructure Costs (Monthly)

**Vercel (Frontend):**
- Free tier: $0
- Pro plan: $20/month (if needed)

**Backend Hosting:**
- AWS EC2 (t3.medium): ~$50/month
- Or Azure App Service: ~$75/month

**Database:**
- PostgreSQL (managed): ~$50/month
- Redis (managed): ~$30/month

**DuckDB/S3:**
- S3 storage (100GB Parquet): ~$2/month
- S3 data transfer: ~$10/month

**Total: ~$150-200/month** (can scale up as needed)

### One-Time Costs
- Leapfrog data license: TBD (partnership opportunity)
- FusionAuth setup: Included (self-hosted or cloud)
- SSL certificates: $0 (Let's Encrypt)

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 2: DuckDB Integration | 2 weeks | Real data connected |
| Phase 3: API Infrastructure | 2 weeks | Production API deployed |
| Phase 4: Next.js Migration | 2 weeks | Frontend on Vercel |
| Phase 5: Quality Data | 2 weeks | Leapfrog integrated |
| Phase 6: Advanced Features | 4 weeks | Bill checker, spread detector, etc. |
| Phase 7: User Accounts | 2+ weeks | Full user experience |

**Total: ~14 weeks to full production**

---

## 🎯 Success Criteria (Launch)

### Technical
- ✅ Sub-2 second API response times
- ✅ 99.9% uptime
- ✅ Mobile-responsive on all devices
- ✅ Accessible (WCAG AA)
- ✅ SEO optimized (Core Web Vitals green)

### Data
- ✅ 7M+ providers (NPPES coverage)
- ✅ 2,800+ hospitals with quality grades
- ✅ Billions of negotiated rates (TiC data)
- ✅ Monthly data updates
- ✅ < 30 day data staleness

### Features
- ✅ Patient search (functional)
- ✅ Employer benchmark (functional)
- ✅ Provider market intel (functional)
- ✅ Education modules (complete)
- ✅ User accounts (functional)

### Business
- ✅ 100+ beta users across all personas
- ✅ 1,000+ searches in first month
- ✅ 10+ employer audits completed
- ✅ Positive user feedback (NPS > 50)
- ✅ Media coverage (1+ major outlet)

---

## 🚦 Next Steps (This Week)

1. **Review this roadmap** with team
2. **Prioritize Phase 2** (DuckDB integration)
3. **Set up development environment:**
   - Install DuckDB
   - Access Payerset Parquet files
   - Test sample queries
4. **Create data access layer prototype:**
   - Write 3-5 key queries
   - Test performance
   - Validate results
5. **Update one page to use real data:**
   - Start with patient search (highest visibility)
   - Keep same UI
   - Swap data source
   - Test thoroughly

---

## 📚 Resources

- [PLAN.md](PLAN.md) - Strategic plan
- [experiments/README.md](experiments/README.md) - Prototype documentation
- [Technical Overview.md](docs/Technical%20Overview.md) - Infrastructure details
- [Payerset Data Inventory](docs/Payerset%20Data%20Lake%20Master%20Inventory.md) - Data structure

---

**Status:** Ready for Phase 2 - DuckDB Integration
**Owner:** Development Team
**Last Updated:** 2025-11-12
