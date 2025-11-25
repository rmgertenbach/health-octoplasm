# MCP Implementation Plan: Connecting Data Explorer to Real Payerset Data

## Current State Assessment

### What We Have ✅
- Interactive frontend UI with data panels and chat interface
- Clear data structure definitions (sample JSON files)
- Mock responses demonstrating desired UX
- Understanding of Payerset data sources (TiC, Claims, NPPES, etc.)

### What's Missing ❌
- Backend MCP server to bridge Claude ↔ Payerset data
- API endpoints querying Snowflake via DuckDB
- Authentication & authorization layer
- Real-time data fetching
- LLM integration for natural language → SQL

## Architecture Overview

```
User Query in Browser
    ↓
Frontend (diagram-test.html)
    ↓
Backend API (/api/mcp/query)
    ↓
MCP Server (Python FastAPI)
    ├─ Tool: query_tic_data
    ├─ Tool: query_claims
    ├─ Tool: query_providers
    └─ Tool: query_employers
    ↓
Claude API (with MCP tools)
    ↓
Execute Tool Calls
    ↓
Snowflake Query (via DuckDB)
    ↓
Return Results → Claude → Format Response → Frontend
```

---

## Phase 1: MCP Server Foundation (ACTIONABLE NOW)
**Timeline**: 1-2 weeks
**Goal**: Create working MCP server with one functional tool connected to Payerset data

### Step 1.1: Set Up MCP Server Project Structure

```bash
# Create project structure
mkdir -p /Users/ryangertenbach/ps1/mcp-server
cd /Users/ryangertenbach/ps1/mcp-server

# Python project files
mcp-server/
├── server.py                  # Main MCP server
├── tools/
│   ├── __init__.py
│   ├── query_tic.py          # TiC data queries (START HERE)
│   ├── query_providers.py    # Provider/hospital data
│   ├── query_claims.py       # Claims data
│   └── query_employers.py    # Employer data
├── database/
│   ├── __init__.py
│   ├── snowflake_client.py   # Snowflake connection
│   └── query_builder.py      # SQL generation helpers
├── config.py                  # Configuration
├── requirements.txt           # Python dependencies
└── README.md                  # Documentation
```

### Step 1.2: Install Required Dependencies

**requirements.txt**:
```txt
# MCP & Claude
anthropic>=0.18.0
mcp>=0.9.0

# Database
snowflake-connector-python>=3.0.0
duckdb>=0.9.0

# Web Framework
fastapi>=0.109.0
uvicorn>=0.27.0
pydantic>=2.0.0

# Utilities
python-dotenv>=1.0.0
tenacity>=8.2.0  # Retry logic
```

### Step 1.3: Create Configuration File

**config.py**:
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Snowflake Connection
    SNOWFLAKE_USER = os.getenv('SNOWFLAKE_USER')
    SNOWFLAKE_PASSWORD = os.getenv('SNOWFLAKE_PASSWORD')
    SNOWFLAKE_ACCOUNT = os.getenv('SNOWFLAKE_ACCOUNT')
    SNOWFLAKE_WAREHOUSE = os.getenv('SNOWFLAKE_WAREHOUSE', 'COMPUTE_WH')
    SNOWFLAKE_DATABASE = os.getenv('SNOWFLAKE_DATABASE', 'PAYERSET')
    SNOWFLAKE_SCHEMA = os.getenv('SNOWFLAKE_SCHEMA', 'PUBLIC')

    # Claude API
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

    # MCP Server
    MCP_SERVER_HOST = os.getenv('MCP_SERVER_HOST', 'localhost')
    MCP_SERVER_PORT = int(os.getenv('MCP_SERVER_PORT', 3000))

    # Security
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:*').split(',')
    API_KEY = os.getenv('API_KEY')  # For authenticating frontend requests

config = Config()
```

**.env** (DO NOT COMMIT):
```bash
# Snowflake Credentials
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_DATABASE=PAYERSET
SNOWFLAKE_SCHEMA=PUBLIC

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# API Security
API_KEY=generate_secure_random_key_here
```

### Step 1.4: Create Snowflake Database Client

**database/snowflake_client.py**:
```python
import snowflake.connector
from typing import List, Dict, Any
from config import config

