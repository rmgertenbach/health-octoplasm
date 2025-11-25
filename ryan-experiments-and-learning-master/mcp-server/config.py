"""
MCP Server Configuration
Loads environment variables and provides configuration settings
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Snowflake Configuration
    SNOWFLAKE_USER: str = os.getenv("SNOWFLAKE_USER", "")
    SNOWFLAKE_PASSWORD: str = os.getenv("SNOWFLAKE_PASSWORD", "")
    SNOWFLAKE_ACCOUNT: str = os.getenv("SNOWFLAKE_ACCOUNT", "")
    SNOWFLAKE_WAREHOUSE: str = os.getenv("SNOWFLAKE_WAREHOUSE", "COMPUTE_WH")
    SNOWFLAKE_DATABASE: str = os.getenv("SNOWFLAKE_DATABASE", "PAYERSET_DATA")
    SNOWFLAKE_SCHEMA: str = os.getenv("SNOWFLAKE_SCHEMA", "PUBLIC")

    # Anthropic Configuration
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Server Configuration
    API_KEY: str = os.getenv("API_KEY", "")
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:8080"
    ).split(",")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Optional - DuckDB fallback for local testing
    USE_DUCKDB_FALLBACK: bool = os.getenv("USE_DUCKDB_FALLBACK", "false").lower() == "true"
    DUCKDB_PATH: str = os.getenv("DUCKDB_PATH", "./data/local.db")

    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

# Validate required settings
def validate_config():
    """Validate that required configuration is present"""
    if not settings.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY is required")

    if not settings.USE_DUCKDB_FALLBACK:
        if not settings.SNOWFLAKE_USER or not settings.SNOWFLAKE_PASSWORD:
            raise ValueError("Snowflake credentials are required when USE_DUCKDB_FALLBACK=false")

    if not settings.API_KEY:
        print("WARNING: API_KEY not set - API will be unprotected!")

    return True
