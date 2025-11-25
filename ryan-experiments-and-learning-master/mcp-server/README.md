# Payerset MCP Server - Phase 1

FastAPI server that exposes Payerset healthcare data through Claude AI using the Model Context Protocol (MCP).

## Quick Start

### 1. Set Up Environment

```bash
cd mcp-server

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Required Configuration**:
- `ANTHROPIC_API_KEY`: Your Claude API key from https://console.anthropic.com
- `SNOWFLAKE_USER`, `SNOWFLAKE_PASSWORD`, `SNOWFLAKE_ACCOUNT`: Your Snowflake credentials
- `API_KEY`: Generate a secure key for frontend authentication

### 3. Test Snowflake Connection

```bash
# Start Python shell
python

# Test connection
from database.snowflake_client import db_client
db_client.connect()
db_client.test_connection()  # Should return True
```

### 4. Start the Server

```bash
# Development mode (auto-reload)
python server.py

# Or using uvicorn directly
uvicorn server:app --host 0.0.0.0 --port 3000 --reload
```

Server will start at: `http://localhost:3000`

### 5. Test the API

**Health Check**:
```bash
curl http://localhost:3000/
```

**List Available Tools**:
```bash
curl http://localhost:3000/api/tools
```

**Test Snowflake Connection**:
```bash
curl -H "X-API-Key: your_api_key_here" \
  http://localhost:3000/api/test/snowflake
```

**Make a Query** (example):
```bash
curl -X POST http://localhost:3000/api/mcp/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "query": "What is the average negotiated rate for CPT code 99214?",
    "context": {}
  }'
```

## Project Structure

```
mcp-server/
├── server.py                  # Main FastAPI application
├── config.py                  # Configuration management
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (create from .env.example)
├── .env.example              # Example environment configuration
├── database/
│   ├── snowflake_client.py   # Snowflake connection manager
│   └── query_builder.py      # SQL query construction
└── tools/
    └── query_tic.py          # TiC data query tool (Phase 1)
```

## Available MCP Tools (Phase 1)

### 1. `query_tic_data`

Query Transparency in Coverage (TiC) negotiated rates data.

**Parameters**:
- `billing_code` (optional): CPT, DRG, or NDC code
- `payer` (optional): Insurance company name (partial match)
- `provider_npi` (optional): Provider NPI
- `min_rate` (optional): Minimum rate filter
- `max_rate` (optional): Maximum rate filter
- `aggregate` (optional, default false): Return statistics instead of records

**Example Queries**:
- "What is the average negotiated rate for CPT 99214?"
- "Show me pricing for hip replacement (DRG 470) at Cleveland Clinic"
- "Compare Blue Cross rates vs UnitedHealthcare for MRI"

## Integration with Frontend

Update your [diagram-test.html](../diagrams/diagram-test.html):

```javascript
// Replace mock response system with real API calls
async function sendQuery(query) {
    const response = await fetch('http://localhost:3000/api/mcp/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'your_api_key_here'  // Use environment variable in production
        },
        body: JSON.stringify({
            query: query,
            context: {
                selectedNode: selectedNode ? selectedNode.id() : null,
                currentLayer: currentLayer
            }
        })
    });

    const data = await response.json();

    // Display answer in chat
    addMessage(data.answer, 'assistant');

    // Optionally show raw data in table
    if (data.raw_data.length > 0) {
        displayDataTable(data.raw_data);
    }
}
```

## Testing

### Manual Testing

1. **Health Check**:
   ```bash
   curl http://localhost:3000/
   # Expected: {"service": "Payerset MCP Server", "status": "operational", ...}
   ```

2. **Snowflake Connection**:
   ```bash
   curl -H "X-API-Key: your_key" http://localhost:3000/api/test/snowflake
   # Expected: {"success": true, "database": "PAYERSET_DATA", ...}
   ```

3. **Simple Query**:
   ```bash
   curl -X POST http://localhost:3000/api/mcp/query \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_key" \
     -d '{"query": "List available tools"}'
   ```

4. **Data Query**:
   ```bash
   curl -X POST http://localhost:3000/api/mcp/query \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_key" \
     -d '{"query": "What is the average rate for CPT 99214?"}'
   ```

### Expected Behavior

When you query "What is the average negotiated rate for CPT 99214?":