class SnowflakeClient:
    def __init__(self):
        self.conn = None

    def connect(self):
        """Establish connection to Snowflake"""
        self.conn = snowflake.connector.connect(
            user=config.SNOWFLAKE_USER,
            password=config.SNOWFLAKE_PASSWORD,
            account=config.SNOWFLAKE_ACCOUNT,
            warehouse=config.SNOWFLAKE_WAREHOUSE,
            database=config.SNOWFLAKE_DATABASE,
            schema=config.SNOWFLAKE_SCHEMA
        )
        return self.conn

    def execute_query(self, query: str, params: Dict = None) -> List[Dict[str, Any]]:
        """Execute a query and return results as list of dicts"""
        if not self.conn:
            self.connect()

        cursor = self.conn.cursor(snowflake.connector.DictCursor)

        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            results = cursor.fetchall()
            return results

        finally:
            cursor.close()

    def execute_query_to_parquet(self, query: str, output_path: str):
        """Execute query and write results to Parquet file in S3"""
        # This would use Snowflake's COPY INTO S3 functionality
        # Then load subset via DuckDB
        pass

    def close(self):
        if self.conn:
            self.conn.close()

# Singleton instance
db_client = SnowflakeClient()
```

### Step 1.5: Create First MCP Tool - TiC Data Query

**tools/query_tic.py**:
```python
from typing import Dict, List, Any, Optional
from database.snowflake_client import db_client

class TiCQueryTool:
    """Tool for querying Transparency in Coverage (TiC) data"""

    name = "query_tic_data"
    description = """Query Payerset's Transparency in Coverage (TiC) dataset.

    Use this tool to:
    - Find negotiated rates for specific billing codes
    - Compare rates across payers
    - Search by provider NPI or TIN
    - Filter by geographic location or payer

    Available fields: BILLING_CODE, BILLING_CODE_TYPE, NEGOTIATED_RATE,
    PAYER, PROVIDER_NPI, TIN_VALUE, PLAN_ID, SERVICE_CODES
    """

    input_schema = {
        "type": "object",
        "properties": {
            "billing_code": {
                "type": "string",
                "description": "CPT, HCPCS, or DRG code (e.g., '99214', '470')"
            },
            "billing_code_type": {
                "type": "string",
                "enum": ["CPT", "HCPCS", "DRG", "NDC"],
                "description": "Type of billing code"
            },
            "payer": {
                "type": "string",
                "description": "Payer name (e.g., 'Blue Cross Blue Shield of Texas')"
            },
            "provider_npi": {
                "type": "string",
                "description": "Provider NPI to filter by"
            },
            "state": {
                "type": "string",
                "description": "Two-letter state code (e.g., 'TX', 'CA')"
            },
            "limit": {
                "type": "integer",
                "description": "Maximum number of results to return (default 100)",
                "default": 100
            },
            "aggregate": {
                "type": "boolean",
                "description": "Return aggregated statistics (min/max/avg) instead of raw records",
                "default": False
            }
        },
        "required": ["billing_code"]
    }

    def execute(self, **kwargs) -> Dict[str, Any]:
        """Execute TiC data query"""
        billing_code = kwargs.get('billing_code')
        billing_code_type = kwargs.get('billing_code_type', 'CPT')
        payer = kwargs.get('payer')
        provider_npi = kwargs.get('provider_npi')
        state = kwargs.get('state')
        limit = kwargs.get('limit', 100)
        aggregate = kwargs.get('aggregate', False)

        # Build SQL query
        if aggregate:
            query = self._build_aggregate_query(
                billing_code, billing_code_type, payer, state
            )
        else:
            query = self._build_detail_query(
                billing_code, billing_code_type, payer, provider_npi, state, limit
            )

        # Execute query
        try:
            results = db_client.execute_query(query)

            return {
                "success": True,
                "query": query,
                "result_count": len(results),
                "results": results
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "query": query
            }

    def _build_aggregate_query(self, billing_code: str, code_type: str,
                               payer: Optional[str], state: Optional[str]) -> str:
        """Build SQL for aggregated statistics"""
        query = f"""
        SELECT
            BILLING_CODE,
            BILLING_CODE_TYPE,
            COUNT(DISTINCT PAYER) as payer_count,
            COUNT(*) as record_count,
            MIN(NEGOTIATED_RATE) as min_rate,
            MAX(NEGOTIATED_RATE) as max_rate,
            AVG(NEGOTIATED_RATE) as avg_rate,
            MEDIAN(NEGOTIATED_RATE) as median_rate
        FROM TIC_DATA
        WHERE BILLING_CODE = '{billing_code}'
          AND BILLING_CODE_TYPE = '{code_type}'
        """

        if payer:
            query += f"\n  AND PAYER ILIKE '%{payer}%'"
        if state:
            query += f"\n  AND STATE = '{state}'"

        query += "\nGROUP BY BILLING_CODE, BILLING_CODE_TYPE"

        return query

    def _build_detail_query(self, billing_code: str, code_type: str,
                           payer: Optional[str], npi: Optional[str],
                           state: Optional[str], limit: int) -> str:
        """Build SQL for detailed records"""
        query = f"""
        SELECT
            BILLING_CODE,
            BILLING_CODE_TYPE,
            NEGOTIATED_RATE,
            NEGOTIATION_TYPE,
            PAYER,
            PLAN_ID,
            PROVIDER_NPI,
            TIN_VALUE,
            SERVICE_CODES,
            EFFECTIVE_DATE,
            EXPIRATION_DATE
        FROM TIC_DATA
        WHERE BILLING_CODE = '{billing_code}'
          AND BILLING_CODE_TYPE = '{code_type}'
        """

        if payer:
            query += f"\n  AND PAYER ILIKE '%{payer}%'"
        if npi:
            query += f"\n  AND PROVIDER_NPI = '{npi}'"
        if state:
            query += f"\n  AND STATE = '{state}'"

        query += f"\nLIMIT {limit}"

        return query

