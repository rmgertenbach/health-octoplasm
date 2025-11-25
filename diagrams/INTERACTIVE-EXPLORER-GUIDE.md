# Interactive Data Explorer - User Guide

## 🎉 What's Been Built

A fully interactive healthcare ecosystem diagram with:
- **Click-to-explore** data panels for each stakeholder
- **AI-powered chat interface** for natural language queries
- **Real data structure** examples from Payerset's data lake
- **Extensible architecture** ready for MCP integration

## 📍 Location

**File**: `/diagrams/diagram-test.html`

**Access**:
- Open `diagram-test.html` directly in a browser
- Or navigate from main site → Diagrams dropdown → "Data Explorer (TEST)"

## ✨ Key Features

### 1. Enhanced Node Metadata
Every stakeholder node contains rich metadata:
- **Type**: Category (Money Source, Care Delivery, etc.)
- **Key Metrics**: Specific to stakeholder type
  - Employers: covered lives, annual spend, risk model
  - Providers: pricing ranges, taxonomy, quality grades
  - Middlemen: spread percentages, data sources
- **Data Sources**: Which Payerset datasets contain info
- **Available Fields**: Actual database fields you can query

### 2. Data Detail Panel (Right Sidebar)
**How to use**:
1. Click any stakeholder node on the diagram
2. Panel slides in from right with detailed data
3. View metrics, data sources, and available fields
4. Click "Ask Questions About This Data" to open chat with context

**What it shows**:
- Stakeholder type and category
- Key business metrics
- Data source tags (TiC Files, Claims Data, etc.)
- Available database fields (NPI, NEGOTIATED_RATE, etc.)
- Quick-action button to query this data

### 3. Chat Interface (Bottom Drawer)
**How to use**:
1. Click the green chat FAB (floating button) in bottom-right
2. Type your question or click example queries
3. Get instant (mock) responses about healthcare data
4. Context-aware: knows which node you've selected

**Example queries** (all work with mock responses):
- "Show employer healthcare spending data"
- "What data is available for self-insured employers?"
- "Show me hospital pricing data"
- "Calculate average spread percentage"
- "Explain PBM spread pricing"

### 4. Interactive Tooltips
**Enhanced features**:
- Hover over any node to see description
- Bullet-point key facts
- **New**: "👆 Click to view detailed data" hint at bottom
- Follows mouse cursor for easy reading

### 5. Floating Action Buttons (FABs)
- **Green Chat Button**: Toggle chat interface
- **Blue Data Button**: Reopen data panel (appears after selecting a node)

## 🎯 Sample Data Files

### Location: `/diagrams/data/`

Three comprehensive JSON files demonstrate real Payerset data structure:

1. **`sample-employers.json`**
   - 3 example employer records
   - Fields: EIN, plan name, payer, covered lives, spend
   - Aggregated metrics: 160M lives, $350B spend
   - Query examples included

2. **`sample-providers.json`**
   - Hospital and physician examples
   - Pricing tiers (gross, cash, min/max negotiated)
   - NPPES and NUCC taxonomy data
   - Quality metrics (Leapfrog grades)

3. **`sample-pricing.json`**
   - TPA spread pricing examples
   - PBM pharmacy markup (100-600%!)
   - Hospital procedure price variation
   - Claims data structure

4. **`README.md`**
   - Complete documentation
   - Integration approaches (Static → API → MCP)
   - MCP setup instructions
   - Query examples by stakeholder type

## 🔍 How to Test

### Basic Navigation
1. Open `diagram-test.html` in browser
2. Try all three view layers (Executive, Standard, Detailed)
3. Hover over nodes to see tooltips
4. Click any node to open data panel

### Data Panel Exploration
1. Click "EMPLOYERS" node
2. Review the metadata:
   - Type: Money Source
   - Covered lives: 160M Americans
   - Annual spend: $350B+
   - Data sources: Employer Reporting Plans, TiC Files
3. Note the available fields: EIN, reporting_plan_name, payer
4. Click "Ask Questions About This Data"

### Chat Interface Testing
1. Chat should open with example questions
2. Try typing: "Show employer healthcare spending data"
3. See mock response with real data structure info
4. Try: "What is spread pricing?"
5. Get detailed explanation with examples
6. Try clicking example query buttons (context-specific to selected node)

### Cross-Feature Testing
1. Click "PROVIDERS" node → Data panel opens
2. Click "Ask Questions" → Chat opens with provider-specific examples
3. Try: "Show me hospital pricing data"
4. Response explains Hospital Transparency dataset structure
5. Close panels with X buttons or by clicking FABs again

## 💡 Mock Response Intelligence

The chat uses keyword matching to simulate LLM responses:

| Keywords | Response Type | Example |
|----------|--------------|---------|
| "employer" + "spend" | Employer spending data | "$350B+ annually..." |
| "employer" + "data" | Available employer fields | "EIN, reporting_plan_name..." |
| "fiduciary" | ERISA explanation | "CAA 2021 requires..." |
| "provider" / "hospital" + "pric" | Hospital pricing data | "GROSS, MIN/MAX negotiated..." |
| "quality" | Quality metrics info | "Leapfrog grades A-F..." |
| "spread" | Spread pricing explanation | "$100 → $30 → $70 example" |
| "tpa" / "middlem" | TPA data structure | "NEGOTIATED_RATE fields..." |
| "caa" | CAA transparency rules | "Machine-readable files..." |

## 🚀 Next Steps: Real MCP Integration

