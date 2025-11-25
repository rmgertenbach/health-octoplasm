"""
SQL Query Builder
Constructs safe, parameterized SQL queries for different data sources
"""
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class QueryBuilder:
    """Helper class to build SQL queries safely"""

    @staticmethod
    def build_tic_query(
        billing_code: Optional[str] = None,
        payer: Optional[str] = None,
        provider_npi: Optional[str] = None,
        min_rate: Optional[float] = None,
        max_rate: Optional[float] = None,
        aggregate: bool = False
    ) -> str:
        """
        Build query for Transparency in Coverage (TiC) data

        Args:
            billing_code: CPT, DRG, or NDC code
            payer: Payer/insurance company name
            provider_npi: Provider NPI
            min_rate: Minimum negotiated rate
            max_rate: Maximum negotiated rate
            aggregate: If True, return aggregated stats

        Returns:
            SQL query string
        """

        if aggregate:
            query = """
            SELECT
                billing_code,
                billing_code_type,
                COUNT(DISTINCT npi) as provider_count,
                COUNT(DISTINCT payer) as payer_count,
                AVG(negotiated_rate) as avg_rate,
                MIN(negotiated_rate) as min_rate,
                MAX(negotiated_rate) as max_rate,
                STDDEV(negotiated_rate) as rate_stddev
            FROM TIC_NEGOTIATED_RATES
            WHERE 1=1
            """
        else:
            query = """
            SELECT
                billing_code,
                billing_code_type,
                billing_code_type_version,
                description,
                negotiated_rate,
                negotiated_type,
                billing_class,
                npi,
                tin_value,
                payer,
                plan_name
            FROM TIC_NEGOTIATED_RATES
            WHERE 1=1
            """

        # Add filters
        conditions = []

        if billing_code:
            conditions.append(f"AND billing_code = '{billing_code}'")

        if payer:
            conditions.append(f"AND LOWER(payer) LIKE LOWER('%{payer}%')")

        if provider_npi:
            conditions.append(f"AND npi = '{provider_npi}'")

        if min_rate is not None:
            conditions.append(f"AND negotiated_rate >= {min_rate}")

        if max_rate is not None:
            conditions.append(f"AND negotiated_rate <= {max_rate}")

        query += " " + " ".join(conditions)

        if aggregate:
            query += "\nGROUP BY billing_code, billing_code_type"

        query += "\nORDER BY billing_code"

        return query

    @staticmethod
    def build_provider_query(
        npi: Optional[str] = None,
        hospital_name: Optional[str] = None,
        taxonomy_code: Optional[str] = None,
        leapfrog_grade: Optional[str] = None,
        state: Optional[str] = None
    ) -> str:
        """
        Build query for provider/hospital data

        Args:
            npi: National Provider Identifier
            hospital_name: Hospital or provider name
            taxonomy_code: NUCC taxonomy classification
            leapfrog_grade: Quality grade (A, B, C, D, F)
            state: State code (e.g., 'OH', 'TX')

        Returns:
            SQL query string
        """

        query = """
        SELECT
            p.npi,
            p.provider_name,
            p.entity_type,
            p.taxonomy_code,
            t.grouping as taxonomy_grouping,
            t.classification as taxonomy_classification,
            p.address_line1,
            p.city,
            p.state,
            p.zip_code,
            h.hospital_id,
            h.system_affiliation,
            h.leapfrog_grade,
            h.bed_count
        FROM NPPES_PROVIDERS p
        LEFT JOIN NUCC_TAXONOMY t ON p.taxonomy_code = t.code
        LEFT JOIN HOSPITAL_TRANSPARENCY h ON p.npi = h.npi
        WHERE 1=1
        """

        conditions = []

        if npi:
            conditions.append(f"AND p.npi = '{npi}'")

        if hospital_name:
            conditions.append(f"AND LOWER(p.provider_name) LIKE LOWER('%{hospital_name}%')")

        if taxonomy_code:
            conditions.append(f"AND p.taxonomy_code = '{taxonomy_code}'")

        if leapfrog_grade:
            conditions.append(f"AND h.leapfrog_grade = '{leapfrog_grade.upper()}'")

        if state:
            conditions.append(f"AND p.state = '{state.upper()}'")

        query += " " + " ".join(conditions)
        query += "\nORDER BY p.provider_name"

        return query

    @staticmethod
    def build_claims_query(
        payer: Optional[str] = None,
        billing_code: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        show_spread: bool = True
    ) -> str:
        """
        Build query for claims data with spread pricing analysis

        Args:
            payer: Payer name
            billing_code: Procedure/drug code
            date_from: Start date (YYYY-MM-DD)
            date_to: End date (YYYY-MM-DD)
            show_spread: Include spread pricing calculations

        Returns:
            SQL query string
        """

        if show_spread:
            query = """
            SELECT
                billing_code,
                description,
                payer,
                tpa,
                npi,
                AVG(charged_amount) as avg_charged,
                AVG(allowed_amount) as avg_allowed,
                AVG(paid_amount) as avg_paid,
                AVG(remit_amount) as avg_remit_to_provider,
                AVG(allowed_amount - remit_amount) as avg_spread,
                AVG((allowed_amount - remit_amount) / NULLIF(allowed_amount, 0) * 100) as avg_spread_percentage,
                COUNT(*) as claim_count
            FROM CLAIMS_DATA
            WHERE 1=1
            """
        else:
            query = """
            SELECT
                claim_id,
                billing_code,
                description,
                payer,
                tpa,
                npi,
                service_date,
                charged_amount,
                allowed_amount,
                paid_amount,
                remit_amount
            FROM CLAIMS_DATA
            WHERE 1=1
            """

        conditions = []

        if payer:
            conditions.append(f"AND LOWER(payer) LIKE LOWER('%{payer}%')")

        if billing_code:
            conditions.append(f"AND billing_code = '{billing_code}'")

        if date_from:
            conditions.append(f"AND service_date >= '{date_from}'")

        if date_to:
            conditions.append(f"AND service_date <= '{date_to}'")

        query += " " + " ".join(conditions)

        if show_spread:
            query += "\nGROUP BY billing_code, description, payer, tpa, npi"
            query += "\nHAVING AVG(allowed_amount - remit_amount) > 0"

        query += "\nORDER BY billing_code"

        return query

    @staticmethod
    def build_employer_query(
        ein: Optional[str] = None,
        plan_name: Optional[str] = None,
        payer: Optional[str] = None,
        min_covered_lives: Optional[int] = None
    ) -> str:
        """
        Build query for employer data

        Args:
            ein: Employer Identification Number
            plan_name: Reporting plan name
            payer: Associated payer/TPA
            min_covered_lives: Minimum covered lives filter

        Returns:
            SQL query string
        """

        query = """
        SELECT
            ein,
            reporting_plan_name,
            payer,
            tpa,
            plan_type,
            covered_lives_estimate,
            annual_spend_estimate,
            fiduciary_status,
            industry_vertical,
            state
        FROM EMPLOYER_PLANS
        WHERE 1=1
        """

        conditions = []

        if ein:
            conditions.append(f"AND ein = '{ein}'")

        if plan_name:
            conditions.append(f"AND LOWER(reporting_plan_name) LIKE LOWER('%{plan_name}%')")

        if payer:
            conditions.append(f"AND LOWER(payer) LIKE LOWER('%{payer}%')")

        if min_covered_lives:
            conditions.append(f"AND covered_lives_estimate >= {min_covered_lives}")

        query += " " + " ".join(conditions)
        query += "\nORDER BY covered_lives_estimate DESC"

        return query