# Export tool instance
tic_query_tool = TiCQueryTool()
```

### Step 1.6: Create MCP Server

**server.py**:
```python
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import anthropic
from config import config
from tools.query_tic import tic_query_tool

app = FastAPI(title="Payerset MCP Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class QueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    answer: str
    tool_calls: list
    raw_results: Optional[Dict] = None

# Security: API Key validation
async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != config.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key

# Claude client
claude_client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# MCP Tools Registry
MCP_TOOLS = [
    {
        "name": tic_query_tool.name,
        "description": tic_query_tool.description,
        "input_schema": tic_query_tool.input_schema
    }
]

@app.post("/api/mcp/query", response_model=QueryResponse)
async def process_query(
    request: QueryRequest,
    api_key: str = Depends(verify_api_key)
):
    """Process natural language query using Claude + MCP tools"""

    # Build system prompt with context
    system_prompt = """You are a Payerset data assistant with access to healthcare pricing data.

    You can query:
    - Transparency in Coverage (TiC): Negotiated rates between payers and providers
    - Claims Data: Actual payments and volume
    - Provider Data: Hospital and physician information
    - Employer Data: Self-insured plan information

    When users ask questions, use the appropriate tool to fetch real data, then provide
    a clear, concise answer with specific numbers and insights.
    """

    # Add context if provided
    if request.context:
        system_prompt += f"\n\nCurrent context: {request.context}"

    # Call Claude with tools
    try:
        response = claude_client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": request.query
            }],
            tools=MCP_TOOLS
        )

        # Process tool calls
        tool_results = []
        final_answer = ""

        for content_block in response.content:
            if content_block.type == "tool_use":
                # Execute tool
                tool_name = content_block.name
                tool_input = content_block.input

                if tool_name == tic_query_tool.name:
                    result = tic_query_tool.execute(**tool_input)
                    tool_results.append({
                        "tool": tool_name,
                        "input": tool_input,
                        "result": result
                    })

                    # Continue conversation with tool result
                    followup = claude_client.messages.create(
                        model="claude-sonnet-4-5-20250929",
                        max_tokens=1024,
                        system=system_prompt,
                        messages=[
                            {"role": "user", "content": request.query},
                            {"role": "assistant", "content": response.content},
                            {
                                "role": "user",
                                "content": [{
                                    "type": "tool_result",
                                    "tool_use_id": content_block.id,
                                    "content": str(result)
                                }]
                            }
                        ]
                    )

                    # Extract final text answer
                    for block in followup.content:
                        if hasattr(block, "text"):
                            final_answer = block.text

            elif hasattr(content_block, "text"):
                final_answer = content_block.text

        return QueryResponse(
            answer=final_answer or "I processed your query but couldn't generate a response.",
            tool_calls=tool_results,
            raw_results=tool_results[0]["result"] if tool_results else None
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "tools_available": len(MCP_TOOLS)}

