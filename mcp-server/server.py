"""
MCP Server - Phase 1
FastAPI server that exposes Payerset data via Claude + MCP tools
"""
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic

from config import settings, validate_config
from database.snowflake_client import db_client
from tools.query_tic import tic_query_tool

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Validate configuration on startup
try:
    validate_config()
    logger.info("Configuration validated successfully")
except Exception as e:
    logger.error(f"Configuration validation failed: {str(e)}")
    raise

# Initialize FastAPI app
app = FastAPI(
    title="Payerset MCP Server",
    description="Model Context Protocol server for Payerset healthcare data",
    version="0.1.0 (Phase 1)"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
claude_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

# MCP Tools Registry
MCP_TOOLS = [
    {
        "name": tic_query_tool.name,
        "description": tic_query_tool.description,
        "input_schema": tic_query_tool.input_schema
    }
]

# Pydantic models
class QueryRequest(BaseModel):
    """Request model for natural language queries"""
    query: str
    context: Dict[str, Any] = {}

class QueryResponse(BaseModel):
    """Response model for query results"""
    answer: str
    tool_calls: List[Dict[str, Any]] = []
    raw_data: List[Dict[str, Any]] = []

# Security dependency
async def verify_api_key(x_api_key: str = Header(None)):
    """Verify API key if configured"""
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

# Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Payerset MCP Server",
        "version": "0.1.0 (Phase 1)",
        "status": "operational",
        "tools_available": len(MCP_TOOLS)
    }

@app.get("/api/tools")
async def list_tools():
    """List available MCP tools"""
    return {
        "tools": MCP_TOOLS,
        "count": len(MCP_TOOLS)
    }

@app.post("/api/mcp/query", response_model=QueryResponse)
async def process_query(
    request: QueryRequest,
    authenticated: bool = Depends(verify_api_key)
):
    """
    Process natural language query using Claude + MCP tools

    This endpoint:
    1. Receives user's natural language query
    2. Passes query to Claude with available MCP tools
    3. Claude decides which tools to use and calls them
    4. Executes tool calls against Snowflake
    5. Returns Claude's natural language response with data
    """
    try:
        logger.info(f"Processing query: {request.query[:100]}...")

        # Prepare system message with context
        system_message = """You are a healthcare data analyst assistant with access to Payerset's comprehensive healthcare pricing database.

Available data sources:
- TiC (Transparency in Coverage): Negotiated rates between payers and providers
- Hospital Transparency: Facility pricing and quality metrics
- Claims Data: Actual payments and spread pricing analysis
- NPPES: National provider directory
- Employer Plans: Self-insured employer healthcare data

When answering queries:
1. Use the appropriate tools to fetch real data
2. Provide specific numbers, not generalizations
3. Explain healthcare terminology when relevant
4. Cite data sources in your response
5. If data is not available, say so clearly

Current context: """ + str(request.context)

        # Initial Claude API call
        messages = [{"role": "user", "content": request.query}]

        response = claude_client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            system=system_message,
            messages=messages,
            tools=MCP_TOOLS
        )

        tool_calls_made = []
        raw_data_collected = []

        # Process tool calls
        while response.stop_reason == "tool_use":
            # Extract tool calls
            tool_uses = [block for block in response.content if block.type == "tool_use"]

            for tool_use in tool_uses:
                tool_name = tool_use.name
                tool_input = tool_use.input

                logger.info(f"Claude is calling tool: {tool_name} with input: {tool_input}")

                # Execute tool
                if tool_name == tic_query_tool.name:
                    tool_result = tic_query_tool.execute(**tool_input)
                else:
                    tool_result = {"error": f"Unknown tool: {tool_name}"}

                tool_calls_made.append({
                    "tool": tool_name,
                    "input": tool_input,
                    "result_summary": tool_result.get("summary", "")
                })

                if tool_result.get("success"):
                    raw_data_collected.extend(tool_result.get("results", []))

                # Continue conversation with tool result
                messages.append({"role": "assistant", "content": response.content})
                messages.append({
                    "role": "user",
                    "content": [{
                        "type": "tool_result",
                        "tool_use_id": tool_use.id,
                        "content": str(tool_result)
                    }]
                })

            # Get Claude's next response
            response = claude_client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                system=system_message,
                messages=messages,
                tools=MCP_TOOLS
            )

        # Extract final text response
        final_answer = ""
        for block in response.content:
            if hasattr(block, "text"):
                final_answer += block.text

        logger.info(f"Query completed. Made {len(tool_calls_made)} tool calls, returned {len(raw_data_collected)} data records")

        return QueryResponse(
            answer=final_answer,
            tool_calls=tool_calls_made,
            raw_data=raw_data_collected[:50]  # Limit to first 50 records for response size
        )

    except Exception as e:
        logger.error(f"Query processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test/snowflake")
async def test_snowflake(authenticated: bool = Depends(verify_api_key)):
    """Test Snowflake connection"""
    try:
        if not db_client.connected:
            db_client.connect()

        is_connected = db_client.test_connection()

        return {
            "success": is_connected,
            "database": settings.SNOWFLAKE_DATABASE,
            "schema": settings.SNOWFLAKE_SCHEMA
        }
    except Exception as e:
        logger.error(f"Snowflake test failed: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

# Startup/Shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup"""
    logger.info("Starting Payerset MCP Server...")

    if not settings.USE_DUCKDB_FALLBACK:
        try:
            db_client.connect()
            logger.info("Snowflake connection established")
        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {str(e)}")
            logger.warning("Server starting without database connection")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up connections on shutdown"""
    logger.info("Shutting down Payerset MCP Server...")

    if db_client.connected:
        db_client.disconnect()
        logger.info("Snowflake connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=3000,
        reload=True,
        log_level=settings.LOG_LEVEL.lower()
    )
