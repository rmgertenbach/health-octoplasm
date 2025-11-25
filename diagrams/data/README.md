# Payerset Diagram Data Files

This folder contains sample data files demonstrating the structure and content of Payerset's healthcare data lake for integration with interactive diagrams.

## Sample Data Files

### 1. `sample-employers.json`
**Source**: Employer Reporting Plans (Monthly Updates)

**Key Fields**:
- `ein`: Employer Identification Number
- `reporting_plan_name`: Plan name
- `payer`: Associated insurance carrier/TPA
- `covered_lives_estimate`: Number of employees/families covered
- `annual_spend_estimate`: Total healthcare spend

**Use Cases**:
- Identify self-insured employers by size and industry
- Map employer-TPA relationships
- Calculate market share by covered lives
- Analyze spend patterns by vertical

### 2. `sample-providers.json`
**Sources**: Hospital Transparency (Quarterly) + NPPES (7M NPIs) + NUCC Taxonomy

**Key Fields**:
- `npi`: National Provider Identifier
- `hospital_id`: Unique facility identifier
- `system`: Health system affiliation
- `gross`, `discounted_cash`, `min_negotiated`, `max_negotiated`: Pricing tiers
- `taxonomy_code`: NUCC classification
- `leapfrog_grade`: Quality/safety rating (A-F)

**Use Cases**:
- Compare pricing across hospitals for same procedure
- Filter providers by specialty, location, quality grade
- Identify independent vs. system-affiliated providers
- Analyze price variation (min/max ratios)

### 3. `sample-pricing.json`
**Sources**: Transparency in Coverage (TiC) Files (Monthly) + Claims Data (Quarterly)

**Key Fields**:
- `billing_code`: CPT, DRG, NDC codes
- `negotiated_rate`: Rate agreed between payer and provider
- `remit_amount`: Actual amount paid to provider
- `spread_amount`: Difference kept by TPA/PBM
- `spread_percentage`: Percentage markup

**Use Cases**:
- Calculate TPA/PBM spread pricing
- Identify overpriced services
- Compare negotiated rates across payers
- Benchmark against Medicare rates
- Detect pricing outliers

## Data Integration Approaches

### Option 1: Static JSON (Current)
**Status**: ✅ Implemented in `diagram-test.html`

Files are embedded as mock data for demonstration. Node metadata links to data sources but doesn't fetch real data.

**Pros**:
- Fast prototyping
- No backend required
- Works offline

**Cons**:
- No real-time data
- Limited to pre-defined queries

### Option 2: API Endpoints
**Status**: 🔧 Requires backend setup

Create REST API endpoints that query Snowflake via DuckDB:

```javascript
// Example fetch from API
async function getEmployerData(ein) {
    const response = await fetch(`https://api.payerset.com/employers/${ein}`);
    const data = await response.json();
    return data;
}
```

**Pros**:
- Real-time data from Snowflake
- Full query capabilities
- Secure data access

**Cons**:
- Requires backend API development
- Authentication/authorization needed
- Rate limiting considerations

### Option 3: MCP (Model Context Protocol) Integration
**Status**: 🚀 Recommended for LLM/RAG

MCP servers provide structured access to data for AI assistants:

```javascript
// Example MCP integration
const mcpClient = new MCPClient({
    serverUrl: 'mcp://payerset-data-server',
    tools: ['query_tic_data', 'query_claims', 'query_providers']
});