@app.get("/api/tools")
async def list_tools():
    """List available MCP tools"""
    return {"tools": MCP_TOOLS}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.MCP_SERVER_HOST, port=config.MCP_SERVER_PORT)
```

### Step 1.7: Test MCP Server Locally

**test_mcp_server.py**:
```python
import requests
import json

# Test configuration
API_URL = "http://localhost:3000"
API_KEY = "your_api_key_here"

def test_query(query: str, context: dict = None):
    """Test a query against the MCP server"""
    response = requests.post(
        f"{API_URL}/api/mcp/query",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "query": query,
            "context": context
        }
    )

    print(f"Query: {query}")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 80)

# Test queries
if __name__ == "__main__":
    # Test 1: Simple TiC query
    test_query("What is the average negotiated rate for CPT code 99214?")

    # Test 2: Payer comparison
    test_query(
        "Compare negotiated rates for CPT 99214 between Blue Cross and UnitedHealthcare in Texas"
    )

    # Test 3: With context
    test_query(
        "Show me pricing data for this provider",
        context={"selectedNode": "providers", "provider_npi": "1234567890"}
    )
```

### Step 1.8: Update Frontend to Call Real API

**Update diagram-test.html** - Replace mock `sendQuery()` function:

```javascript
// Replace the mock sendQuery function with this:
async function sendQuery(query) {
    const input = document.getElementById('chatInput');
    const queryText = query || input.value.trim();
    if (!queryText) return;

    // Add user message
    const messagesContainer = document.getElementById('chatMessages');
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = queryText;
    messagesContainer.appendChild(userMsg);

    // Show loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message assistant';
    loadingMsg.innerHTML = '<strong>Data Assistant:</strong><br>Querying Payerset data...';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        // Call real MCP API
        const response = await fetch('http://localhost:3000/api/mcp/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'YOUR_API_KEY_HERE' // TODO: Move to secure config
            },
            body: JSON.stringify({
                query: queryText,
                context: {
                    selectedNode: selectedNode ? selectedNode.id() : null,
                    currentLayer: currentLayer,
                    nodeMetadata: selectedNode ? selectedNode.data().metadata : null
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Remove loading message
        messagesContainer.removeChild(loadingMsg);

        // Add real response
        const assistantMsg = document.createElement('div');
        assistantMsg.className = 'chat-message assistant';
        assistantMsg.innerHTML = `<strong>Data Assistant:</strong><br>${data.answer}`;
        messagesContainer.appendChild(assistantMsg);

    } catch (error) {
        console.error('Query failed:', error);
        messagesContainer.removeChild(loadingMsg);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'chat-message assistant';
        errorMsg.innerHTML = `<strong>Error:</strong><br>Failed to query data. ${error.message}`;
        messagesContainer.appendChild(errorMsg);
    }

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
```

---

## Phase 1 Deliverables Checklist

- [ ] MCP server project structure created
- [ ] Python dependencies installed
- [ ] Snowflake connection configured
- [ ] `query_tic_data` tool implemented and tested
- [ ] MCP server running locally
- [ ] Health check endpoint responding
- [ ] Test queries working (CPT 99214 example)
- [ ] Frontend updated to call real API
- [ ] End-to-end test: Browser → API → Snowflake → Response

## Phase 1 Success Criteria

**You'll know Phase 1 is complete when:**
1. You can ask: *"What is the average negotiated rate for CPT 99214?"*
2. Claude queries the real TiC table in Snowflake
3. Returns actual data: *"The average negotiated rate is $185, ranging from $142 to $220 across 45 payers"*
4. Response appears in the chat interface in diagram-test.html

---

## Phase 2: Add More Data Sources (2-3 weeks)

### Goals
- Implement remaining MCP tools
- Add provider, claims, and employer data queries
- Enable cross-dataset queries
- Implement caching layer

### Key Tasks
1. **Create Provider Query Tool**
   - Query NPPES data by NPI
   - Search by specialty/location
   - Link to Hospital Transparency pricing

2. **Create Claims Query Tool**
   - Query claims data for volume/pricing
   - Calculate spread pricing
   - Compare payer performance

3. **Create Employer Query Tool**
   - Look up self-insured plans
   - Show TPA relationships
   - Calculate aggregate spend

4. **Implement Query Caching**
   - Redis or in-memory cache
   - Cache common queries (CPT code aggregates)
   - TTL based on data refresh schedule

5. **Add Query Builder UI**
   - Dropdown filters in data panel
   - Pre-built query templates
   - "Export to CSV" functionality

---

## Phase 3: Advanced Features (4-6 weeks)

### Goals
- Multi-dataset joins and analysis
- Real-time data updates
- Advanced visualizations
- Cost optimization

### Key Features

1. **Cross-Dataset Analysis**
   ```python
   # Example: Join TiC + Claims + Quality
   "Show me hospitals with Leapfrog A rating,
    average hip replacement cost under $30K,
    and high claim volume in Texas"
   ```

2. **Data Visualizations**
   - Embed Chart.js in data panel
   - Pricing distribution histograms
   - Geographic heat maps
   - Time-series rate trends

3. **Query Optimization**
   - DuckDB for faster subset analysis
   - Materialized views for common queries
   - Query cost tracking (Snowflake credits)

4. **User Accounts & History**
   - Save favorite queries
   - Query history
   - Shared workspaces for teams

---

## Phase 4: Production Deployment (2-3 weeks)

### Goals
- Deploy to production infrastructure
- Implement security & monitoring
- Scale for multiple users

### Key Tasks

1. **Infrastructure**
   - Deploy MCP server to AWS/GCP
   - Set up load balancer
   - Configure auto-scaling

2. **Security**
   - OAuth authentication
   - Role-based access control (RBAC)
   - Audit logging for all queries
   - Rate limiting per user

3. **Monitoring**
   - Application metrics (Prometheus/Grafana)
   - Error tracking (Sentry)
   - Query performance monitoring
   - Cost tracking (Snowflake credits)

4. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - User guide for query writing
   - Video tutorials

---

## Cost Estimates

### Phase 1 (MVP)
- **Development Time**: 1-2 weeks (1 developer)
- **Infrastructure**: $0 (local testing)
- **Snowflake Credits**: ~$50-100/month (testing queries)
- **Claude API**: ~$20-50/month (testing)
- **Total**: ~$70-150/month

### Phase 2-4 (Production)
- **Development Time**: 8-12 weeks total
- **Infrastructure**: $200-500/month (AWS/GCP)
- **Snowflake Credits**: $500-2000/month (depends on query volume)
- **Claude API**: $200-1000/month (depends on user count)
- **Monitoring/Security**: $100-200/month
- **Total**: ~$1000-3700/month

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|------------|
| Query performance | Use DuckDB caching, materialized views |
| Snowflake costs | Query budgets, cost alerts, result caching |
| API rate limits (Claude) | Implement request queuing, fallback responses |
| Data freshness | Clear cache on data updates, show data timestamp |

### Security Risks
| Risk | Mitigation |
|------|------------|
| Unauthorized data access | API key auth (Phase 1), OAuth (Phase 3+) |
| SQL injection | Parameterized queries, input validation |
| Data exposure | Row-level security in Snowflake, RBAC |
| API abuse | Rate limiting, usage quotas |

---

## Next Steps After Phase 1

1. **Validate with Users**
   - Show working prototype to stakeholders
   - Get feedback on query UX
   - Identify most valuable queries

2. **Prioritize Phase 2 Tools**
   - Which data source is most requested?
   - Provider vs Claims vs Employer priority?

3. **Plan Production Architecture**
   - User authentication approach
   - Hosting infrastructure
   - Monitoring strategy

---

## Getting Started (Do This Now!)

```bash
# 1. Create MCP server structure
cd /Users/ryangertenbach/ps1
mkdir -p mcp-server/tools mcp-server/database

# 2. Set up Python environment
cd mcp-server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Create requirements.txt (see Step 1.2 above)
# Then install:
pip install -r requirements.txt

# 4. Create .env file with your Snowflake credentials (see Step 1.3)

# 5. Copy the code from Steps 1.4-1.6 into files

# 6. Test Snowflake connection
python3 -c "from database.snowflake_client import db_client; db_client.connect(); print('Connected!')"

# 7. Start MCP server
python server.py

# 8. Test with curl
curl -X POST http://localhost:3000/api/mcp/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"query": "What is the average rate for CPT 99214?"}'
```

**Ready to start? Let me know and I can help you create the initial files!**