1. Server receives request
2. Claude analyzes query and decides to use `query_tic_data` tool
3. Tool executes Snowflake query: `SELECT AVG(negotiated_rate) FROM TIC_NEGOTIATED_RATES WHERE billing_code = '99214'`
4. Results returned to Claude
5. Claude formats natural language response: "The average negotiated rate for CPT 99214 (Office Visit) is $185, ranging from $142 to $220 across 45 payers."
6. Response sent back to frontend

## Database Schema

This server expects the following Snowflake tables (Phase 1):

### `TIC_NEGOTIATED_RATES`
- `billing_code` (STRING): CPT, DRG, NDC code
- `billing_code_type` (STRING): CPT, DRG, NDC
- `billing_code_type_version` (STRING)
- `description` (STRING): Procedure/service description
- `negotiated_rate` (FLOAT): Agreed rate
- `negotiated_type` (STRING): Type of rate agreement
- `billing_class` (STRING)
- `npi` (STRING): Provider NPI
- `tin_value` (STRING): Provider TIN
- `payer` (STRING): Insurance company
- `plan_name` (STRING): Specific plan name

Future phases will add:
- `NPPES_PROVIDERS`: Provider directory
- `HOSPITAL_TRANSPARENCY`: Hospital pricing
- `CLAIMS_DATA`: Actual claims with spread pricing
- `EMPLOYER_PLANS`: Self-insured employer data

## Security

### API Key Authentication

The server uses a simple API key in the `X-API-Key` header. For production:

1. Use strong, randomly generated API keys
2. Rotate keys regularly
3. Consider JWT tokens for user-specific access
4. Implement rate limiting
5. Use HTTPS only

### CORS Configuration

Update `ALLOWED_ORIGINS` in `.env` to restrict which domains can access the API:

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## Troubleshooting

### "Configuration validation failed: ANTHROPIC_API_KEY is required"

- Ensure `.env` file exists in `mcp-server/` directory
- Check that `ANTHROPIC_API_KEY` is set correctly
- No quotes needed: `ANTHROPIC_API_KEY=sk-ant-...`

### "Failed to connect to Snowflake"

- Verify Snowflake credentials in `.env`
- Check account format: `account.region` (e.g., `xy12345.us-east-1`)
- Test credentials using Snowflake's web UI
- Ensure warehouse is running

### "Invalid API key" (401 error)

- Include `X-API-Key` header in all requests
- Ensure key matches value in `.env`
- If testing without security, set `API_KEY=` (empty) in `.env`

### Claude returns "I don't have access to real data"

- Check Claude is receiving MCP tools in request
- Verify tool execution doesn't error (check logs)
- Ensure Snowflake query returns results
- Review server logs for tool execution details

## Development Tips

### Enable Debug Logging

Set in `.env`:
```bash
LOG_LEVEL=DEBUG
```

### Test Without Snowflake

For development without Snowflake access:

```bash
USE_DUCKDB_FALLBACK=true
DUCKDB_PATH=./data/test.db
```

Then modify tool to use sample data from `/diagrams/data/` JSON files.

### Add New Tools

1. Create new file in `tools/` (e.g., `query_providers.py`)
2. Define tool class with `name`, `description`, `input_schema`
3. Implement `execute(**kwargs)` method
4. Register in `server.py`:
   ```python
   from tools.query_providers import provider_query_tool

   MCP_TOOLS.append({
       "name": provider_query_tool.name,
       "description": provider_query_tool.description,
       "input_schema": provider_query_tool.input_schema
   })
   ```
5. Add tool execution handler in `process_query` route

## Next Steps (Future Phases)

**Phase 2**: Add remaining data source tools
- [ ] `query_providers` - NPPES and hospital data
- [ ] `query_claims` - Claims with spread analysis
- [ ] `query_employers` - Employer plan data

**Phase 3**: Enhanced features
- [ ] Multi-tool queries (combine data sources)
- [ ] Caching layer for common queries
- [ ] Query history and analytics
- [ ] User authentication and authorization

**Phase 4**: Production deployment
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting
- [ ] Auto-scaling configuration
- [ ] Cost optimization

## Support

For questions or issues:
1. Check server logs: `tail -f server.log` (if configured)
2. Review [MCP Implementation Plan](../diagrams/MCP-IMPLEMENTATION-PLAN.md)
3. Test with curl commands above
4. Verify Snowflake queries work directly

## License

Internal Payerset project - not for public distribution.
