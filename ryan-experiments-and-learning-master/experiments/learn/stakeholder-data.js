// Healthcare Stakeholder Map Data
// Comprehensive stakeholder definitions, relationships, and data sources

const StakeholderData = {
  // ============================================================================
  // STAKEHOLDER DEFINITIONS
  // ============================================================================

  stakeholders: {
    // GREEN (ALIGNED) - The Good Guys
    'self-insured-employers': {
      id: 'self-insured-employers',
      label: 'Self-Insured\nEmployers',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-briefcase',
      layer: 'simple', // visible in all layers
      description: 'Companies that directly pay employee healthcare costs instead of buying insurance. They bear the financial risk and have the most to gain from transparency.',
      metrics: {
        coverage: '160M Americans',
        spending: '$350B+ annually',
        avgPlan: '$12-15K per employee',
        wastage: '30-50% overpayment typical'
      },
      incentives: {
        aligned: ['Lower costs', 'Better outcomes', 'Happy employees', 'Fiduciary duty'],
        misaligned: ['Information asymmetry', 'Conflicted advisors', 'Incumbent inertia']
      },
      dataSources: {
        available: [
          { name: 'Employer Reporting Plans', records: '50K+ plans', source: 'CAA filings', description: 'EIN, plan names, payer relationships' },
          { name: 'TiC Files', records: '500M+ rates', source: 'Payer MRFs', description: 'Negotiated rates by provider' },
          { name: 'Hospital Transparency', records: '300K+ rates', source: 'Hospital MRFs', description: 'Hospital pricing by CPT code' },
          { name: 'Medicare Benchmarks', records: 'All codes', source: 'CMS', description: 'Fair pricing baseline' },
          { name: 'NPPES', records: '7M providers', source: 'CMS', description: 'Provider directory & metadata' }
        ],
        gaps: [
          { name: 'Own Claims Data', priority: 'HIGHEST', impact: 'Cannot analyze actual spending patterns', solution: 'Request from TPA, use claims clearinghouse' },
          { name: 'Leapfrog Quality Grades', priority: 'HIGHEST', impact: 'Cannot optimize for quality', solution: 'Leapfrog API integration' },
          { name: 'TPA Fee Transparency', priority: 'HIGH', impact: 'Hidden costs in spread pricing', solution: 'Regulatory requirement needed' },
          { name: 'Contract Terms', priority: 'MEDIUM', impact: 'Cannot compare TPA offerings', solution: 'Standardized disclosure' }
        ]
      },
      queries: [
        'Show me all hospitals charging >200% of Medicare in my area',
        'Which providers offer Grade A quality at Medicare+100-150%?',
        'How much is my TPA marking up vs. what providers actually receive?',
        'Calculate potential savings from direct contracts with high-value providers'
      ],
      actions: [
        { label: 'Benchmark Your Rates', link: '../employers/benchmark.html' },
        { label: 'Detect Spread Pricing', link: '../employers/spread-calculator.html' },
        { label: 'Find High-Value Providers', link: '../patients/search.html' }
      ],
      power: {
        has: ['Money', 'Can switch TPAs', 'Fiduciary duty', 'CAA transparency rights'],
        lacks: ['Claims data access', 'Negotiating leverage', 'Healthcare expertise', 'Time']
      }
    },

    'patients': {
      id: 'patients',
      label: 'Patients\n(Employees & Families)',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-hospital',
      layer: 'simple',
      description: 'Individuals receiving healthcare. With high deductibles ($3K-$7K typical), they bear significant costs but have the least information.',
      metrics: {
        coverage: '160M in self-insured plans',
        avgDeductible: '$3,000-7,000',
        surpriseBills: '1 in 5 ER visits',
        priceVariation: '5-10x for same procedure'
      },
      incentives: {
        aligned: ['Lower out-of-pocket costs', 'Quality care', 'No surprise bills', 'Convenience'],
        misaligned: ['Lack of price information', 'Opaque quality data', 'Narrow networks', 'Urgent needs']
      },
      dataSources: {
        available: [
          { name: 'TiC Files', records: '500M+ rates', source: 'Payer MRFs', description: 'See what insurance will pay' },
          { name: 'Hospital Transparency', records: '300K+ rates', source: 'Hospital MRFs', description: 'Cash prices & self-pay discounts' },
          { name: 'NPPES', records: '7M providers', source: 'CMS', description: 'Find providers by specialty/location' },
          { name: 'Medicare Benchmarks', records: 'All codes', source: 'CMS', description: 'Understand fair pricing' }
        ],
        gaps: [
          { name: 'Provider Quality Grades', priority: 'HIGHEST', impact: 'Cannot choose based on outcomes', solution: 'Leapfrog, CMS Star Ratings' },
          { name: 'Real-Time Prices', priority: 'HIGH', impact: 'Rates are historical', solution: 'Real-time price estimation tools' },
          { name: 'Out-of-Pocket Estimator', priority: 'HIGH', impact: 'Hard to calculate actual cost', solution: 'Plan-integrated tools' },
          { name: 'Patient Reviews', priority: 'MEDIUM', impact: 'Limited experience data', solution: 'Verified review platforms' }
        ]
      },
      queries: [
        'What will an MRI cost me at different facilities?',
        'Which providers near me have Grade A quality scores?',
        'Should I pay cash or use insurance for this procedure?',
        'How much have I paid toward my deductible?'
      ],
      actions: [
        { label: 'Search & Compare Providers', link: '../patients/search.html' },
        { label: 'Learn How Healthcare Pricing Works', link: '../patients/learn.html' },
        { label: 'Check If Your Bill Is Fair', link: '../patients/index.html#check-bill' }
      ],
      power: {
        has: ['Can choose providers (in-network)', 'Can pay cash', 'Can appeal bills', 'No Surprises Act protections'],
        lacks: ['Price transparency', 'Quality information', 'Healthcare literacy', 'Negotiating power']
      }
    },

    'high-quality-providers': {
      id: 'high-quality-providers',
      label: 'High-Quality\nProviders',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-user-doctor',
      layer: 'simple',
      description: 'Grade A/B providers charging fair prices (Medicare+100-150%). They compete on value but lose volume to expensive, low-quality competitors.',
      metrics: {
        qualityGrade: 'A or B (Leapfrog)',
        pricing: 'Medicare + 100-150%',
        outcomes: 'Better than average',
        patientSat: '4+ stars'
      },
      incentives: {
        aligned: ['Fair payment', 'Patient volume', 'Quality reputation', 'Direct relationships'],
        misaligned: ['Excluded from TPA networks', 'Late payments', 'High denials', 'Administrative burden']
      },
      dataSources: {
        available: [
          { name: 'Hospital Transparency', records: 'Own rates', source: 'Self-published', description: 'Required to publish prices' },
          { name: 'TiC Files', records: 'Competitor rates', source: 'Payer MRFs', description: 'See market positioning' },
          { name: 'Medicare Benchmarks', records: 'All procedures', source: 'CMS', description: 'Fair pricing baseline' },
          { name: 'NPPES', records: 'Own info', source: 'CMS', description: 'Public provider data' }
        ],
        gaps: [
          { name: 'Own Quality Data', priority: 'HIGHEST', impact: 'Cannot prove value proposition', solution: 'Submit to Leapfrog' },
          { name: 'Employer Contact Data', priority: 'HIGH', impact: 'Hard to reach decision makers', solution: 'Employer coalitions' },
          { name: 'Claims Volume by Employer', priority: 'MEDIUM', impact: 'Cannot target outreach', solution: 'Market intelligence tools' },
          { name: 'Contract Templates', priority: 'MEDIUM', impact: 'Hard to structure direct deals', solution: 'Standardized frameworks' }
        ]
      },
      queries: [
        'How do my rates compare to competitors for hip replacements?',
        'Which local employers have high claims volume for my specialties?',
        'What would a direct contract save an employer vs. TPA rates?',
        'How can I showcase my Grade A quality to employers?'
      ],
      actions: [
        { label: 'See Your Market Position', link: '../providers/market-intel.html' },
        { label: 'Build Direct Contract Proposals', link: '../providers/index.html' },
        { label: 'Understand the Opportunity', link: '../providers/index.html#win-win' }
      ],
      power: {
        has: ['Quality data', 'Clinical expertise', 'Fair pricing', 'Can refuse TPA contracts'],
        lacks: ['Employer access', 'Marketing resources', 'Volume guarantees', 'Payment leverage']
      }
    },

    'unconflicted-consultants': {
      id: 'unconflicted-consultants',
      label: 'Unconflicted\nConsultants',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-user-tie',
      layer: 'standard',
      description: 'Fee-only benefits consultants who work solely for employer interests. No commissions from TPAs/carriers.',
      metrics: {
        compensation: 'Fee-only (no commissions)',
        fiduciary: 'Yes',
        avgSavings: '15-30% for clients',
        adoption: 'Growing but still minority'
      },
      incentives: {
        aligned: ['Client results', 'Cost savings', 'Quality outcomes', 'Reputation'],
        misaligned: ['Smaller market', 'Harder sales cycle', 'Incumbent resistance']
      },
      dataSources: {
        available: [
          { name: 'All Transparency Data', records: 'Full access', source: 'Public', description: 'Can analyze for clients' },
          { name: 'Client Claims Data', records: 'Per engagement', source: 'Employer', description: 'Actual spending patterns' },
          { name: 'Benchmark Tools', records: 'Analysis', source: 'Multiple', description: 'Compare client performance' }
        ],
        gaps: [
          { name: 'TPA Performance Data', priority: 'HIGH', impact: 'Hard to compare TPAs', solution: 'Standardized reporting' },
          { name: 'Stop-Loss Analytics', priority: 'MEDIUM', impact: 'Risk assessment limited', solution: 'Reinsurer data sharing' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Healthcare expertise', 'Employer trust', 'No conflicts', 'Data access'],
        lacks: ['Scale', 'Marketing budget', 'Incumbent relationships']
      }
    },

    'employer-coalitions': {
      id: 'employer-coalitions',
      label: 'Employer\nCoalitions',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-users',
      layer: 'detailed',
      description: 'Organizations like PBGH that represent employer interests, advocate for transparency, and facilitate direct contracting.',
      metrics: {
        members: 'Hundreds of employers',
        leverage: 'Collective bargaining power',
        focus: 'Transparency & value-based care'
      },
      incentives: {
        aligned: ['Member savings', 'Quality improvements', 'Market transformation', 'Policy advocacy'],
        misaligned: ['Slow consensus', 'Limited enforcement power']
      },
      dataSources: {
        available: [
          { name: 'Member Data', records: 'Coalition-wide', source: 'Members', description: 'Aggregated benchmarking' },
          { name: 'Public Data', records: 'All sources', source: 'Federal', description: 'Transparency analysis' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Collective voice', 'Best practices', 'Provider relationships', 'Policy influence'],
        lacks: ['Enforcement authority', 'Individual control', 'Rapid execution']
      }
    },

    'regulators-enforcement': {
      id: 'regulators-enforcement',
      label: 'Regulators\n(DOL, CMS, FTC)',
      category: 'aligned',
      color: 'var(--color-success)',
      icon: 'fa-gavel',
      layer: 'standard',
      description: 'Federal agencies enforcing transparency requirements (CAA, No Surprises Act) and monitoring market consolidation.',
      metrics: {
        laws: 'CAA 2021, No Surprises Act, Hospital Price Transparency',
        enforcement: 'Increasing but underfunded',
        penalties: 'Up to $100/day per violation'
      },
      incentives: {
        aligned: ['Public interest', 'Market competition', 'Consumer protection', 'Statutory mandate'],
        misaligned: ['Limited resources', 'Industry lobbying', 'Political pressure', 'Regulatory capture']
      },
      dataSources: {
        available: [
          { name: 'Compliance Data', records: 'All filers', source: 'Mandatory submissions', description: 'TiC files, MRFs, reporting' },
          { name: 'Complaint Data', records: 'Consumer reports', source: 'Public', description: 'Violations and issues' }
        ],
        gaps: [
          { name: 'Enforcement Resources', priority: 'HIGHEST', impact: 'Cannot police all violations', solution: 'Increased funding' },
          { name: 'Data Validation', priority: 'HIGH', impact: 'Cannot verify accuracy', solution: 'Automated checking tools' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Rulemaking authority', 'Enforcement power', 'Penalty assessment', 'Bully pulpit'],
        lacks: ['Adequate funding', 'Industry expertise', 'Rapid response', 'Political independence']
      }
    },

    // RED (MISALIGNED) - The Problems
    'tpas-carriers': {
      id: 'tpas-carriers',
      label: 'TPAs &\nCarriers',
      category: 'misaligned',
      color: 'var(--color-error)',
      icon: 'fa-building',
      layer: 'simple',
      description: 'Third-party administrators who process claims and "negotiate" rates. They take ZERO risk but extract 20-40% through spread pricing, float income, and hidden fees.',
      metrics: {
        market: '$100B+ annual fees',
        risk: 'ZERO (employers bear all risk)',
        spread: '20-40% markup typical',
        transparency: 'Deliberately opaque'
      },
      incentives: {
        aligned: ['None (perverse incentives only)'],
        misaligned: ['Spread pricing revenue', 'Float income', 'Rebate retention', 'Data monopoly', 'Complexity preservation']
      },
      dataSources: {
        available: [
          { name: 'TiC Files', records: '500M+ rates', source: 'Required disclosure', description: 'Negotiated rates they claim' },
          { name: 'Employer Reporting', records: '50K+ plans', source: 'CAA filings', description: 'Which plans they administer' }
        ],
        gaps: [
          { name: 'Actual Fees Paid', priority: 'HIGHEST', impact: 'Spread pricing hidden', solution: 'Mandatory fee disclosure' },
          { name: 'Provider Payment Data', priority: 'HIGHEST', impact: 'Cannot calculate spread', solution: 'Payment transparency' },
          { name: 'Denial Rates', priority: 'HIGH', impact: 'Service quality hidden', solution: 'Performance reporting' },
          { name: 'Float Income', priority: 'MEDIUM', impact: 'Payment delays generate profit', solution: 'Payment timing disclosure' }
        ]
      },
      queries: [
        'What is the spread between employer payment and provider receipt?',
        'How long do TPAs hold payments before paying providers?',
        'What percentage of claims are denied?',
        'What are total fees including spread, PEPM, and ancillary charges?'
      ],
      actions: [
        { label: 'Calculate Potential Spread', link: '../employers/spread-calculator.html' },
        { label: 'Benchmark True Costs', link: '../employers/benchmark.html' }
      ],
      power: {
        has: ['Network control', 'Claims data monopoly', 'Payment timing', 'Complexity as moat', 'Incumbent relationships'],
        lacks: ['Risk bearing', 'Quality accountability', 'Transparency mandate', 'Alignment with outcomes']
      }
    },

    'pbms': {
      id: 'pbms',
      label: 'PBMs\n(Pharmacy Benefit Managers)',
      category: 'misaligned',
      color: 'var(--color-error)',
      icon: 'fa-pills',
      layer: 'standard',
      description: 'Pharmacy middlemen who negotiate drug prices but keep rebates. Similar spread pricing model to TPAs.',
      metrics: {
        market: '80% of prescriptions',
        rebates: '$150B+ annually',
        retention: '50-90% of rebates kept',
        transparency: 'Near zero'
      },
      incentives: {
        aligned: ['None'],
        misaligned: ['Rebate retention', 'Spread pricing', 'Formulary steering to expensive drugs', 'Complexity']
      },
      dataSources: {
        available: [
          { name: 'Limited Transparency', records: 'Minimal', source: 'Some state laws', description: 'Insufficient disclosure' }
        ],
        gaps: [
          { name: 'Rebate Data', priority: 'HIGHEST', impact: 'Hidden pharmacy costs', solution: 'Pass-through PBMs, transparency laws' },
          { name: 'Spread Pricing', priority: 'HIGHEST', impact: 'Employer overcharging', solution: 'Mandatory disclosure' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Formulary control', 'Rebate negotiations', 'Pharmacy network', 'Data opacity'],
        lacks: ['Regulatory oversight', 'Transparency requirements', 'Accountability']
      }
    },

    'conflicted-consultants': {
      id: 'conflicted-consultants',
      label: 'Conflicted\nConsultants',
      category: 'misaligned',
      color: 'var(--color-error)',
      icon: 'fa-user-secret',
      layer: 'standard',
      description: 'Benefits consultants who receive commissions from TPAs/carriers. They recommend based on compensation, not client interest.',
      metrics: {
        compensation: '3-8% commission from carrier',
        conflict: 'Paid by vendors, not clients',
        market: 'Still majority of consultants',
        fiduciary: 'No'
      },
      incentives: {
        aligned: ['Minimal (need to keep client)'],
        misaligned: ['TPA/carrier commissions', 'Override bonuses', 'Incumbent preservation', 'Status quo bias']
      },
      dataSources: {
        available: [
          { name: 'Public Data', records: 'Limited', source: 'Various', description: 'Can access transparency data but incentive not to use' }
        ],
        gaps: [
          { name: 'Commission Disclosure', priority: 'HIGH', impact: 'Conflicts hidden from employers', solution: 'Mandatory disclosure' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Employer relationships', 'Healthcare expertise', 'Vendor access'],
        lacks: ['Fiduciary duty', 'Alignment', 'Transparency']
      }
    },

    'low-quality-providers': {
      id: 'low-quality-providers',
      label: 'Low-Quality\nProviders',
      category: 'misaligned',
      color: 'var(--color-error)',
      icon: 'fa-hospital',
      layer: 'detailed',
      description: 'Grade C/D providers charging 200-400% of Medicare. Poor outcomes, high complications, but included in every network.',
      metrics: {
        qualityGrade: 'C, D, or No Data',
        pricing: 'Medicare + 200-400%',
        outcomes: 'Below average',
        volume: 'High (in all networks)'
      },
      incentives: {
        aligned: ['Volume maximization', 'Price maximization'],
        misaligned: ['Quality avoidance', 'Transparency resistance', 'Market power abuse']
      },
      dataSources: {
        available: [
          { name: 'Hospital Transparency', records: 'Own rates', source: 'Required', description: 'Must publish prices (often non-compliant)' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Market monopolies', 'Network inclusion', 'Brand recognition', 'Facility leverage'],
        lacks: ['Quality results', 'Cost competitiveness', 'Transparency']
      }
    },

    'hospital-monopolies': {
      id: 'hospital-monopolies',
      label: 'Hospital\nMonopolies',
      category: 'misaligned',
      color: 'var(--color-error)',
      icon: 'fa-building-shield',
      layer: 'detailed',
      description: 'Consolidated health systems that dominate markets and extract monopoly pricing. Often acquire high-quality independent providers and raise their prices.',
      metrics: {
        consolidation: '70% of markets highly concentrated',
        priceIncrease: '20-40% post-acquisition',
        leverage: 'Must-have status in networks'
      },
      incentives: {
        aligned: ['Market power'],
        misaligned: ['Price extraction', 'Competition elimination', 'Independence acquisition']
      },
      dataSources: {
        available: [
          { name: 'Hospital Transparency', records: '300K+ rates', source: 'Required', description: 'Monopoly pricing visible' },
          { name: 'TiC Files', records: 'Negotiated rates', source: 'Payers', description: 'Shows pricing power' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Market dominance', 'Must-have status', 'Political influence', 'Acquisition capital'],
        lacks: ['Competition', 'Accountability', 'Alignment']
      }
    },

    // YELLOW (MIXED) - Context Dependent
    'reinsurers': {
      id: 'reinsurers',
      label: 'Reinsurers\n(Stop-Loss)',
      category: 'mixed',
      color: 'var(--color-warning)',
      icon: 'fa-shield-halved',
      layer: 'standard',
      description: 'Provide catastrophic coverage for self-insured employers. Legitimate risk transfer but often opaque pricing and terms.',
      metrics: {
        market: 'Most self-insured plans',
        attachment: '$100K-500K per person',
        pricing: 'Risk-based but opaque'
      },
      incentives: {
        aligned: ['Risk transfer', 'Catastrophic protection'],
        misaligned: ['Premium maximization', 'Claim disputes', 'Complexity']
      },
      dataSources: {
        available: [
          { name: 'Limited Public Data', records: 'Minimal', source: 'State filings', description: 'Varies by state' }
        ],
        gaps: [
          { name: 'Pricing Transparency', priority: 'MEDIUM', impact: 'Hard to compare reinsurers', solution: 'Rate filing requirements' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Risk assessment', 'Capital reserves', 'Pricing leverage'],
        lacks: ['Claims control', 'Direct employer relationships']
      }
    },

    'quality-orgs': {
      id: 'quality-orgs',
      label: 'Quality\nOrganizations',
      category: 'mixed',
      color: 'var(--color-warning)',
      icon: 'fa-medal',
      layer: 'standard',
      description: 'Leapfrog, NCQA, NQF - collect and publish quality data. Helpful but often behind paywalls or limited access.',
      metrics: {
        coverage: '2,000+ hospitals (Leapfrog)',
        grades: 'A, B, C, D, or No Data',
        access: 'Free for consumers, paid for bulk'
      },
      incentives: {
        aligned: ['Quality measurement', 'Public transparency', 'Better outcomes'],
        misaligned: ['Funding needs', 'Hospital participation voluntary', 'Limited coverage']
      },
      dataSources: {
        available: [
          { name: 'Leapfrog Grades', records: '2,000+ hospitals', source: 'Self-reported', description: 'A-F safety grades' },
          { name: 'CMS Star Ratings', records: 'Medicare providers', source: 'Claims data', description: 'Quality measures' }
        ],
        gaps: [
          { name: 'API Access', priority: 'HIGH', impact: 'Cannot integrate at scale', solution: 'Public API for grades' },
          { name: 'Provider Coverage', priority: 'MEDIUM', impact: 'Many providers not graded', solution: 'Mandatory participation' }
        ]
      },
      queries: [],
      actions: [],
      power: {
        has: ['Quality expertise', 'Measurement standards', 'Public trust'],
        lacks: ['Enforcement power', 'Comprehensive coverage', 'Real-time data']
      }
    },

    'health-tech': {
      id: 'health-tech',
      label: 'Health Tech\nVendors',
      category: 'mixed',
      color: 'var(--color-warning)',
      icon: 'fa-laptop-medical',
      layer: 'detailed',
      description: 'Technology companies offering solutions - navigation, price transparency, utilization management. Some aligned, some just more middlemen.',
      metrics: {
        market: 'Rapidly growing',
        models: 'PEPM, % savings, subscription',
        value: 'Varies widely'
      },
      incentives: {
        aligned: ['Better tools', 'User experience', 'Cost savings'],
        misaligned: ['PEPM extraction', 'Data collection', 'Vendor lock-in']
      },
      dataSources: {
        available: [
          { name: 'Public Data', records: 'All sources', source: 'Federal', description: 'Base for solutions' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Technology', 'User experience', 'Innovation'],
        lacks: ['Trust', 'Integration', 'Proven ROI']
      }
    },

    // BLUE (NEUTRAL) - Infrastructure
    'data-providers': {
      id: 'data-providers',
      label: 'Data Providers\n(Payerset)',
      category: 'neutral',
      color: 'var(--color-patient-primary)',
      icon: 'fa-database',
      layer: 'standard',
      description: 'Organizations that aggregate, clean, and provide access to transparency data. Enable the ecosystem but need sustainable business models.',
      metrics: {
        coverage: 'All federal transparency data',
        update: 'Monthly refreshes',
        processing: 'Billions of records'
      },
      incentives: {
        aligned: ['Data quality', 'Access', 'Innovation enablement'],
        misaligned: ['Sustainability challenges', 'Monetization pressure']
      },
      dataSources: {
        available: [
          { name: 'All Public Sources', records: 'Comprehensive', source: 'Federal', description: 'TiC, Hospital, NPPES, Medicare' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Data infrastructure', 'Technical expertise', 'Aggregation'],
        lacks: ['End-user relationships', 'Distribution', 'Business model clarity']
      }
    },

    'regulators-rulemaking': {
      id: 'regulators-rulemaking',
      label: 'Regulators\n(Rule-Making)',
      category: 'neutral',
      color: 'var(--color-patient-primary)',
      icon: 'fa-book-open',
      layer: 'detailed',
      description: 'Federal agencies creating transparency requirements and market rules. Set the framework but don\'t enforce directly.',
      metrics: {
        rules: 'CAA, No Surprises Act, Hospital Price Transparency',
        process: '2-3 years per major rule',
        implementation: 'Ongoing'
      },
      incentives: {
        aligned: ['Public interest', 'Market function', 'Consumer protection'],
        misaligned: ['Political pressure', 'Industry lobbying', 'Resource constraints']
      },
      dataSources: {
        available: [
          { name: 'Public Comments', records: 'Thousands per rule', source: 'Stakeholders', description: 'Policy input' }
        ],
        gaps: []
      },
      queries: [],
      actions: [],
      power: {
        has: ['Rulemaking authority', 'Public platform', 'Statutory mandate'],
        lacks: ['Speed', 'Enforcement resources', 'Industry expertise']
      }
    }
  },

  // ============================================================================
  // GRAPH STRUCTURE & RELATIONSHIPS
  // ============================================================================

  layers: {
    simple: {
      name: 'Simple View',
      description: '7 key stakeholders - the essential ecosystem',
      nodes: ['self-insured-employers', 'patients', 'high-quality-providers', 'tpas-carriers', 'low-quality-providers', 'regulators-enforcement', 'data-providers']
    },
    standard: {
      name: 'Standard View',
      description: '12 stakeholders - complete picture',
      nodes: ['self-insured-employers', 'patients', 'high-quality-providers', 'unconflicted-consultants',
              'tpas-carriers', 'pbms', 'conflicted-consultants', 'low-quality-providers',
              'reinsurers', 'quality-orgs', 'regulators-enforcement', 'data-providers']
    },
    detailed: {
      name: 'Detailed View',
      description: '17 stakeholders - full complexity',
      nodes: ['self-insured-employers', 'patients', 'high-quality-providers', 'unconflicted-consultants', 'employer-coalitions',
              'tpas-carriers', 'pbms', 'conflicted-consultants', 'low-quality-providers', 'hospital-monopolies',
              'reinsurers', 'quality-orgs', 'health-tech',
              'regulators-enforcement', 'regulators-rulemaking', 'data-providers']
    }
  },

  // Relationships define edges between stakeholders
  relationships: [
    // Money flows
    { from: 'self-insured-employers', to: 'tpas-carriers', type: 'money', label: '$100M', thickness: 10, color: '#e74c3c' },
    { from: 'tpas-carriers', to: 'high-quality-providers', type: 'money', label: '$35M', thickness: 6, color: '#27ae60' },
    { from: 'tpas-carriers', to: 'low-quality-providers', type: 'money', label: '$35M', thickness: 6, color: '#e74c3c' },
    { from: 'self-insured-employers', to: 'patients', type: 'money', label: 'Premium + Benefits', thickness: 5, color: '#3498db' },
    { from: 'patients', to: 'high-quality-providers', type: 'money', label: 'Deductible/Copay', thickness: 3, color: '#27ae60' },
    { from: 'patients', to: 'low-quality-providers', type: 'money', label: 'Deductible/Copay', thickness: 3, color: '#e74c3c' },

    // Services & relationships
    { from: 'high-quality-providers', to: 'patients', type: 'service', label: 'Quality Care', thickness: 4, color: '#27ae60' },
    { from: 'low-quality-providers', to: 'patients', type: 'service', label: 'Mediocre Care', thickness: 4, color: '#e74c3c' },
    { from: 'tpas-carriers', to: 'self-insured-employers', type: 'service', label: 'Claims Processing', thickness: 3, color: '#95a5a6' },

    // Advisory relationships
    { from: 'unconflicted-consultants', to: 'self-insured-employers', type: 'advice', label: 'Fee-Only Advice', thickness: 2, color: '#27ae60' },
    { from: 'conflicted-consultants', to: 'self-insured-employers', type: 'advice', label: 'Biased Advice', thickness: 2, color: '#e74c3c' },
    { from: 'conflicted-consultants', to: 'tpas-carriers', type: 'money', label: 'Commission', thickness: 2, color: '#e74c3c' },

    // Data flows
    { from: 'data-providers', to: 'self-insured-employers', type: 'data', label: 'Transparency Data', thickness: 2, color: '#3498db' },
    { from: 'data-providers', to: 'patients', type: 'data', label: 'Price Info', thickness: 2, color: '#3498db' },
    { from: 'data-providers', to: 'high-quality-providers', type: 'data', label: 'Market Intel', thickness: 2, color: '#3498db' },

    // Regulatory oversight
    { from: 'regulators-enforcement', to: 'tpas-carriers', type: 'regulation', label: 'TiC Requirements', thickness: 2, color: '#f39c12' },
    { from: 'regulators-enforcement', to: 'high-quality-providers', type: 'regulation', label: 'Transparency', thickness: 1, color: '#f39c12' },
    { from: 'regulators-enforcement', to: 'low-quality-providers', type: 'regulation', label: 'Transparency', thickness: 1, color: '#f39c12' },

    // Quality assessment
    { from: 'quality-orgs', to: 'high-quality-providers', type: 'assessment', label: 'Grade A/B', thickness: 2, color: '#27ae60' },
    { from: 'quality-orgs', to: 'low-quality-providers', type: 'assessment', label: 'Grade C/D', thickness: 2, color: '#e74c3c' },

    // Risk transfer
    { from: 'self-insured-employers', to: 'reinsurers', type: 'insurance', label: 'Stop-Loss Premium', thickness: 3, color: '#f39c12' },
    { from: 'reinsurers', to: 'self-insured-employers', type: 'insurance', label: 'Catastrophic Coverage', thickness: 3, color: '#f39c12' },

    // Pharmacy
    { from: 'tpas-carriers', to: 'pbms', type: 'service', label: 'Rx Management', thickness: 3, color: '#e74c3c' },
    { from: 'pbms', to: 'patients', type: 'service', label: 'Prescriptions', thickness: 2, color: '#95a5a6' },

    // Coalitions
    { from: 'employer-coalitions', to: 'self-insured-employers', type: 'advocacy', label: 'Best Practices', thickness: 2, color: '#27ae60' },
    { from: 'employer-coalitions', to: 'high-quality-providers', type: 'contracting', label: 'Direct Contracts', thickness: 2, color: '#27ae60' },

    // Monopolies
    { from: 'hospital-monopolies', to: 'tpas-carriers', type: 'power', label: 'Must-Have Status', thickness: 4, color: '#e74c3c' },
    { from: 'hospital-monopolies', to: 'high-quality-providers', type: 'acquisition', label: 'Acquisition Target', thickness: 2, color: '#e74c3c' }
  ]
};

// Export for use in HTML file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StakeholderData;
}
