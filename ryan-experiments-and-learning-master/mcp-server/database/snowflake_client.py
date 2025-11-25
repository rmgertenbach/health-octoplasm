"""
Snowflake Database Client
Handles connections and queries to Snowflake data warehouse
"""
import logging
from typing import Dict, List, Any, Optional
import snowflake.connector
from snowflake.connector import DictCursor
from config import settings

logger = logging.getLogger(__name__)

class SnowflakeClient:
    """Client for querying Payerset data in Snowflake"""

    def __init__(self):
        self.conn = None
        self.connected = False

    def connect(self):
        """Establish connection to Snowflake"""
        try:
            logger.info(f"Connecting to Snowflake account: {settings.SNOWFLAKE_ACCOUNT}")

            self.conn = snowflake.connector.connect(
                user=settings.SNOWFLAKE_USER,
                password=settings.SNOWFLAKE_PASSWORD,
                account=settings.SNOWFLAKE_ACCOUNT,
                warehouse=settings.SNOWFLAKE_WAREHOUSE,
                database=settings.SNOWFLAKE_DATABASE,
                schema=settings.SNOWFLAKE_SCHEMA
            )

            self.connected = True
            logger.info("Successfully connected to Snowflake")

        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {str(e)}")
            raise

    def disconnect(self):
        """Close Snowflake connection"""
        if self.conn:
            self.conn.close()
            self.connected = False
            logger.info("Disconnected from Snowflake")

    def execute_query(
        self,
        query: str,
        params: Optional[Dict[str, Any]] = None,
        limit: Optional[int] = 1000
    ) -> List[Dict[str, Any]]:
        """
        Execute a query and return results as list of dictionaries

        Args:
            query: SQL query string
            params: Optional parameters for query (for parameterized queries)
            limit: Maximum number of rows to return (default 1000)

        Returns:
            List of dictionaries, each representing a row
        """
        if not self.connected:
            self.connect()

        try:
            # Add LIMIT clause if not present and limit is specified
            if limit and "LIMIT" not in query.upper():
                query = f"{query.rstrip(';')} LIMIT {limit}"

            logger.info(f"Executing query: {query[:200]}...")  # Log first 200 chars

            cursor = self.conn.cursor(DictCursor)

            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            results = cursor.fetchall()
            cursor.close()

            logger.info(f"Query returned {len(results)} rows")
            return results

        except Exception as e:
            logger.error(f"Query execution failed: {str(e)}")
            raise

    def get_table_schema(self, table_name: str) -> List[Dict[str, Any]]:
        """
        Get schema information for a table

        Args:
            table_name: Name of the table

        Returns:
            List of column definitions with name, type, nullable, etc.
        """
        query = f"""
        SELECT
            COLUMN_NAME,
            DATA_TYPE,
            IS_NULLABLE,
            COLUMN_DEFAULT,
            CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '{settings.SNOWFLAKE_SCHEMA}'
          AND TABLE_NAME = '{table_name}'
        ORDER BY ORDINAL_POSITION
        """

        return self.execute_query(query, limit=None)

    def test_connection(self) -> bool:
        """
        Test the Snowflake connection

        Returns:
            True if connection is successful, False otherwise
        """
        try:
            result = self.execute_query("SELECT CURRENT_VERSION()", limit=1)
            logger.info(f"Snowflake version: {result[0] if result else 'Unknown'}")
            return True
        except Exception as e:
            logger.error(f"Connection test failed: {str(e)}")
            return False

# Global client instance
db_client = SnowflakeClient()