async function queryViaLLM(userQuestion, context) {
    const response = await mcpClient.sendMessage({
        role: 'user',
        content: userQuestion,
        context: {
            stakeholder: context.selectedNode,
            availableTools: ['query_tic_data', 'get_provider_pricing']
        }
    });
    return response;
}
```

**MCP Server Setup** (Future Work):
1. Create MCP server that wraps Payerset API
2. Define tools for each data source (TiC, Claims, NPPES, etc.)
3. Implement query functions with proper access controls
4. Connect to Claude/LLM for natural language queries

**Pros**:
- Natural language queries ("Show me spread pricing for BCBS in Texas")
- Context-aware responses using diagram state
- Combines multiple data sources intelligently
- Standard protocol for AI integration

**Cons**:
- Requires MCP server development
- Complex error handling
- Token/cost management for LLM calls

## Current Implementation in diagram-test.html

The test diagram uses **Option 1** (Static JSON) with:

1. **Enhanced Node Metadata**: Each stakeholder has structured metadata
2. **Data Detail Panel**: Shows metrics, data sources, available fields
3. **Chat Interface**: Mock LLM responses based on keyword matching
4. **Query Examples**: Context-specific questions per stakeholder

### Mock Response Logic
Located in `generateMockResponse()` function:

```javascript
// Matches keywords in user query to pre-written responses
if (lowerQuery.includes('employer') && lowerQuery.includes('spend')) {
    return mockResponses.employer.spending; // Returns relevant data snippet
}
```

## Future Enhancement: Real MCP Integration

### Step 1: Create MCP Server
```bash
# Server exposes Payerset data via MCP protocol
mcp-server-payerset/
├── server.py              # MCP server implementation
├── tools/
│   ├── query_tic.py      # TiC data queries
│   ├── query_claims.py   # Claims data queries
│   ├── query_providers.py # Provider/hospital queries
│   └── query_employers.py # Employer data queries
└── config.json           # Snowflake credentials, tool definitions
```

### Step 2: Update Frontend to Use MCP
Replace mock responses with real MCP calls:

```javascript
async function sendQuery(query) {
    const response = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: query,
            context: {
                selectedNode: selectedNode?.id(),
                currentLayer: currentLayer,
                availableDataSources: ['tic', 'claims', 'nppes', 'hospital_transparency']
            }
        })
    });
    const data = await response.json();
    return data.answer;
}
```

### Step 3: Claude Integration
Use Claude with MCP tools:

```javascript
// Claude can now use MCP tools to answer questions
const claudeResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [{
        role: "user",
        content: "Show me average hip replacement costs at Cleveland Clinic compared to community hospitals"
    }],
    tools: [
        // MCP tools auto-discovered from server
        {
            name: "query_provider_pricing",
            description: "Query hospital pricing data from Payerset",
            input_schema: {
                type: "object",
                properties: {
                    procedure: { type: "string" },
                    provider_npi: { type: "string" },
                    compare_to: { type: "string" }
                }
            }
        }
    ]
});
```

## Query Examples by Stakeholder

### Employers
- "Show all self-insured employers in Texas with >10K lives"
- "What's the average healthcare spend per employee by industry?"
- "Which TPAs have the most employer clients?"

### Providers
- "Compare MRI pricing at Cleveland Clinic vs. community hospitals"
- "Find all Leapfrog A-rated hospitals in Ohio"
- "Show orthopedic surgeons with lowest complication rates"

### Middlemen (TPAs/PBMs)
- "Calculate average spread percentage for UnitedHealthcare"
- "Show PBM markup on generic atorvastatin"
- "Which payers have the highest negotiated rates?"

### Cross-Stakeholder
- "Trace money flow: Employer → TPA → Provider for a hip replacement"
- "Compare direct contracting costs vs. TPA network"
- "Show total spread extracted across all middlemen"

## Data Refresh & Updates

| Data Source | Update Frequency | Last Updated | Next Update |
|------------|------------------|--------------|-------------|
| TiC Files | Monthly | 2025-01 | 2025-02 |
| Hospital Transparency | Quarterly | 2025-Q1 | 2025-Q2 |
| Claims Data | Quarterly | 2024-Q4 | 2025-Q1 |
| NPPES | Monthly | 2025-01 | 2025-02 |
| Employer Plans | Monthly | 2025-01 | 2025-02 |

## Next Steps

1. **Immediate** (Demo/Prototype):
   - ✅ Use mock data in diagram-test.html
   - ✅ Refine query examples and responses
   - Test user experience and interaction patterns

2. **Short-Term** (Real Data):
   - Create API endpoints for specific queries
   - Implement authentication/authorization
   - Add caching layer for performance

3. **Long-Term** (Full MCP Integration):
   - Build MCP server with all data source tools
   - Integrate with Claude for natural language queries
   - Add real-time data updates and webhooks
   - Implement query cost tracking and optimization

## Contact

For questions about data access, MCP integration, or API development, contact the Payerset data team.