### Phase 1: API Backend (Short-term)
```javascript
// Replace mock responses with real API calls
async function fetchEmployerData(ein) {
    const response = await fetch(`https://api.payerset.com/employers/${ein}`);
    return await response.json();
}
```

### Phase 2: MCP Server (Medium-term)
1. Build MCP server wrapping Payerset API
2. Define tools for each data source:
   - `query_tic_data`: TiC file queries
   - `query_claims`: Claims data analysis
   - `query_providers`: Provider/hospital lookup
   - `query_employers`: Employer plan data

### Phase 3: Claude Integration (Long-term)
```javascript
// Natural language queries via Claude + MCP
const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    messages: [{
        role: "user",
        content: "Compare hip replacement costs at Cleveland Clinic vs community hospitals"
    }],
    tools: [mcpTools] // Auto-queries real Payerset data
});
```

## 📊 Architecture Comparison

### Current Implementation (Mock Data)
```
User Query → Keyword Matching → Pre-written Response → Display
```
**Pros**: Instant, no backend, works offline
**Cons**: Limited responses, no real data

### Future MCP Implementation
```
User Query → Claude (LLM) → MCP Tools → Snowflake/DuckDB → Real Data → Claude → Natural Language Response → Display
```
**Pros**: Any query, real data, intelligent analysis
**Cons**: Backend required, cost per query, latency

## 🎨 Design Features

### Colors & Branding
- **Payerset Blue** (#3B82F6): Primary actions, headers
- **Payerset Green** (#10B981): Success, chat button
- **Alignment Colors**:
  - Green (#90EE90): Aligned with patient interests
  - Pink (#FFB6C6): Misaligned (conflicts)
  - Yellow (#FFFFE0): Mixed alignment
  - Blue (#E6F3FF): Neutral (regulators)

### Responsive Behavior
- Data panel: 400px fixed width, slides from right
- Chat drawer: 300px height, slides from bottom
- Diagram adjusts margins when panels open
- FABs always visible in bottom-right corner

### Animations
- Panel slide transitions: 0.3s ease
- Node hover effects: border expansion
- Selected node: Green highlight border
- Smooth tooltip following

## 🐛 Known Limitations

1. **Mock Data Only**: Responses are pre-written, not dynamic
2. **Limited Queries**: Only ~15 different response patterns
3. **No Real-Time Updates**: Data is static JSON
4. **Single Layer**: Only Layer 0 (Executive View) has full metadata
5. **No Authentication**: Anyone can access (add auth for production)

## 🔧 Customization Points

### Add New Stakeholder Metadata
Edit `graphData` object in diagram-test.html:
```javascript
{
    id: 'new-stakeholder',
    label: 'NEW STAKEHOLDER',
    metadata: {
        type: 'Your Category',
        key_metric: 'Your Value',
        data_sources: ['Dataset 1', 'Dataset 2']
    },
    queryExamples: [
        'Question 1',
        'Question 2'
    ]
}
```

### Add New Mock Responses
Edit `mockResponses` object:
```javascript
'new-stakeholder': {
    metric: 'Your response text here...',
    another: 'Another response...'
}
```

### Add New Query Keyword Matching
Edit `generateMockResponse()` function:
```javascript
if (lowerQuery.includes('your keyword')) {
    return mockResponses.yourCategory.yourResponse;
}
```

## 📖 Reference Files

| File | Purpose |
|------|---------|
| `/diagrams/diagram-test.html` | Main interactive diagram |
| `/diagrams/data/sample-employers.json` | Employer data structure |
| `/diagrams/data/sample-providers.json` | Provider/hospital data |
| `/diagrams/data/sample-pricing.json` | Pricing & spread data |
| `/diagrams/data/README.md` | Data integration guide |
| `/diagrams/shared/diagram-common.css` | Shared styles (used by all diagrams) |

## 🎓 Learning Resources

### Payerset Data Lake
- **Master Inventory**: `/docs/Payerset Data Lake Master Inventory.md`
- **TiC Fields**: BILLING_CODE, NEGOTIATED_RATE, NPI, TIN_VALUE
- **Claims Fields**: AVG_CLAIM_AMOUNT, REMIT_AMOUNT, SPREAD
- **NPPES**: 7M provider NPIs with taxonomy
- **Hospital Transparency**: Quarterly pricing updates

### MCP Resources
- **Official Docs**: https://modelcontextprotocol.io
- **Claude Integration**: https://docs.anthropic.com/claude/docs/tool-use
- **Server Examples**: https://github.com/modelcontextprotocol/servers

## 🎯 Success Metrics

What this demo proves:
- ✅ Interactive data exploration is intuitive
- ✅ Click-to-view pattern works well
- ✅ Chat interface is discoverable
- ✅ Data structure is well-defined
- ✅ Ready for real backend integration

## 💬 Feedback & Questions

Try these scenarios and note any issues:

1. **Speed**: Do panels open/close smoothly?
2. **Clarity**: Is the data organization clear?
3. **Discoverability**: Did you find the click-to-explore feature?
4. **Chat UX**: Is the chat interface useful?
5. **Mobile**: Does it work on smaller screens? (Needs testing)

## 🚢 Deployment Checklist

Before production:
- [ ] Replace mock responses with real MCP integration
- [ ] Add authentication/authorization
- [ ] Implement rate limiting on queries
- [ ] Add error handling for failed API calls
- [ ] Test on mobile devices
- [ ] Add analytics tracking
- [ ] Optimize for performance (lazy loading, caching)
- [ ] Add user feedback mechanism
- [ ] Document API endpoints
- [ ] Set up monitoring/logging

---

**Built**: November 2025
**Status**: Prototype/Demo
**Next**: MCP Integration for real data queries
