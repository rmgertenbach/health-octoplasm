# Getting Started with Payerset MCP Server

This guide will walk you through setting up and running the MCP server, then connecting it to the interactive Data Explorer frontend.

## Prerequisites

- Python 3.9 or higher
- Snowflake account with Payerset data access
- Anthropic Claude API key ([Get one here](https://console.anthropic.com))
- Terminal/command line access

## Step-by-Step Setup

### Step 1: Navigate to MCP Server Directory

```bash
cd /Users/ryangertenbach/ps1/mcp-server
```

### Step 2: Create Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate it (Mac/Linux)
source venv/bin/activate

# On Windows, use:
# venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt

# This will install:
# - FastAPI and Uvicorn (web server)
# - Snowflake connector
# - Anthropic SDK
# - Other utilities
```

Expected output: Successfully installed 15+ packages

### Step 4: Create Environment Configuration

```bash
# Copy example file
cp .env.example .env

# Edit with your preferred editor
nano .env
# or
code .env  # if using VS Code
# or
open -a TextEdit .env  # on Mac
```

**Fill in your credentials:**

```bash
# Snowflake Configuration
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ACCOUNT=xy12345.us-east-1  # Your account.region
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=PAYERSET_DATA
SNOWFLAKE_SCHEMA=PUBLIC

# Anthropic Claude API Key
ANTHROPIC_API_KEY=sk-ant-api03-...  # Your API key from console.anthropic.com

# Server Security (generate a random string)
API_KEY=your_secure_random_key_here_12345

# CORS Settings (leave default for local development)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080
LOG_LEVEL=INFO
```

**How to get your Snowflake account identifier:**
- Log into Snowflake web UI
- Look at URL: `https://xyz12345.us-east-1.snowflakecomputing.com/`
- Your account is: `xyz12345.us-east-1`

### Step 5: Test Your Setup

```bash
# Run test suite
python test_server.py
```

**Expected output:**
```
============================================================
Payerset MCP Server - Test Suite
============================================================

Testing imports...
✓ config module loaded
✓ snowflake_client module loaded
✓ query_builder module loaded
✓ query_tic module loaded

Testing configuration...
✓ Snowflake Database: PAYERSET_DATA
✓ Snowflake Schema: PUBLIC
✓ Anthropic API Key: [SET]
✓ API Key: [SET]
...

Testing Snowflake connection...
Attempting to connect...
✓ Connected to Snowflake
✓ Snowflake connection test passed

============================================================
Test Results
============================================================
✓ PASS - Imports
✓ PASS - Configuration
✓ PASS - Query Builder
✓ PASS - Tool Schemas
✓ PASS - Server Startup
✓ PASS - Snowflake Connection

6/6 tests passed

🎉 All tests passed! Server is ready to start.
```

**If tests fail:**
- Check `.env` credentials are correct
- Verify Snowflake account is active
- Confirm API key is valid
- Review error messages for specific issues

### Step 6: Start the MCP Server

```bash
# Start server (development mode with auto-reload)
python server.py

# Or using uvicorn directly:
# uvicorn server:app --host 0.0.0.0 --port 3000 --reload
```

**Expected output:**
```
INFO:     Will watch for changes in these directories: ['/Users/ryangertenbach/ps1/mcp-server']
INFO:     Uvicorn running on http://0.0.0.0:3000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Connecting to Snowflake account: xyz12345.us-east-1
INFO:     Successfully connected to Snowflake
INFO:     Application startup complete.
```

**Server is now running at:** `http://localhost:3000`

**Keep this terminal window open** - the server must be running for the frontend to work.

### Step 7: Test the API

Open a **new terminal window** and test the endpoints:

**Test 1: Health Check**
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "service": "Payerset MCP Server",
  "version": "0.1.0 (Phase 1)",
  "status": "operational",
  "tools_available": 1
}
```

**Test 2: List Available Tools**
```bash
curl http://localhost:3000/api/tools
```

Expected response:
```json
{
  "tools": [
    {
      "name": "query_tic_data",
      "description": "Query Transparency in Coverage (TiC) dataset...",
      ...
    }
  ],
  "count": 1
}
```

**Test 3: Snowflake Connection**
```bash
curl -H "X-API-Key: your_secure_random_key_here_12345" \
  http://localhost:3000/api/test/snowflake
```

Expected response:
```json
{
  "success": true,
  "database": "PAYERSET_DATA",
  "schema": "PUBLIC"
}
```

**Test 4: Make a Real Query**
```bash
curl -X POST http://localhost:3000/api/mcp/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_random_key_here_12345" \
  -d '{
    "query": "What is the average negotiated rate for CPT code 99214?"
  }'
