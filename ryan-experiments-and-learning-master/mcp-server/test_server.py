"""
Test Script for MCP Server
Run this to verify server components work correctly
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    try:
        import config
        print("✓ config module loaded")

        from database.snowflake_client import db_client
        print("✓ snowflake_client module loaded")

        from database.query_builder import QueryBuilder
        print("✓ query_builder module loaded")

        from tools.query_tic import tic_query_tool
        print("✓ query_tic module loaded")

        return True
    except Exception as e:
        print(f"✗ Import failed: {str(e)}")
        return False

def test_config():
    """Test configuration loading"""
    print("\nTesting configuration...")
    try:
        from config import settings

        print(f"✓ Snowflake Database: {settings.SNOWFLAKE_DATABASE}")
        print(f"✓ Snowflake Schema: {settings.SNOWFLAKE_SCHEMA}")
        print(f"✓ Anthropic API Key: {'[SET]' if settings.ANTHROPIC_API_KEY else '[NOT SET]'}")
        print(f"✓ API Key: {'[SET]' if settings.API_KEY else '[NOT SET - API unprotected!]'}")
        print(f"✓ Allowed Origins: {settings.ALLOWED_ORIGINS}")
        print(f"✓ DuckDB Fallback: {settings.USE_DUCKDB_FALLBACK}")

        return True
    except Exception as e:
        print(f"✗ Config test failed: {str(e)}")
        return False

def test_query_builder():
    """Test SQL query building"""
    print("\nTesting query builder...")
    try:
        from database.query_builder import QueryBuilder

        # Test TiC query
        query = QueryBuilder.build_tic_query(
            billing_code="99214",
            aggregate=True
        )
        print("✓ TiC aggregate query built:")
        print(f"  {query[:100]}...")

        # Test provider query
        query = QueryBuilder.build_provider_query(
            state="OH",
            leapfrog_grade="A"
        )
        print("✓ Provider query built:")
        print(f"  {query[:100]}...")

        # Test claims query
        query = QueryBuilder.build_claims_query(
            payer="Blue Cross",
            show_spread=True
        )
        print("✓ Claims query built:")
        print(f"  {query[:100]}...")

        return True
    except Exception as e:
        print(f"✗ Query builder test failed: {str(e)}")
        return False

def test_snowflake_connection():
    """Test Snowflake connection (requires credentials)"""
    print("\nTesting Snowflake connection...")
    try:
        from database.snowflake_client import db_client
        from config import settings

        if settings.USE_DUCKDB_FALLBACK:
            print("⊘ Skipping - DuckDB fallback mode enabled")
            return True

        print("Attempting to connect...")
        db_client.connect()
        print("✓ Connected to Snowflake")

        print("Testing query execution...")
        result = db_client.test_connection()

        if result:
            print("✓ Snowflake connection test passed")
            db_client.disconnect()
            return True
        else:
            print("✗ Snowflake connection test failed")
            return False

    except Exception as e:
        print(f"✗ Snowflake connection failed: {str(e)}")
        print("  → Check your .env file has correct Snowflake credentials")
        return False

def test_tool_schema():
    """Test MCP tool schemas"""
    print("\nTesting MCP tool schemas...")
    try:
        from tools.query_tic import tic_query_tool

        print(f"✓ Tool name: {tic_query_tool.name}")
        print(f"✓ Tool description: {tic_query_tool.description[:80]}...")
        print(f"✓ Tool schema properties: {list(tic_query_tool.input_schema['properties'].keys())}")

        # Test tool execution with mock data (will fail without Snowflake, but tests structure)
        print("Testing tool structure...")
        assert hasattr(tic_query_tool, 'execute'), "Tool must have execute method"
        print("✓ Tool has execute method")

        return True
    except Exception as e:
        print(f"✗ Tool schema test failed: {str(e)}")
        return False

def test_server_startup():
    """Test that server can start (doesn't actually start it)"""
    print("\nTesting server configuration...")
    try:
        from server import app, MCP_TOOLS

        print(f"✓ FastAPI app created: {app.title}")
        print(f"✓ MCP tools registered: {len(MCP_TOOLS)}")

        for tool in MCP_TOOLS:
            print(f"  - {tool['name']}")

        return True
    except Exception as e:
        print(f"✗ Server startup test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Payerset MCP Server - Test Suite")
    print("=" * 60)

    tests = [
        ("Imports", test_imports),
        ("Configuration", test_config),
        ("Query Builder", test_query_builder),
        ("Tool Schemas", test_tool_schema),
        ("Server Startup", test_server_startup),
        ("Snowflake Connection", test_snowflake_connection),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
        except Exception as e:
            print(f"\n✗ {test_name} crashed: {str(e)}")
            results.append((test_name, False))

    print("\n" + "=" * 60)
    print("Test Results")
    print("=" * 60)

    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status} - {test_name}")

    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)

    print(f"\n{passed_count}/{total_count} tests passed")

    if passed_count == total_count:
        print("\n🎉 All tests passed! Server is ready to start.")
        print("\nNext steps:")
        print("1. Ensure .env file is configured with real credentials")
        print("2. Start server: python server.py")
        print("3. Test endpoints: curl http://localhost:3000/")
    else:
        print("\n⚠️  Some tests failed. Review errors above.")
        print("\nCommon issues:")
        print("- Missing .env file (copy from .env.example)")
        print("- Invalid Snowflake credentials")
        print("- Missing ANTHROPIC_API_KEY")

    return passed_count == total_count

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
