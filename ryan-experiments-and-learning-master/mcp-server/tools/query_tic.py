"""
TiC Query Tool
MCP tool for querying Transparency in Coverage (TiC) data
"""
import logging
from typing import Dict, Any, Optional
from database.snowflake_client import db_client
from database.query_builder import QueryBuilder

logger = logging.getLogger(__name__)

class TiCQueryTool:
    """Tool for querying TiC negotiated rates data"""

    name = "query_tic_data"
    description = """Query Transparency in Coverage (TiC) dataset for negotiated rates between payers and providers.

    This tool accesses Payerset's TiC database containing:
    - Negotiated rates for medical procedures (CPT, DRG codes)
    - Drug pricing (NDC codes)
    - Payer-provider rate agreements
    - Geographic pricing variations

    Use this tool to:
    - Look up negotiated rates for specific billing codes
    - Compare rates across different payers
    - Analyze pricing for specific providers
    - Calculate average rates and price ranges
    """

    input_schema = {
        "type": "object",
        "properties": {
            "billing_code": {
                "type": "string",
                "description": "CPT, DRG, or NDC billing code (e.g., '99214', 'J0135')"
            },
            "payer": {
                "type": "string",
                "description": "Payer or insurance company name (partial match)"
            },
            "provider_npi": {
                "type": "string",
                "description": "Provider NPI to filter results"
            },
            "min_rate": {
                "type": "number",
                "description": "Minimum negotiated rate (dollar amount)"
            },
            "max_rate": {
                "type": "number",
                "description": "Maximum negotiated rate (dollar amount)"
            },
            "aggregate": {
                "type": "boolean",
                "description": "Return aggregated statistics (avg, min, max) instead of individual records",
                "default": False
            }
        },
        "required": []
    }

    @staticmethod
    def execute(**kwargs) -> Dict[str, Any]:
        """
        Execute TiC query with provided parameters

        Returns:
            Dict with 'success', 'results', 'row_count', and optional 'error'
        """
        try:
            # Extract parameters
            billing_code = kwargs.get('billing_code')
            payer = kwargs.get('payer')
            provider_npi = kwargs.get('provider_npi')
            min_rate = kwargs.get('min_rate')
            max_rate = kwargs.get('max_rate')
            aggregate = kwargs.get('aggregate', False)

            logger.info(f"Executing TiC query: billing_code={billing_code}, payer={payer}, aggregate={aggregate}")

            # Build query
            query = QueryBuilder.build_tic_query(
                billing_code=billing_code,
                payer=payer,
                provider_npi=provider_npi,
                min_rate=min_rate,
                max_rate=max_rate,
                aggregate=aggregate
            )

            # Execute query
            results = db_client.execute_query(query, limit=1000 if not aggregate else None)

            # Format response
            response = {
                "success": True,
                "results": results,
                "row_count": len(results),
                "query_type": "aggregate" if aggregate else "detail"
            }

            # Add human-readable summary
            if aggregate and results:
                result = results[0]
                response["summary"] = (
                    f"Found {result.get('PROVIDER_COUNT', 0)} providers and "
                    f"{result.get('PAYER_COUNT', 0)} payers for billing code {billing_code}. "
                    f"Average rate: ${result.get('AVG_RATE', 0):.2f}, "
                    f"Range: ${result.get('MIN_RATE', 0):.2f} - ${result.get('MAX_RATE', 0):.2f}"
                )
            elif results:
                response["summary"] = (
                    f"Found {len(results)} negotiated rate records. "
                    f"Use aggregate=true for statistical summary."
                )
            else:
                response["summary"] = "No results found for the given criteria."

            logger.info(f"TiC query returned {len(results)} rows")
            return response

        except Exception as e:
            logger.error(f"TiC query failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "results": [],
                "row_count": 0
            }

# Tool instance for registration
tic_query_tool = TiCQueryTool()