```

Expected response:
```json
{
  "answer": "Based on the TiC data, the average negotiated rate for CPT code 99214 (Office Visit, Established Patient) is $185.32. The rates range from $142.00 to $220.50 across 45 different payers. This code is commonly used for established patient office visits of moderate complexity.",
  "tool_calls": [
    {
      "tool": "query_tic_data",
      "input": {"billing_code": "99214", "aggregate": true},
      "result_summary": "Found 45 payers..."
    }
  ],
  "raw_data": [...]
}
```

If this works, **your MCP server is fully operational!**

## Step 8: Connect Frontend to MCP Server

Now let's update the Data Explorer to use real data instead of mock responses.

### Option A: Quick Test (Browser Console)

1. Open [http://localhost:8080/diagrams/diagram-test.html](http://localhost:8080/diagrams/diagram-test.html) (or wherever your frontend is running)
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Paste this code to test the API:

```javascript
async function testMCPServer() {
    const response = await fetch('http://localhost:3000/api/mcp/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'your_secure_random_key_here_12345'
        },
        body: JSON.stringify({
            query: 'What is the average negotiated rate for CPT 99214?'
        })
    });
    const data = await response.json();
    console.log(data);
}

testMCPServer();
```

If you see a response with real data, the connection works!

### Option B: Update diagram-test.html (Production Integration)

Find the `generateMockResponse()` function in [diagram-test.html](../diagrams/diagram-test.html) and replace it with:

```javascript
// NEW: Real MCP server integration
async function sendQueryToMCP(query) {
    try {
        const response = await fetch('http://localhost:3000/api/mcp/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'your_secure_random_key_here_12345'  // TODO: Use environment variable
            },
            body: JSON.stringify({
                query: query,
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
        return data.answer;

    } catch (error) {
        console.error('MCP query failed:', error);
        return `Sorry, I couldn't fetch that data. Error: ${error.message}. Make sure the MCP server is running at http://localhost:3000`;
    }
}

// Update sendQuery function to use real API
async function sendQuery() {
    const queryText = document.getElementById('queryInput').value.trim();
    if (!queryText) return;

    addMessage(queryText, 'user');
    document.getElementById('queryInput').value = '';

    // Show loading state
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant loading';
    loadingDiv.innerHTML = '<div class="message-content">Querying Payerset data...</div>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Query MCP server
    const response = await sendQueryToMCP(queryText);

    // Remove loading message
    chatMessages.removeChild(loadingDiv);

    // Add real response
    addMessage(response, 'assistant');
}
```

### Option C: Toggle Between Mock and Real Data

For development, you might want to easily switch between mock and real data:

```javascript
// At the top of diagram-test.html script section
const USE_REAL_MCP = true;  // Set to false to use mock data
const MCP_API_URL = 'http://localhost:3000/api/mcp/query';
const MCP_API_KEY = 'your_secure_random_key_here_12345';

// Then in sendQuery function:
async function sendQuery() {
    const queryText = document.getElementById('queryInput').value.trim();
    if (!queryText) return;

    addMessage(queryText, 'user');
    document.getElementById('queryInput').value = '';

    let response;
    if (USE_REAL_MCP) {
        response = await sendQueryToMCP(queryText);
    } else {
        response = generateMockResponse(queryText);
    }

    addMessage(response, 'assistant');
}
```

## Step 9: Test End-to-End

1. Ensure MCP server is running (`python server.py`)
2. Open Data Explorer in browser
3. Click on "EMPLOYERS" node
4. Click "Ask Questions About This Data"
5. Type: "Show employer healthcare spending data"
6. Hit Enter

**Expected behavior:**
- Query sent to MCP server
- Claude analyzes query with context
- Real data fetched from Snowflake
- Natural language response displayed

## Common Issues & Solutions

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:** Add your frontend URL to `.env`:
```bash
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000
```
Restart the server.

### Issue: "Connection refused" or "Failed to fetch"

**Solution:**
1. Verify server is running: `curl http://localhost:3000/`
2. Check server is on port 3000 (not 8080 or other)
3. Try `http://127.0.0.1:3000` instead of `localhost`

### Issue: "Invalid API key" (401 error)

**Solution:**
1. Check `X-API-Key` header matches `.env` value exactly
2. For quick testing, set `API_KEY=` (empty) in `.env` to disable auth
3. Restart server after changing `.env`

### Issue: Snowflake queries timeout or fail

**Solution:**
1. Check warehouse is running in Snowflake UI
2. Verify table names match your schema (see `query_builder.py`)
3. Test query directly in Snowflake first
4. Check Snowflake credentials haven't expired

### Issue: Claude returns generic responses without data

**Solution:**
1. Check server logs for tool execution
2. Verify tool is being called: Look for "Claude is calling tool" in logs
3. Ensure Snowflake query returns data
4. Try more specific queries: "What is the average negotiated rate for CPT 99214?"

## Next Steps

Now that Phase 1 is running:

### Immediate Enhancements
1. Add authentication for multi-user access
2. Implement query caching to reduce costs
3. Add data visualization for query results
4. Create query history feature

### Phase 2 Tools (see [MCP Implementation Plan](../diagrams/MCP-IMPLEMENTATION-PLAN.md))
1. `query_providers` - Provider and hospital data
2. `query_claims` - Claims with spread analysis
3. `query_employers` - Employer plan information

### Production Deployment
1. Containerize with Docker
2. Deploy to cloud (AWS, GCP, Azure)
3. Set up CI/CD pipeline
4. Configure monitoring and alerts
5. Implement rate limiting

## Cost Monitoring

Keep track of usage to manage costs:

**Snowflake:**
- Monitor warehouse usage in Snowflake UI
- Set up automatic suspension when idle
- Use query history to identify expensive queries

**Claude API:**
- Track token usage in logs
- Implement caching for common queries
- Set up monthly budget alerts in Anthropic Console

**Estimated Phase 1 Costs:**
- Snowflake: $20-50/month (with XS warehouse)
- Claude API: $10-30/month (moderate usage)
- Total: ~$30-80/month for testing

## Support Resources

- **MCP Server Code**: `/Users/ryangertenbach/ps1/mcp-server/`
- **Implementation Plan**: `/Users/ryangertenbach/ps1/diagrams/MCP-IMPLEMENTATION-PLAN.md`
- **Sample Data**: `/Users/ryangertenbach/ps1/diagrams/data/`
- **Anthropic Docs**: https://docs.anthropic.com/claude/docs/tool-use
- **MCP Protocol**: https://modelcontextprotocol.io

## Success Checklist

- [ ] Python environment created and activated
- [ ] Dependencies installed successfully
- [ ] `.env` file created with valid credentials
- [ ] Test suite passes (6/6 tests)
- [ ] Server starts without errors
- [ ] Health check returns 200 OK
- [ ] Snowflake connection test passes
- [ ] Sample query returns real data
- [ ] Frontend can connect to API
- [ ] End-to-end test works (browser → server → Snowflake → Claude → browser)

---

**Congratulations!** You now have a working MCP server that connects your interactive Data Explorer to real Payerset healthcare data through Claude AI.
