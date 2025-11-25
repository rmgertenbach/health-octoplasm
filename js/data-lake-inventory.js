// Data Lake Master Inventory - Availability Lookup
// Based on "Payerset Data Lake Master Inventory.md"
// This provides quick reference for what data exists, gaps, and priorities

const DataLakeInventory = {
  // AVAILABLE DATA
  available: {
    "Payer TiC": {
      name: "Payer Transparency in Coverage (TiC)",
      description: "Commercial payer negotiated rates from MRFs",
      update: "Monthly",
      coverage: "Major commercial payers, all 50 states",
      useCases: ["Rate benchmarking", "Network analysis", "Spread pricing detection"],
      gapPriority: null
    },
    "Hospital Transparency": {
      name: "Hospital Published Prices",
      description: "Hospital standard charges & cash prices (DISCOUNTED_CASH)",
      update: "Quarterly",
      coverage: "Most hospitals >5000 facilities",
      useCases: ["Cash price comparison", "Direct contracting targets", "Rate negotiation"],
      gapPriority: null
    },
    "Medicare Rates": {
      name: "Medicare Fee Schedules",
      description: "MPFS (physician), IPPS (inpatient), ASC (outpatient surgery), Clinical Lab",
      update: "Annually (Jan 1)",
      coverage: "National with GPCI geographic adjusters",
      useCases: ["Benchmarking", "Fair pricing", "RBP reference rates"],
      gapPriority: null
    },
    "NPPES": {
      name: "National Provider & Plan Enumeration System",
      description: "Provider demographics, locations, NPIs, taxonomy codes",
      update: "Weekly",
      coverage: "All NPI-registered providers",
      useCases: ["Provider identification", "Geographic analysis", "Network composition"],
      gapPriority: null
    },
    "NUCC": {
      name: "National Uniform Claim Committee Taxonomy",
      description: "Provider specialty classifications (3-tier hierarchy)",
      update: "Annually",
      coverage: "All provider types",
      useCases: ["Provider categorization", "Specialty analysis", "Network design"],
      gapPriority: null
    },
    "Billing Codes": {
      name: "Standardized Billing Codes",
      description: "21,000+ codes (CPT, HCPCS, DRG, NDC) with Payerset categories",
      update: "Annually",
      coverage: "Comprehensive medical/surgical/pharmacy codes",
      useCases: ["Code standardization", "Category grouping", "Service analysis"],
      gapPriority: null
    },
    "Aggregated Claims": {
      name: "Claims Intelligence (Premium Tier)",
      description: "Actual payment patterns, utilization trends, anonymized",
      update: "Quarterly",
      coverage: "Multi-payer aggregated data",
      useCases: ["Utilization benchmarks", "Market trends", "Cost modeling"],
      gapPriority: null
    },
    "Geographic Data": {
      name: "Geographic & Market Data",
      description: "GPCI adjusters, county/ZIP mapping, market definitions",
      update: "Annually",
      coverage: "National",
      useCases: ["Geographic rate adjustment", "Local market analysis"],
      gapPriority: null
    }
  },

  // PARTIAL / GAPS
  partial: {
    "Employer Claims": {
      name: "Employer-Specific Claims Data",
      description: "Employer must provide own claims file",
      status: "Employer-dependent",
      impact: "Limits personalization, requires employer upload",
      workaround: "Use aggregated claims for category-level analysis",
      gapPriority: "Medium"
    },
    "Provider Ownership": {
      name: "Health System Ownership & Affiliations",
      description: "NPPES has some, but incomplete coverage of M&A",
      status: "Partial in NPPES, gaps in recent changes",
      impact: "Limits network concentration analysis",
      workaround: "Manual research for key markets",
      gapPriority: "Medium"
    },
    "Pharmacy Data": {
      name: "Pharmacy Pricing & Claims",
      description: "Some in claims files if available, but limited",
      status: "Partial (only if in employer claims)",
      impact: "Can't do comprehensive PBM analysis",
      workaround: "Focus on medical transparency first",
      gapPriority: "Medium"
    },
    "Plan Design": {
      name: "Benefit Plan Design Details",
      description: "Deductibles, copays, coinsurance, OOPM",
      status: "Employer must provide",
      impact: "Limits cost estimator accuracy, benefit modeling",
      workaround: "Use market averages, request employer upload",
      gapPriority: "Lower"
    }
  },

  // CRITICAL GAPS
  critical: {
    "Quality Data": {
      name: "Provider Quality & Safety Data",
      description: "Leapfrog grades, CMS outcomes, HEDIS, patient experience (HCAHPS)",
      status: "NOT AVAILABLE - Requires external partnership",
      impact: "BLOCKS HIGH-VALUE USE CASES: Quality-cost integration (E3.1), network optimization (E2.3), provider value scoring",
      acquisitionPath: "Leapfrog partnership (negotiate data license), CMS data integration, outcomes aggregation",
      estimatedTimeline: "3-6 months (legal + commercial negotiation)",
      gapPriority: "HIGHEST - This is THE critical blocker",
      blockedUseCases: ["E3.1", "E2.3", "E2.1", "P1.1 (quality ratings)", "PR1.1 (quality differentiation)"]
    },
    "NADAC Pharmacy": {
      name: "National Average Drug Acquisition Cost (NADAC)",
      description: "Actual drug acquisition costs (what pharmacies really pay)",
      status: "NOT AVAILABLE - Requires CMS integration",
      impact: "BLOCKS PHARMACY USE CASES: Spread pricing detection (E1.1), PBM transparency (E2.4)",
      acquisitionPath: "CMS publishes freely, need to scrape/ingest regularly",
      estimatedTimeline: "1-2 months (integration)",
      gapPriority: "Highest",
      blockedUseCases: ["E1.1 (pharmacy component)", "E2.4 (PBM suite)"]
    },
    "Clinical Guidelines": {
      name: "Clinical Appropriateness Guidelines",
      description: "Evidence-based care guidelines, typical treatment patterns",
      status: "NOT AVAILABLE - Requires medical director or license",
      impact: "Limits outlier detection accuracy (E1.5), care management recommendations",
      acquisitionPath: "License from MCG, InterQual, or hire medical director",
      estimatedTimeline: "3-6 months",
      gapPriority: "Medium",
      blockedUseCases: ["E1.5 (clinical component)"]
    },
    "Contract Database": {
      name: "TPA/PBM/Carrier Contract Library",
      description: "Crowdsourced contracts for red flag detection",
      status: "NOT AVAILABLE - Must build from scratch",
      impact: "Blocks contract intelligence use case (E3.2)",
      acquisitionPath: "Incentivize employers to upload contracts, build over time",
      estimatedTimeline: "12+ months (chicken-egg problem)",
      gapPriority: "Lower (visionary)",
      blockedUseCases: ["E3.2"]
    },
    "Real-Time Data": {
      name: "Real-Time Rate & Network Feeds",
      description: "Daily/weekly MRF updates, claims feeds, TPA APIs",
      status: "NOT AVAILABLE - Currently monthly MRFs, quarterly claims",
      impact: "Limits real-time monitoring (E3.3)",
      acquisitionPath: "Increase scraping frequency, negotiate TPA feeds",
      estimatedTimeline: "6-12 months (infrastructure + partnerships)",
      gapPriority: "Medium",
      blockedUseCases: ["E3.3"]
    },
    "HR Data": {
      name: "Human Resources & Productivity Data",
      description: "Absenteeism, disability, workers' comp, turnover, productivity metrics",
      status: "NOT AVAILABLE - Outside healthcare domain",
      impact: "Blocks total cost of care modeling (E3.4)",
      acquisitionPath: "HRIS integration (ADP, Workday, etc.)",
      estimatedTimeline: "6-12 months",
      gapPriority: "Medium",
      blockedUseCases: ["E3.4"]
    },
    "Behavioral Models": {
      name: "Behavioral Economics & Utilization Models",
      description: "How cost-sharing affects utilization, benefit design optimization",
      status: "NOT AVAILABLE - Requires research & validation",
      impact: "Blocks benefit design optimizer (E3.5)",
      acquisitionPath: "Build ML models, conduct studies, validate predictions",
      estimatedTimeline: "12-18 months",
      gapPriority: "Lower (visionary)",
      blockedUseCases: ["E3.5"]
    },
    "Legal Databases": {
      name: "State Balance Billing Laws, Network Adequacy Regs",
      description: "State-by-state legal requirements for RBP, network design",
      status: "NOT AVAILABLE - Requires legal research",
      impact: "Limits RBP support (E2.2), network optimization (E2.3) defensibility",
      acquisitionPath: "Legal team research, maintain database by state",
      estimatedTimeline: "2-3 months (initial), ongoing maintenance",
      gapPriority: "Medium",
      blockedUseCases: ["E2.2", "E2.3 (compliance component)"]
    },
    "Rebate Data": {
      name: "PBM Rebate Benchmarks",
      description: "Typical rebate percentages, retention patterns",
      status: "NOT AVAILABLE - Industry secret, not publicly disclosed",
      impact: "Limits PBM rebate analysis (E2.4)",
      acquisitionPath: "Aggregate from employers, industry reports, build benchmarks",
      estimatedTimeline: "6-12 months",
      gapPriority: "Medium",
      blockedUseCases: ["E2.4 (rebate component)"]
    }
  },

  // PRIORITY RANKING
  priorities: {
    "Highest Priority - Acquire ASAP": [
      "Quality Data (Leapfrog, CMS outcomes) - BLOCKS 8-12 high-value use cases",
      "NADAC Pharmacy Pricing - BLOCKS pharmacy transparency suite"
    ],
    "Medium Priority - 3-6 Months": [
      "Clinical Appropriateness Guidelines",
      "State Legal Databases (balance billing, network adequacy)",
      "Provider Ownership/Affiliation Database",
      "Real-Time Data Infrastructure",
      "Rebate Benchmarks"
    ],
    "Lower Priority - 6-12+ Months": [
      "Contract Intelligence Database (build over time)",
      "HR/Productivity Data Integration",
      "Behavioral Economics Models",
      "Outcomes Tracking Systems"
    ]
  },

  // SUMMARY STATS
  stats: {
    availableDataSources: 8,
    partialGaps: 4,
    criticalGaps: 9,
    totalDataCategories: 21,
    dataReadinessPercentage: 57  // (8 available + 2 partial workarounds) / 21 * 100
  },

  // KEY RECOMMENDATIONS
  recommendations: [
    {
      priority: "HIGHEST - CRITICAL",
      action: "START LEAPFROG PARTNERSHIP DISCUSSIONS IMMEDIATELY",
      rationale: "Quality data is the #1 blocker preventing PBGH-style value-based provider selection. This unlocks E3.1, E2.3, E2.1, and differentiates Payerset from all competitors.",
      estimatedROI: "Unlocks 8-12 use cases, enables 'find the Dr. Rodis providers' value proposition",
      timeline: "3-6 months (legal/commercial negotiation)"
    },
    {
      priority: "HIGHEST - CRITICAL",
      action: "Integrate NADAC pharmacy pricing data (CMS scraping)",
      rationale: "Enables pharmacy spread pricing detection (employer 'gotcha' moment) and PBM transparency suite",
      estimatedROI: "Unlocks E1.1 pharmacy component, E2.4 PBM suite",
      timeline: "1-2 months (engineering)"
    },
    {
      priority: "MEDIUM - HIGH",
      action: "Build state legal database (balance billing, network adequacy)",
      rationale: "Required for defensible RBP support and network optimization compliance",
      estimatedROI: "De-risks E2.2, E2.3 legal exposure",
      timeline: "2-3 months (legal research)"
    },
    {
      priority: "MEDIUM",
      action: "License clinical appropriateness guidelines (MCG, InterQual) or hire medical director",
      rationale: "Improves outlier detection accuracy, enables care management recommendations",
      estimatedROI: "Enhances E1.5 clinical component",
      timeline: "3-6 months"
    }
  ]
};
