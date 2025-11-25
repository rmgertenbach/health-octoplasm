# **Payerset Data Lake Master Inventory**

## **Comprehensive Guide to Current Data Assets & Schema Documentation**

**Purpose**: This document consolidates all current data assets in the Payerset data lake, organized by source type and use case. Use this as a reference for understanding what data exists, what it enables, and what gaps may need to be filled for various transparency solutions.

**Last Updated**: 2025-11-11

---

## **Table of Contents**

1. [Data Asset Overview](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#data-asset-overview)  
2. [Core Data Sources](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#core-data-sources)  
3. [Enrichment & Enhancement Layers](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#enrichment-enhancement-layers)  
4. [Product-Specific Datasets](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#product-specific-datasets)  
5. [Data Source Matrix by Stakeholder](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#data-source-matrix-by-stakeholder)  
6. [Known Gaps & Future Data Needs](https://claude.ai/chat/39ed36c5-48d1-4938-a3cb-60cc78c2cf27#known-gaps-future-data-needs)

---

## **Data Asset Overview**

### **Current State Summary**

**Primary Data Categories**:

1. **Payer Negotiated Rates** (from MRFs) \- Commercial insurance contracted rates  
2. **Hospital Published Prices** (from Hospital MRFs) \- Hospital standard charges & negotiated rates  
3. **Provider Information** (NPPES, NUCC) \- Provider demographics, locations, specializations  
4. **Medicare Rates** (CMS) \- Government-set payment benchmarks  
5. **Claims Intelligence** (Premium tier) \- Actual payment patterns and utilization  
6. **Payerset Enrichments** \- Proprietary categorizations, mappings, and standardizations

**Coverage**:

* Geographic: National (all 50 states \+ DC)  
* Payer Coverage: Major commercial payers via MRF mandates  
* Provider Coverage: All NPI-registered providers  
* Code Coverage: 21,000+ billing codes categorized

---

## **Core Data Sources**

### **1\. Payer Transparency (TiC \- Transparency in Coverage)**

**Source**: Commercial payer machine-readable files (MRFs) per CAA 2021 mandate  
 **Update Frequency**: Monthly  
 **Primary Use Cases**:

* Employer rate benchmarking  
* Network analysis  
* Direct contracting support  
* Spread pricing detection

#### **Schema: Payer Transparency (TiC)**

| Field Name | Description | Source | Data Type | Key Insights |
| ----- | ----- | ----- | ----- | ----- |
| **NPI** | National Provider Identifier | PAYER MRF | VARCHAR | Primary provider identifier |
| **TIN\_TYPE** | Tax ID type (EIN or NPI) | PAYER MRF | VARCHAR | Links to organization structure |
| **TIN\_VALUE** | Tax identification number | PAYER MRF | VARCHAR | Organization/practice identifier |
| **BILLING\_CODE** | Procedure code as published | PAYER MRF | VARCHAR | CPT, HCPCS, DRG, etc. |
| **BILLING\_CODE\_TYPE** | Code system (CPT, HCPCS, MS-DRG, etc.) | PAYER MRF | VARCHAR | Determines code interpretation |
| **BILLING\_CODE\_TYPE\_VERSION** | Version year (2023, 2024, etc.) | PAYER MRF | VARCHAR | Code currency indicator |
| **BILLING\_CODE\_MODIFIER** | Modifiers affecting rates (22-99, P1, etc.) | PAYER MRF | VARCHAR | Rate variation factors |
| **MRF\_BILLING\_CODE\_NAME** | Code description from MRF | PAYER MRF | VARCHAR | As-published description |
| **BILLING\_CLASS** | Institutional or Professional | PAYER MRF | VARCHAR | Claim type classifier |
| **NEGOTIATED\_RATE** | Contracted rate value | PAYER MRF | FLOAT | **Core pricing data** |
| **NEGOTIATED\_TYPE** | Rate type (fee schedule, percentage, per diem) | PAYER MRF | VARCHAR | Rate structure indicator |
| **NEGOTIATION\_ARRANGEMENT** | Fee-for-service (ffs) or Bundle | PAYER MRF | VARCHAR | Payment model |
| **SERVICE\_CODES** | Place of service codes (11, 21, 22, etc.) | PAYER MRF | VARCHAR | Setting of care |
| **EXPIRATION\_DATE** | Rate expiration date | PAYER MRF | VARCHAR | Rate currency |
| **ADDITIONAL\_INFORMATION** | Qualifiers, conditions on rate | PAYER MRF | VARCHAR | Rate applicability notes |
| **PLAN\_ID** | Payerset plan identifier | ADDED BY PAYERSET | VARCHAR | Links to PLAN\_MAP table |
| **PAYER** | Standardized payer name | ADDED BY PAYERSET | VARCHAR | Convenience field |

**Payerset Enrichments on TiC Data**:

| Field Name | Description | Source | Purpose |
| ----- | ----- | ----- | ----- |
| **NPPES\_CITY** | Provider city | NPPES | Geographic analysis |
| **NPPES\_STATE** | Provider state | NPPES | Geographic analysis |
| **NPPES\_COUNTY** | Provider county | NPPES | Market analysis |
| **NPPES\_ORGANIZATION\_NAME** | Official org name | NPPES | Provider identification |
| **NPPES\_ORGFRIENDLYNAME** | Org name \+ DBA if present | PAYERSET | User-friendly display |
| **NPPES\_PRIMARY\_TAXONOMY\_CODE** | Primary taxonomy via NPPES switches | PAYERSET | Provider specialty |
| **NUCC\_TAXONOMY\_GROUPING** | High-level taxonomy (Hospitals, Physicians, etc.) | NUCC | Broad categorization |
| **NUCC\_TAXONOMY\_CLASSIFICATION** | Mid-level taxonomy (Clinic, Ambulance, etc.) | NUCC | Provider type |
| **NUCC\_TAXONOMY\_SPECIALIZATION** | Granular specialty (Oncology, Orthopedics, etc.) | NUCC | Specific expertise |
| **PAYERSET\_BILLING\_CODE\_NAME** | Standardized code description | PAYERSET | Consistency across payers |
| **PAYERSET\_BILLING\_CODE\_CATEGORY** | Clinical grouping (Imaging, Surgery, etc.) | PAYERSET | **Critical for analysis** |
| **PAYERSET\_BILLING\_CODE\_SUBCATEGORY** | Detailed grouping within category | PAYERSET | **Granular filtering** |
| **PAYERSET\_BILLING\_CODE\_TYPE** | Payerset code type standardization | PAYERSET | Code system normalization |

**Key Capabilities Enabled**:

* ✅ Rate comparison across payers for same provider/code  
* ✅ Geographic rate variation analysis  
* ✅ Provider network composition analysis  
* ✅ Specialty-specific rate benchmarking  
* ✅ Place-of-service rate differentiation  
* ✅ Spread pricing detection (when combined with claims)

**Known Limitations**:

* ⚠️ Rate applicability conditions often vague in ADDITIONAL\_INFORMATION  
* ⚠️ Plan\_ID links required for full context (need PLAN\_MAP table)  
* ⚠️ TIN-to-NPI relationships can be complex (many-to-many)  
* ⚠️ Expiration dates not always reliable

---

### **2\. Hospital Transparency**

**Source**: Hospital-published machine-readable files per CMS mandate  
 **Update Frequency**: Annually (Jan 1 requirement), we update quarterly  
 **Primary Use Cases**:

* Hospital rate comparison  
* Cash price vs. insured rate analysis  
* Chargemaster vs. negotiated rate analysis  
* Quality \+ cost correlation

#### **Schema: Hospital Transparency**

| Field Name | Description | Source | Data Type | Key Insights |
| ----- | ----- | ----- | ----- | ----- |
| **HOSPITAL** | Facility name from file header | HOSPITAL MRF | VARCHAR | Hospital identifier |
| **HOSPITAL\_ID** | Payerset stable hash/surrogate key | PAYERSET | VARCHAR | **Primary key** |
| **SYSTEM** | Parent health system/IDN | PAYERSET/MRF | VARCHAR | Consolidation analysis |
| **CODE** | Billing code exactly as published | HOSPITAL MRF | VARCHAR | CPT, HCPCS, DRG, etc. |
| **CODE\_TYPE** | Coding system | HOSPITAL MRF | VARCHAR | CPT, HCPCS, MS-DRG, APC, NDC |
| **DESCRIPTION** | Code description from file | HOSPITAL MRF | VARCHAR | Often truncated/abbreviated |
| **SETTING** | Care setting (Inpatient, Outpatient, ED, ASC) | HOSPITAL MRF | VARCHAR | Place of service |
| **BILLING\_CLASS** | Institutional or Professional | HOSPITAL MRF | VARCHAR | Claim type |
| **GROSS** | Chargemaster (standard) price | HOSPITAL MRF | FLOAT | **Fantasy baseline** |
| **DISCOUNTED\_CASH** | Cash price for self-pay | HOSPITAL MRF | FLOAT | **True cash rate** |
| **MINIMUM** | Lowest negotiated rate across all payers | HOSPITAL MRF | FLOAT | **Best rate achieved** |
| **MAXIMUM** | Highest negotiated rate across all payers | HOSPITAL MRF | FLOAT | **Worst rate paid** |
| **PAYER\_NAME** | Payer name as listed by hospital | HOSPITAL MRF | VARCHAR | As-published payer |
| **PLAN\_NAME** | Plan/network label from hospital | HOSPITAL MRF | VARCHAR | Specific plan identifier |
| **PS\_PAYER** | Payerset-standardized payer name | PAYERSET | VARCHAR | **Cross-hospital consistency** |
| **PS\_PLAN** | Payerset-standardized plan name | PAYERSET | VARCHAR | **Plan normalization** |
| **STANDARD\_CHARGE\_DOLLAR** | CMS-defined standard charge (flat) | HOSPITAL MRF | FLOAT | Regulatory field |
| **STANDARD\_CHARGE\_PERCENTAGE** | Standard charge (% of benchmark) | HOSPITAL MRF | VARCHAR | "150% of Medicare OPPS" |
| **STANDARD\_CHARGE\_ALGORITHM** | How standard charge calculated | HOSPITAL MRF | VARCHAR | Methodology transparency |
| **METHODOLOGY** | Hospital narrative on charge derivation | HOSPITAL MRF | VARCHAR | Rate-setting explanation |
| **ADDITIONAL\_PAYER\_NOTES** | Free-text rate qualifiers | HOSPITAL MRF | VARCHAR | Important constraints |
| **BILLING\_CODE\_CATEGORY** | Payerset clinical grouping | PAYERSET | VARCHAR | Imaging, Surgery, Lab, etc. |

**Drug-Specific Fields** (when applicable):

| Field Name | Description | Source | Use |
| ----- | ----- | ----- | ----- |
| **DRUG\_CATEGORY** | Therapeutic class | HOSPITAL MRF | Antineoplastic, Analgesics, etc. |
| **DRUG\_TYPE** | Brand/Generic/Biosimilar | HOSPITAL MRF | Cost comparison |
| **DRUG\_UNIT** | Unit of measure | HOSPITAL MRF | mg, mL, tablet |

**Key Capabilities Enabled**:

* ✅ Hospital price transparency & comparison  
* ✅ Cash vs. insured rate analysis (detect when cash \< insured)  
* ✅ Chargemaster vs. negotiated rate spreads  
* ✅ Geographic hospital cost comparison  
* ✅ System-level pricing patterns  
* ✅ Min/max rate spread analysis (negotiation effectiveness)

**Critical Insights**:

* 💡 **DISCOUNTED\_CASH** often \< negotiated rates (surprise\!)  
* 💡 **MIN** vs **MAX** spread shows negotiation power disparity  
* 💡 **GROSS** (chargemaster) is 3-5× actual payments  
* 💡 **ADDITIONAL\_PAYER\_NOTES** contains critical rate restrictions

**Known Limitations**:

* ⚠️ Hospital compliance varies wildly (quality of data)  
* ⚠️ Payer/plan names not standardized (hence PS\_PAYER, PS\_PLAN needed)  
* ⚠️ Some hospitals publish partial data only  
* ⚠️ Code descriptions often abbreviated/unclear

---

### **3\. Employer Reporting Plans**

**Source**: Derived from Payer MRF Table of Contents  
 **Purpose**: Identify self-insured employer plans  
 **Primary Use Cases**:

* Employer-specific rate analysis  
* Self-insured plan identification  
* TPA relationship mapping

#### **Schema: Employer Reporting Plans**

| Field Name | Description | Data Type | Use Case |
| ----- | ----- | ----- | ----- |
| **payer** | Associated payer/TPA | VARCHAR | Carrier identification |
| **EIN** | Employer Identification Number | VARCHAR | **Primary employer identifier** |
| **reporting\_plan\_name** | Plan name from TOC | VARCHAR | Specific plan details |

**Key Capabilities Enabled**:

* ✅ Identify which payers administer for which employers  
* ✅ Link EIN to specific plan configurations  
* ✅ Distinguish self-insured from fully-insured plans  
* ✅ TPA relationship mapping

**Known Limitations**:

* ⚠️ Not all employers publicly disclosed  
* ⚠️ Plan names sometimes vague  
* ⚠️ EINs don't always link cleanly to common employer names

---

### **4\. EIN to NPI Map (TIN Rollup)**

**Source**: Aggregated from Payer MRFs  
 **Purpose**: Map tax identifiers to provider NPIs  
 **Primary Use Cases**:

* Understand organizational relationships  
* Group practice analysis  
* Provider attribution

#### **Schema: TIN Rollup File**

| Field Name | Description | Data Type | Insights |
| ----- | ----- | ----- | ----- |
| **tin\_value** | EIN from TiC data | VARCHAR | Organization tax ID |
| **npi** | Associated NPI | VARCHAR | Provider within organization |
| **payer\_list** | Array of payers reporting this relationship | ARRAY | Data reliability indicator |
| **payer\_count** | Number of payers with this TIN-NPI link | INT | **Relationship confidence** |
| **record\_count** | Total provider records in sampled files | DOUBLE | Volume indicator |

**Key Capabilities Enabled**:

* ✅ Roll up individual providers to organizations  
* ✅ Understand practice structures (solo vs. group vs. hospital-employed)  
* ✅ Validate TIN-NPI relationships (via payer\_count)  
* ✅ Identify employment/affiliation changes over time

**Critical for**:

* Network composition analysis (independent vs. system-employed)  
* Direct contracting (negotiate at TIN or NPI level?)  
* Spread pricing detection (TIN-level vs. NPI-level rates)

---

### **5\. NPI Data from NPPES**

**Source**: National Plan and Provider Enumeration System (CMS)  
 **Update Frequency**: Monthly from CMS  
 **Records**: \~7 million NPIs (Type 1 Individual \+ Type 2 Organization)  
 **Download**: https://mrf.payerset.com/nppes

**Primary Use Cases**:

* Provider identification & demographics  
* Location/address information  
* Taxonomy/specialty classification  
* Practice structure understanding

#### **Schema Highlights (300+ fields available)**

**Essential Fields**:

| Field Name | Description | Use |
| ----- | ----- | ----- |
| **NPI** | 10-digit unique identifier | Primary key |
| **Entity\_Type\_Code** | 1=Individual, 2=Organization | Provider classification |
| **Provider\_Organization\_Name** | Legal business name | Organization identification |
| **Provider\_First\_Name** | Individual first name | Individual provider ID |
| **Provider\_Last\_Name** | Individual last name | Individual provider ID |
| **Provider\_Business\_Practice\_Location\_Address** | Street address | Geographic analysis |
| **Provider\_Business\_Practice\_Location\_City** | City | Geographic analysis |
| **Provider\_Business\_Practice\_Location\_State** | State | **Market definition** |
| **Provider\_Business\_Practice\_Location\_Postal\_Code** | ZIP code | **Granular geography** |
| **Healthcare\_Provider\_Taxonomy\_Code\_1** through \_15 | Specialty codes | Multiple specializations |
| **Healthcare\_Provider\_Primary\_Taxonomy\_Switch\_1** through \_15 | Primary indicator flags | **Payerset uses to derive primary** |

**Payerset Enrichment**:

| Field Added | Description | Value |
| ----- | ----- | ----- |
| **NPPES\_PRIMARY\_TAXONOMY\_CODE** | Derived primary using switches | Single authoritative taxonomy |
| **NPPES\_ORGFRIENDLYNAME** | Org Name \+ DBA combined | User-friendly display name |

**Key Capabilities Enabled**:

* ✅ Provider identification across all data sources  
* ✅ Geographic market definition  
* ✅ Specialty-based filtering and analysis  
* ✅ Organization vs. individual provider distinction  
* ✅ Multiple location tracking for providers

**Full NPPES Documentation**: https://npiregistry.cms.hhs.gov/search

---

### **6\. Taxonomy Data from NUCC**

**Source**: National Uniform Claim Committee  
 **Purpose**: Standardized provider taxonomy classification  
 **Update Frequency**: Annually  
 **Download**: https://mrf.payerset.com/nucc

#### **Schema: NUCC Taxonomy**

| Field Name | Description | Example |
| ----- | ----- | ----- |
| **Code** | Unique taxonomy identifier | `207Q00000X` |
| **Grouping** | Broad category | "Allopathic & Osteopathic Physicians" |
| **Classification** | Provider type | "Family Medicine" |
| **Specialization** | Specific focus | "Obesity Medicine" |
| **Definition** | Full description | Clinical definition of specialty |
| **Notes** | Additional context | Source references |
| **Display Name** | User-friendly name | "Family Medicine" |
| **Section** | Individual or Group | Classification type |

**Hierarchical Structure**:

```
Grouping (16 top-level)
  ↓
Classification (~120 mid-level)
  ↓
Specialization (~900 granular)
```

**Key Capabilities Enabled**:

* ✅ Standardized provider specialty classification  
* ✅ Hierarchical grouping (roll-up analysis)  
* ✅ Human-readable specialty names  
* ✅ Cross-reference with NPPES taxonomy codes

**Common Groupings in Our Data**:

* Allopathic & Osteopathic Physicians  
* Behavioral Health & Social Service Providers  
* Hospitals  
* Nursing & Custodial Care Facilities  
* Ambulatory Health Care Facilities  
* Agencies  
* Group  
* Dental Providers  
* Technicians, Technologists & Other Technical Service Providers

---

## **Enrichment & Enhancement Layers**

### **1\. Payerset Billing Code Classification**

**Purpose**: Standardize and categorize 21,000+ billing codes  
 **Scope**: CPT, HCPCS, MS-DRG, APC, Revenue Codes  
 **Update Frequency**: Continuous refinement

#### **Classification Hierarchy**

```
Category (26 top-level)
  ↓
Subcategory (~80 mid-level)
```

#### **Categories & Subcategories (Sample)**

| CATEGORY | SUBCATEGORY | Example Codes |
| ----- | ----- | ----- |
| **Allergy & Immunology Services** | Allergy Testing | 95004, 95017, 95024 |
|  | Immunotherapy | 95115, 95117 |
| **Anesthesia Services** | General Anesthesia | 00100-01999 range |
|  | Regional Anesthesia | 01991, 01992 |
| **Cardiovascular Procedures** | Diagnostic Cardiology | 93000, 93015, 93350 |
|  | Interventional Cardiology | 92920, 92928, 92933 |
| **Emergency Services** | Urgent Evaluations | 99281-99285 |
|  | Resuscitation Services | 92950 |
| **Imaging & Radiology** | MRI & CT Scans | 70450-70498, 71250-71275 |
|  | X-Ray Imaging | 71010-71035 |
| **Laboratory & Diagnostic Tests** | Blood Tests | 80047-80076, 85002-85999 |
|  | Genetic & Molecular Testing | 81200-81479 |
| **Surgeries & Procedures** | Orthopedic Surgery | 27400-27499 |
|  | Cardiothoracic Surgery | 33010-33999 |

**Full Category List**:

1. Allergy & Immunology Services  
2. Anesthesia Services  
3. Cardiovascular Procedures  
4. Consultations & Evaluations  
5. Emergency Services  
6. Gastroenterology Procedures  
7. Imaging & Radiology  
8. Laboratory & Diagnostic Tests  
9. Maternity & Obstetrics  
10. Mental Health Services  
11. Oncology & Cancer Treatment  
12. Optometry & Eye Care  
13. Pharmacotherapy & Drug Administration  
14. Preventive Services  
15. Rehabilitation & Physical Therapy  
16. Specialist Visits  
17. Surgeries & Procedures  
18. (Plus 9 more)

#### **Fields Added to All Datasets**

| Field Name | Description | Impact |
| ----- | ----- | ----- |
| **PAYERSET\_BILLING\_CODE\_NAME** | Standardized description | Consistency across payers |
| **PAYERSET\_BILLING\_CODE\_CATEGORY** | Clinical grouping | **Primary filter dimension** |
| **PAYERSET\_BILLING\_CODE\_SUBCATEGORY** | Granular grouping | **Secondary filter** |
| **PAYERSET\_BILLING\_CODE\_TYPE** | Code system standardization | Simplified code type handling |

**Key Capabilities Enabled**:

* ✅ Consistent code descriptions across all payers/hospitals  
* ✅ Category-level cost analysis ("What do we spend on imaging?")  
* ✅ Subcategory drill-down ("Which imaging types are expensive?")  
* ✅ Service mix analysis  
* ✅ Benchmarking within clinical categories  
* ✅ User-friendly filtering (vs. code-level)

**Business Value**:

* 💰 Enables non-expert users to analyze healthcare costs  
* 💰 Powers category-based benchmarking  
* 💰 Facilitates "apples-to-apples" comparisons  
* 💰 Critical for employer self-service tools

---

## **Product-Specific Datasets**

### **1\. Comparison Analysis & Fee Schedule Generator**

**Purpose**: Core product for employer rate analysis  
 **Data Sources Combined**:

* Payer TiC data  
* NPPES provider info  
* NUCC taxonomy  
* Payerset billing code classification  
* Plan mapping

**Full Schema**: See "Payer Transparency (TiC)" above \- same fields

**Additional Fields for This Product**:

| Field Name | Description | Source |
| ----- | ----- | ----- |
| **Plan Name** | Friendly plan name | PAYERSET (from PLAN\_MAP) |
| **Plan Type** | EPO, PPO, HMO, POS, Other | PAYERSET (from PLAN\_MAP) |

**Key Capabilities**:

* ✅ Multi-payer rate comparison for same provider/code  
* ✅ Fee schedule generation by geography/specialty  
* ✅ Network adequacy analysis  
* ✅ Rate reasonableness assessment  
* ✅ Direct contracting opportunity identification

**Target Users**: Employers, consultants, TPAs

---

### **2\. Claims Data (Premium Tier)**

**Source**: Aggregated claims from partner ecosystem  
 **Availability**: Upgraded "Pricing Intelligence Solution" only  
 **Update Frequency**: Quarterly

**IMPORTANT**: This is actual payment/utilization data, not just contracted rates.

#### **Schema: Claims Data**

| Field Name | Friendly Name | Description | Insights |
| ----- | ----- | ----- | ----- |
| **NPI** | Provider NPI | 10-digit identifier | Provider linkage |
| **SETTING** | Care Setting | Inpatient or Outpatient (from Type of Bill) | Claim context |
| **PLACE\_OF\_SERVICE\_CODE** | Service Code | Two-digit CMS POS code | Specific location type |
| **PLACE\_OF\_SERVICE\_NAME** | Place of Service | Human-readable POS | Office, Hospital, etc. |
| **CHANNEL** | Payer Channel | High-level grouping | Commercial, Medicare, Medicaid |
| **SUBCHANNEL** | Subchannel | Segment within channel | Fully Insured, Self-Insured, etc. |
| **PAYER** | Payer Name | Insurance organization | UnitedHealthcare, BCBS, etc. |
| **BILLING\_CODE** | Procedure Code | CPT/HCPCS/RC code billed | Service identifier |
| **BILLING\_CODE\_TYPE** | Code Type | CPT, HCPCS, etc. | Code system |
| **BILLING\_CODE\_DESCRIPTION** | Code Description | Short procedure description | Human-readable |
| **MODIFIER** | Code Modifier | CPT/HCPCS modifier | Rate variation indicator |
| **MODIFIER\_DESCRIPTION** | Modifier Meaning | Explanation of modifier | Context |
| **OPEN\_CLAIMS\_COUNT** | Open Claims | Number of unadjudicated claims | Pending volume |
| **AVG\_CLAIM\_AMOUNT** | Avg Claim Charge | Average submitted charge | Billed amount |
| **MIN\_REMIT\_AMOUNT** | Min Payment | Minimum remitted amount | **Actual payment floor** |
| **MAX\_REMIT\_AMOUNT** | Max Payment | Maximum remitted amount | **Actual payment ceiling** |
| **AVG\_REMIT\_AMOUNT** | Avg Payment | Average remitted amount | **Actual average paid** |
| **MEDIAN\_REMIT\_AMOUNT** | Median Payment | Median remitted amount | **Typical payment** |
| **REMIT\_COUNT** | Payment Count | Count of paid claims | Sample size |
| **OPEN\_CLAIMS\_VOLUME\_NPI\_CODE\_PAYER\_PCT** | Open Claims Percentile | Rank within NPI/Code/Payer cohort | Volume benchmark |
| **REMITS\_VOLUME\_NPI\_CODE\_PAYER\_PCT** | Remit Count Percentile | Rank of paid volume | Payment frequency benchmark |

**Critical Insights This Enables**:

**1\. Contracted Rate vs. Actual Payment**:

* Compare `NEGOTIATED_RATE` (from TiC) to `AVG_REMIT_AMOUNT` (from claims)  
* Detect **underpayments** (TPA pays less than contracted rate)  
* Calculate **spread pricing** (difference between contracted and actual)

**2\. Utilization Patterns**:

* Which services are actually being used (`REMIT_COUNT`)  
* Where claims are pending (`OPEN_CLAIMS_COUNT`)  
* High-volume services by provider/payer

**3\. Payment Variation**:

* Spread between `MIN_REMIT_AMOUNT` and `MAX_REMIT_AMOUNT`  
* Compare `AVG_REMIT_AMOUNT` to `MEDIAN_REMIT_AMOUNT` (distribution shape)  
* Percentile rankings show outliers

**4\. Claim vs. Remit**:

* Compare `AVG_CLAIM_AMOUNT` to `AVG_REMIT_AMOUNT`  
* Calculate effective discount percentage  
* Identify aggressive payer negotiation

**Business Value**:

* 💰 **PBGH-style analysis enabled**: Compare contracted rates to actual payments  
* 💰 **Spread pricing detection**: See where money leaks  
* 💰 **Utilization intelligence**: Understand volume patterns  
* 💰 **Payment benchmarking**: Real-world payment data, not just rates

**Known Limitations**:

* ⚠️ Requires upgraded license  
* ⚠️ Aggregated data (not employer-specific claims)  
* ⚠️ Sample-based (not universe of all claims)  
* ⚠️ Lag time in data availability

---

### **3\. Medicare Data**

**Source**: Centers for Medicare & Medicaid Services (CMS)  
 **Purpose**: Government benchmark rates  
 **Primary Use Cases**:

* Reference-based pricing (Medicare \+ X%)  
* Benchmark for "fair" rates  
* Provider cost analysis

#### **A. Medicare Inpatient Data**

**Source**: CMS Inpatient Prospective Payment System (IPPS)  
 **Granularity**: DRG-level, by provider

| Field Name | Friendly Name | Description | Use |
| ----- | ----- | ----- | ----- |
| **NPI** | Provider NPI | 10-digit identifier or "No NPI Found" | Hospital ID |
| **carrier\_number** | Carrier Number | Payer internal code | Administrative |
| **Rndrng\_Prvdr\_Org\_Name** | Hospital Name | Rendering provider organization | Hospital identification |
| **Rndrng\_Prvdr\_City** | City | Provider city | Geographic analysis |
| **Rndrng\_Prvdr\_St** | Street Address | Physical address | Location |
| **Rndrng\_Prvdr\_State\_FIPS** | State FIPS Code | Census state code | State linkage |
| **Rndrng\_Prvdr\_State\_Abbrvtn** | State | USPS abbreviation | State filter |
| **Rndrng\_Prvdr\_Zip5** | ZIP Code | 5-digit postal code | Geographic analysis |
| **cbsa** | CBSA Code | Core-Based Statistical Area | **Market definition** |
| **drg\_code** | DRG Code | Diagnosis-Related Group | Inpatient procedure bundle |
| **fee\_schedule\_dollar\_amount** | Medicare Rate | CMS fee schedule amount | **Government benchmark** |
| **Total\_Discharges** | Discharge Count | Number of discharges | Volume indicator |
| **Avg\_Submitted\_Covered\_Charges** | Avg Charges | Average submitted charges | Hospital pricing |
| **Avg\_Total\_Payment\_Amount** | Avg Total Payment | Average total payment | Actual payment |
| **Avg\_Medicare\_Payment\_Amount** | Medicare Payment | Average Medicare payment | **Government rate** |
| **Avg\_Medicare\_Payment\_Percent** | Medicare % | Medicare as % of charges | Payment ratio |
| **latitude** | Latitude | Geographic coordinate | Mapping |
| **longitude** | Longitude | Geographic coordinate | Mapping |

**Key Insights**:

* 💡 **Medicare Payment** \= floor for reasonable rates  
* 💡 Compare commercial rates to Medicare \+ X%  
* 💡 **Avg\_Submitted\_Covered\_Charges** shows hospital pricing  
* 💡 **Medicare\_Payment\_Percent** shows discount from charges

#### **B. Medicare Outpatient Data**

**Source**: CMS Physician Fee Schedule (PFS)  
 **Granularity**: CPT/HCPCS code, by locality

| Field Name | Friendly Name | Description | Insights |
| ----- | ----- | ----- | ----- |
| **HCPCS Code** | Procedure Code | CPT/HCPCS code | Service identifier |
| **Modifier** | Modifier | Two-character modifier | Rate variation |
| **Short Description** | Service Name | Brief description | Human-readable |
| **Mac Locality** | MAC Locality Code | Medicare contractor locality | **Geographic rate zone** |
| **Locality County** | County | County for locality | Geographic detail |
| **Locality State** | State | State for locality | State filter |
| **Non-Facility Price** | Non-Facility Rate | Rate in non-facility setting | Office, clinic rate |
| **Facility Price** | Facility Rate | Rate in facility setting | Hospital rate |
| **Non-Facility Limiting Charge** | Non-Facility Max | Payment limit non-facility | Maximum allowed |
| **Facility Limiting Charge** | Facility Max | Payment limit facility | Maximum allowed |
| **GPCI Work** | Work GPCI | Geographic adjustment for work | Cost-of-living multiplier |
| **GPCI PE** | Practice Expense GPCI | Geographic adjustment for PE | Cost-of-living multiplier |
| **GPCI MP** | Malpractice GPCI | Geographic malpractice adjustment | Cost-of-living multiplier |
| **Work RVU** | Work RVU | Relative value unit \- work | Physician effort component |
| **Transitioned Non-FAC PE RVU** | Transitional PE RVU (Non-Facility) | Practice expense RVU transitioning | Cost component |
| **Fully Implemented Non-FAC PE RVU** | Final PE RVU (Non-Facility) | Final practice expense RVU | Cost component |
| **Transitioned Facility PE RVU** | Transitional PE RVU (Facility) | Practice expense RVU transitioning | Cost component |
| **Fully Implemented Facility PE RVU** | Final PE RVU (Facility) | Final practice expense RVU | Cost component |
| **MP RVU** | Malpractice RVU | Malpractice relative value | Malpractice component |
| **Conv Fact** | Conversion Factor | Dollar-to-RVU converter | Currently \~$33 |

**Additional Surgical/Procedural Fields**:

| Field | Meaning | Example Value |
| ----- | ----- | ----- |
| **Global** | Global surgery period | 0, 10, 90, XXX |
| **Pre Op** | Pre-op RVU | 0.00 |
| **Intra Op** | Intra-op RVU | Varies |
| **Post Op** | Post-op RVU | Varies |
| **Mult Surg** | Multiple surgery RVU | Discount % |
| **Bilt Surg** | Bilateral surgery RVU | Adjustment |
| **Asst Surg** | Assistant surgeon RVU | % of primary |

**Medicare Rate Calculation**:

```
Medicare Rate = (Work RVU × Work GPCI + PE RVU × PE GPCI + MP RVU × MP GPCI) × Conversion Factor
```

**Key Capabilities Enabled**:

* ✅ Reference-based pricing benchmark (Medicare \+ 140%, etc.)  
* ✅ Geographic cost variation (via GPCI)  
* ✅ Facility vs. non-facility rate differentiation  
* ✅ RVU-based cost analysis  
* ✅ Surgical global period understanding  
* ✅ "Fair" rate determination

**Business Value**:

* 💰 **Defensible rate benchmark** (government-set, not arbitrary)  
* 💰 **Canadian hospitals operate profitably at \~35% less than US Medicare**  
* 💰 **Common reference point** in direct contracts  
* 💰 **Politically sensitive but factually grounded**

---

### **4\. Utilities / Special Datasets**

#### **UnitedHealthcare CSTM-ALL**

**Purpose**: Custom billing codes used by major payer  
 **Note**: Example of payer-specific code systems we handle

| Field Name | Friendly Name | Description |
| ----- | ----- | ----- |
| **NPI** | Provider NPI | National Provider Identifier |
| **TIN\_TYPE** | Tax ID Type | EIN or SSN |
| **TIN\_VALUE** | Tax ID | Taxpayer identification |
| **BILLING\_CODE** | Payer Billing Code | Payer's internal code (e.g., `MISC`, `THR1`) |
| **BILLING\_CLASS** | Billing Class | Institutional or Professional |
| **EXPIRATION\_DATE** | Expiration Date | Agreement end date |
| **NEGOTIATED\_RATE** | Rate | Contracted rate value |
| **NEGOTIATED\_TYPE** | Rate Type | Percentage, per diem, etc. |
| **SERVICE\_CODES** | Service Codes | Applicable POS codes |
| **FACILITY\_FLAG** | Facility Flag | Y/N indicator |
| **PLACE\_OF\_SERVICE** | Place of Service | Payer's POS description |
| **NEGOTIATION\_ARRANGEMENT** | Arrangement | FFS, bundle, etc. |
| **ADDITIONAL\_INFORMATION** | Qualifiers | Age restrictions, etc. (e.g., `age[18-64]`) |
| **BILLING\_CODE\_NAME** | Code Description | Human-readable name |

**Plus all standard enrichments** (NPPES, NUCC taxonomy, Payerset categories)

**Why This Matters**:

* Custom/proprietary payer codes exist  
* Must be mapped to standard codes for analysis  
* Payerset handles these edge cases  
* Critical for complete payer coverage

---

## **Data Source Matrix by Stakeholder**

### **For EMPLOYERS**

| Need | Primary Data Source(s) | Secondary Source(s) | What It Enables |
| ----- | ----- | ----- | ----- |
| **See actual contracted rates** | Payer TiC, Claims Data | Plan Map | Benchmark against peers |
| **Detect overpayment** | Payer TiC \+ Claims Data | Medicare Data | Find 30% overspending |
| **Compare to benchmarks** | Medicare Data, Payer TiC | Claims Data | Medicare \+ X% vs. actual |
| **Identify high-value providers** | Hospital Transparency, NPPES, Claims | Quality data (future) | Cost \+ quality analysis |
| **Detect spread pricing** | Claims Data (AVG\_REMIT vs. contracted rate) | Payer TiC | Expose hidden fees |
| **Network composition analysis** | Payer TiC, NPPES, NUCC | EIN-NPI Map | Independent vs. employed |
| **Geographic market analysis** | NPPES, Medicare, Hospital Transparency | Payer TiC | Market competition |
| **Direct contracting targets** | Hospital Transparency (cash prices), Claims | Medicare, Payer TiC | Best opportunities |
| **Fiduciary compliance** | All sources combined | Claims for verification | Meet CAA requirements |

### **For PATIENTS**

| Need | Primary Data Source(s) | Secondary Source(s) | What It Enables |
| ----- | ----- | ----- | ----- |
| **Know costs before care** | Hospital Transparency (DISCOUNTED\_CASH) | Payer TiC | Accurate estimates |
| **Compare provider prices** | Hospital Transparency, Payer TiC | Medicare | Shopping for services |
| **Find in-network providers** | Payer TiC, NPPES | NUCC Taxonomy | Provider search |
| **Understand out-of-pocket** | Payer TiC (rates), Plan details | Claims (typical costs) | Financial planning |
| **Find cash-pay options** | Hospital Transparency (DISCOUNTED\_CASH) | — | Cash vs. insurance decision |
| **Verify provider credentials** | NPPES, NUCC | — | Specialty confirmation |
| **See quality alongside cost** | (Future: Quality data integration) | Hospital safety scores | Value-based decision |

### **For PROVIDERS (High-Value)**

| Need | Primary Data Source(s) | Secondary Source(s) | What It Enables |
| ----- | ----- | ----- | ----- |
| **See market rates** | Payer TiC, Claims Data | Medicare | Competitive positioning |
| **Understand payer mix** | Claims Data (CHANNEL, SUBCHANNEL) | — | Revenue analysis |
| **Identify direct contract opportunities** | Employer Reporting Plans, Payer TiC | Claims patterns | Target employers |
| **Compare to benchmarks** | Medicare Data, Payer TiC | Claims averages | Rate negotiation prep |
| **See payment patterns** | Claims Data (remit amounts, timing) | — | Cash flow planning |
| **Understand underpayments** | Claims (AVG\_REMIT vs. contracted) | Payer TiC | Dispute preparation |
| **Geographic competition** | NPPES (competitors), Payer TiC | Medicare, Hospital Transparency | Market intelligence |

### **For CONSULTANTS (Unconflicted)**

| Need | Primary Data Source(s) | Secondary Source(s) | What It Enables |
| ----- | ----- | ----- | ----- |
| **Prove client value** | Claims Data, Payer TiC | Medicare benchmarks | Show overpayment |
| **RFP evaluation** | Payer TiC (compare proposals) | Claims, Medicare | Validate carrier claims |
| **Network design** | NPPES, NUCC, Payer TiC | Hospital Transparency, Quality | High-value networks |
| **Contract analysis** | Payer TiC (identify terms) | Claims (actual payments) | Find hidden costs |
| **Direct contract support** | Hospital Transparency (cash prices), Medicare | Claims patterns | Negotiation prep |
| **Fiduciary documentation** | All sources | — | Support compliance |
| **Benchmark reporting** | Payer TiC, Claims, Medicare | — | Client reporting |

---

## **Known Gaps & Future Data Needs**

### **CRITICAL GAPS**

#### **1\. Quality & Safety Data**

**Current State**: ❌ Not in data lake  
 **What's Needed**:

* **Leapfrog Safety Grades** (A, B, C, D, F) by hospital  
* **CMS Star Ratings** (1-5 stars) for Medicare Advantage plans  
* **HEDIS Measures** (clinical quality process measures)  
* **Outcomes Data**: Complication rates, readmission rates, mortality rates  
* **Patient Experience**: HCAHPS scores, patient satisfaction

**Why Critical**:

* PBGH success combined cost \+ quality \+ safety  
* Can't identify "high-value" without quality  
* Price alone \= incomplete picture  
* Quality scores often inversely correlated with price (shocking finding)

**Use Cases Blocked Without This**:

* ❌ Value-based provider selection  
* ❌ "Good provider losing to bad provider" problem (Dr. Rodis story)  
* ❌ Complete PBGH-style analysis  
* ❌ Patient-facing provider recommendations  
* ❌ High-value network design with confidence

**Potential Sources**:

* Leapfrog Group (partnership/licensing)  
* CMS public files (free but limited)  
* Commercial quality data vendors (Embold Health, others)  
* Employer-contributed outcomes data

**Priority**: 🔴 **HIGHEST** \- This is the missing piece preventing full PBGH replication

---

#### **2\. Employer-Specific Claims Data**

**Current State**: 🟡 Aggregated claims available (premium tier)  
 **What's Needed**:

* Actual employer-specific claims files  
* Full adjudication details (not just aggregated remit amounts)  
* Denial/approval data  
* Prior authorization outcomes  
* Employee demographics (age, location, dependent status)  
* Plan design details (deductibles, coinsurance, OOPM)

**Why Critical**:

* Aggregated claims can't show employer-specific overpayment  
* Need to compare employer's actual experience to contracted rates  
* Can't calculate employer-specific spread pricing without this  
* Can't show employer where *they* specifically are overpaying

**Use Cases Blocked Without This**:

* ❌ Employer-specific overpayment detection  
* ❌ Customized benchmarking (vs. "your peers in general")  
* ❌ Utilization pattern analysis per employer  
* ❌ Network optimization based on actual employee usage  
* ❌ Direct ROI calculation for specific employer

**Potential Approaches**:

* **Employer data contribution** (bring your own claims)  
* **TPA partnerships** (access to client claims with permission)  
* **Clearinghouse partnerships** (aggregated access)  
* **Self-service model** (employer uploads claims, we analyze)

**Priority**: 🔴 **HIGHEST** \- Required for employer-specific value proposition

**Feasibility Challenge**:

* Data privacy/HIPAA  
* Employer reluctance to share  
* TPA gatekeeping  
* Legal/contractual barriers

**Workaround**:

* Position as "claims data analysis service"  
* Employers own data, we process it  
* De-identification for benchmarking contribution

---

#### **3\. Real-Time / More Frequent Data**

**Current State**:

* Payer TiC: Monthly updates  
* Hospital Transparency: Quarterly updates (annual mandate)  
* Medicare: Annual updates  
* Claims: Quarterly (when available)

**What's Needed**:

* Weekly or daily rate updates  
* Real-time claims adjudication data  
* Current network status (provider in/out of network)  
* Contract effective/termination dates tracked  
* Price changes over time (trending)

**Why Critical**:

* Rates change mid-year (not just annual)  
* Network status changes (providers join/leave)  
* Merger & acquisition activity affects pricing  
* Point-in-time snapshots miss dynamics

**Use Cases Impacted**:

* ⚠️ Stale rate data in recommendations  
* ⚠️ Out-of-date network composition  
* ⚠️ Missed opportunities from price changes  
* ⚠️ Can't track spread pricing trends

**Potential Solutions**:

* Increased scraping frequency (cost/technical challenge)  
* Direct feeds from payers (ideal but unlikely)  
* Crowdsourced updates (employers reporting changes)  
* Claims data as leading indicator of rate changes

**Priority**: 🟡 **MEDIUM** \- Important for accuracy, but not blocking core use cases

---

#### **4\. Additional Rate Types & Payment Models**

**Current State**: Focus on FFS negotiated rates  
 **What's Missing**:

* **Capitation rates** (PMPM amounts)  
* **Bundled payment arrangements** (episode-based rates)  
* **Value-based payment terms** (shared savings, risk arrangements)  
* **Stop-loss/reinsurance pricing**  
* **Prescription drug pricing** (PBM rates, NADAC, AWP)

**Why Needed**:

* Alternative payment models growing  
* Direct contracting often uses non-FFS models  
* Pharmacy a huge cost driver (separate from medical)  
* Employers need full picture of costs

**Use Cases Blocked**:

* ❌ Complete cost modeling (missing capitation)  
* ❌ Direct contract design support  
* ❌ Pharmacy benefit analysis  
* ❌ Total cost of care calculation

**Potential Sources**:

* PBM transparency files (new mandates)  
* Direct employer contracts (contributed)  
* Medicare Advantage bid data (public)  
* ACO performance data (CMS)

**Priority**: 🟡 **MEDIUM** \- Growing importance as models shift

---

#### **5\. Provider Ownership & Affiliation Data**

**Current State**: 🟡 TIN-to-NPI map provides some structure  
 **What's Missing**:

* Hospital system ownership trees (which hospitals in which systems)  
* Private equity ownership  
* Physician employment status (independent vs. employed)  
* Affiliation changes over time  
* Financial relationships between entities

**Why Needed**:

* Consolidated systems price differently  
* PE-backed providers exhibit different patterns  
* Employment status affects negotiating leverage  
* Vertical integration creates conflicts of interest

**Use Cases Blocked**:

* ❌ Identify PE-backed providers (avoid surprise billing risk)  
* ❌ System-level negotiation strategy  
* ❌ Track consolidation impact on pricing  
* ❌ Detect conflicts (carrier-owned provider networks)

**Potential Sources**:

* Irving Levin Associates (merger data)  
* Private equity databases  
* State CON (Certificate of Need) filings  
* Hospital association data  
* Web scraping of system websites

**Priority**: 🟡 **MEDIUM** \- Important for strategic analysis

---

#### **6\. Contract Terms & Conditions**

**Current State**: ❌ Not available  
 **What's Needed**:

* Actual contract language (redacted/de-identified)  
* Contract clauses:  
  * Anti-steering provisions  
  * Anti-tiering provisions  
  * Most Favored Nations clauses  
  * All-or-nothing clauses  
  * Silent PPO provisions  
  * Termination terms  
  * Data access rights  
  * Performance guarantees  
* Contract effective dates  
* Renewal terms

**Why Critical**:

* Contract terms often more important than rates  
* "Good rates" with "bad terms" \= bad deal  
* Employers don't know what to look for  
* Consultants miss problematic clauses

**Use Cases Blocked**:

* ❌ Contract evaluation/audit  
* ❌ Identification of problematic terms  
* ❌ Negotiation leverage point identification  
* ❌ Best practice contract templates

**Potential Approaches**:

* Employer-contributed contracts (anonymized)  
* Standard clause database (build from scratch)  
* Legal AI analysis of contributed contracts  
* Open-source contract templates (Dave Chase model)

**Priority**: 🟢 **LOWER** \- High value but difficult to obtain

---

#### **7\. Employee/Member Demographics & Engagement**

**Current State**: ❌ Not available  
 **What's Needed**:

* Age distribution  
* Geographic distribution (where employees live)  
* Chronic condition prevalence  
* Healthcare engagement patterns  
* Benefit design details  
* Cost-sharing structures  
* Historical utilization patterns

**Why Needed**:

* Predict utilization and costs  
* Right-size networks geographically  
* Design appropriate benefit structures  
* Calculate ROI of interventions  
* Benchmark risk-adjusted costs

**Use Cases Blocked**:

* ❌ Risk-adjusted cost comparison  
* ❌ Geographic network adequacy  
* ❌ Predictive cost modeling  
* ❌ Personalized benefit design

**Potential Approaches**:

* Employer-contributed eligibility files  
* Survey/self-reported data  
* Proxy from zip code demographics  
* Aggregate benchmarks by industry

**Priority**: 🟢 **LOWER** \- Nice to have for sophisticated analysis

---

#### **8\. Regulatory & Compliance Data**

**Current State**: 🟡 Some available via public sources  
 **What's Needed**:

* State transparency law requirements  
* Surprise billing protections by state  
* Licensing/accreditation status  
* Sanctions/disciplinary actions  
* Medicaid/Medicare participation status  
* CON (Certificate of Need) filings  
* Network adequacy standards by state  
* ERISA guidance documents

**Why Needed**:

* Ensure recommendations comply with state/federal law  
* Identify provider quality/safety issues  
* Understand market entry barriers  
* Design compliant benefit structures

**Use Cases Enhanced**:

* Compliance checking  
* Provider vetting  
* Market analysis  
* Risk mitigation

**Potential Sources**:

* State insurance department websites  
* CMS databases  
* State licensing boards  
* Legal/regulatory databases

**Priority**: 🟢 **LOWER** \- Foundational but not immediate blocker

---

### **Gap Priority Summary**

| Gap | Priority | Blocking | Difficulty | Estimated Timeline |
| ----- | ----- | ----- | ----- | ----- |
| **Quality & Safety Data** | 🔴 Highest | Major use cases | Medium | 3-6 months (partnership) |
| **Employer-Specific Claims** | 🔴 Highest | Employer value prop | High | 6-12 months (build capability) |
| **Real-Time Updates** | 🟡 Medium | Accuracy/timeliness | Medium-High | 6-12 months (infrastructure) |
| **Alternative Payment Models** | 🟡 Medium | Complete cost picture | Medium | 6-12 months (new sources) |
| **Provider Ownership** | 🟡 Medium | Strategic analysis | Medium | 6-12 months (multiple sources) |
| **Contract Terms** | 🟢 Lower | Advanced features | High | 12+ months (build database) |
| **Demographics** | 🟢 Lower | Sophisticated modeling | Medium | 12+ months (employer contribution) |
| **Regulatory Data** | 🟢 Lower | Compliance features | Low | 3-6 months (public scraping) |

---

## **Next Steps & Recommendations**

### **Immediate Actions (Next 30 Days)**

1. **Quality Data Partnership**

   * Reach out to Leapfrog Group re: licensing  
   * Evaluate CMS public quality data (free option)  
   * Research commercial quality vendors (Embold, others)  
   * **Goal**: Get at least hospital safety scores into data lake  
2. **Claims Data Strategy**

   * Define employer-claims-contribution product offering  
   * Build technical capability to ingest/analyze employer claims  
   * Create legal/HIPAA compliance framework  
   * **Goal**: Pilot with 1-2 employers willing to contribute claims  
3. **Data Quality Audit**

   * Assess completeness of current payer TiC data  
   * Identify payers with poor MRF compliance  
   * Check hospital transparency compliance rates  
   * **Goal**: Document data quality baselines  
4. **Use Case Mapping**

   * For each product feature, map to required data  
   * Identify "must have" vs. "nice to have" data  
   * Create data dependency diagram  
   * **Goal**: Prioritize data acquisition by product impact

### **Short-Term (Next 90 Days)**

1. **MVP Quality Integration**

   * At minimum, get Leapfrog hospital grades  
   * Integrate into hospital transparency dataset  
   * Build cost \+ quality views  
   * **Goal**: Demo PBGH-style analysis capability  
2. **Enhanced Medicare Data**

   * Add facility-specific Medicare rates (not just national)  
   * Create Medicare \+ X% comparison tool  
   * Build reference-based pricing calculator  
   * **Goal**: Enable Medicare benchmarking product feature  
3. **Provider Affiliation Starter**

   * Web scrape major health system websites (hospital lists)  
   * Build basic system-to-hospital mapping  
   * Identify PE-backed providers (public sources)  
   * **Goal**: System-level analysis capability  
4. **Alternative Rate Types**

   * Identify capitation/bundled rates in existing MRFs  
   * Create separate schema for non-FFS arrangements  
   * Document prevalence and patterns  
   * **Goal**: Understand scope of alternative payments

### **Medium-Term (6-12 Months)**

1. **Full Quality Data Integration**

   * Expand beyond hospital safety to include:  
     * Outcomes data (readmissions, complications)  
     * Patient experience scores  
     * Clinical quality measures  
   * Build quality-cost correlation analytics  
   * **Goal**: Comprehensive value-based analysis  
2. **Claims-as-a-Service Platform**

   * Production-ready employer claims ingestion  
   * Automated analysis pipelines  
   * Benchmarking against aggregate claims  
   * Spread pricing detection algorithms  
   * **Goal**: Scalable employer-specific analytics  
3. **Real-Time Data Infrastructure**

   * Increase scraping frequency (weekly at minimum)  
   * Build change detection & alerting  
   * Create rate trending/time-series analysis  
   * **Goal**: Current, not stale, pricing intelligence  
4. **Provider Network Intelligence**

   * Complete ownership & affiliation mapping  
   * PE identification & tracking  
   * System consolidation impact analysis  
   * **Goal**: Strategic provider relationship intelligence

### **Long-Term (12+ Months)**

1. **Contract Intelligence Database**

   * Crowdsource contract clauses (anonymized)  
   * Build contract evaluation engine  
   * Create "red flag" detection  
   * Standard template library  
   * **Goal**: Contract optimization capability  
2. **Predictive Analytics**

   * Cost prediction models (risk adjustment)  
   * Utilization forecasting  
   * Network adequacy simulation  
   * ROI projection tools  
   * **Goal**: Forward-looking intelligence  
3. **Closed-Loop Quality-Cost Feedback**

   * Integrate quality outcomes with cost data  
   * Track employer interventions and results  
   * Build "what works" evidence base  
   * **Goal**: Prove transparency drives outcomes

---

## **Document Change Log**

| Date | Change | Rationale |
| ----- | ----- | ----- |
| \[Date\] | Initial consolidation | Unified all data documentation |
|  |  |  |

---

## **Appendix: Data Source URLs**

* **NPPES Download**: https://mrf.payerset.com/nppes  
* **NUCC Taxonomy**: https://mrf.payerset.com/nucc  
* **CMS Hospital Price Transparency**: https://www.cms.gov/hospital-price-transparency  
* **CAA Transparency Requirements**: https://www.cms.gov/cciio/resources/regulations-and-guidance  
* **Leapfrog Hospital Safety Grades**: https://www.leapfroggroup.org/ratings-reports/hospital-safety-grade

---

**End of Master Data Inventory**

This document should serve as your single source of truth for understanding Payerset's current data assets and identifying what's needed to build out your transparency solutions. Use the "Gap Priority Summary" to guide data acquisition roadmap discussions.

