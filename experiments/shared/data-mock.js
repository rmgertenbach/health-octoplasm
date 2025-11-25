/**
 * MOCK DATA - Healthcare Transparency Platform
 * Represents realistic data structure from Payerset
 * Based on: TiC (Payer Transparency), Hospital Transparency, NPPES, Medicare benchmarks
 */

// ================================================================
// PROVIDER DATA (NPPES-like structure)
// ================================================================

const mockProviders = [
  {
    npi: '1234567890',
    name: 'HighQuality Imaging Center',
    orgName: 'HighQuality Imaging Center',
    type: 'Organization',
    specialty: 'Diagnostic Radiology',
    taxonomyCode: '261QR0200X',
    taxonomyGrouping: 'Imaging & Radiology',
    address: '123 Medical Plaza Dr',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    county: 'Travis',
    latitude: 30.2672,
    longitude: -97.7431,
    phone: '(512) 555-0100',
    qualityGrade: 'A',
  },
  {
    npi: '2345678901',
    name: 'MegaHealth Hospital System',
    orgName: 'MegaHealth Hospital System',
    type: 'Organization',
    specialty: 'General Acute Care Hospital',
    taxonomyCode: '282N00000X',
    taxonomyGrouping: 'Hospitals',
    address: '456 Hospital Way',
    city: 'Austin',
    state: 'TX',
    zipCode: '78705',
    county: 'Travis',
    latitude: 30.3072,
    longitude: -97.7331,
    phone: '(512) 555-0200',
    qualityGrade: 'C',
  },
  {
    npi: '3456789012',
    name: 'Austin Orthopedics Group',
    orgName: 'Austin Orthopedics Group',
    type: 'Organization',
    specialty: 'Orthopedic Surgery',
    taxonomyCode: '207X00000X',
    taxonomyGrouping: 'Orthopedic Surgery',
    address: '789 Bone & Joint Blvd',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    county: 'Travis',
    latitude: 30.2472,
    longitude: -97.7631,
    phone: '(512) 555-0300',
    qualityGrade: 'A',
  },
  {
    npi: '4567890123',
    name: 'Community Health Center',
    orgName: 'Community Health Center',
    type: 'Organization',
    specialty: 'General Acute Care Hospital',
    taxonomyCode: '282N00000X',
    taxonomyGrouping: 'Hospitals',
    address: '321 Community Dr',
    city: 'Austin',
    state: 'TX',
    zipCode: '78702',
    county: 'Travis',
    latitude: 30.2772,
    longitude: -97.7231,
    phone: '(512) 555-0400',
    qualityGrade: 'B',
  },
  {
    npi: '5678901234',
    name: 'Premium Surgical Institute',
    orgName: 'Premium Surgical Institute',
    type: 'Organization',
    specialty: 'Ambulatory Surgical Center',
    taxonomyCode: '261QA1903X',
    taxonomyGrouping: 'Ambulatory Surgical Center',
    address: '555 Surgery Center Pkwy',
    city: 'Austin',
    state: 'TX',
    zipCode: '78703',
    county: 'Travis',
    latitude: 30.2872,
    longitude: -97.7531,
    phone: '(512) 555-0500',
    qualityGrade: 'A',
  },
];

// ================================================================
// PROCEDURE/BILLING CODE DATA
// ================================================================

const mockProcedures = {
  'mri': {
    code: '70553',
    codeType: 'CPT',
    name: 'MRI Scan (Brain with Contrast)',
    friendlyName: 'MRI Scan',
    category: 'Imaging & Radiology',
    subcategory: 'MRI & CT Scans',
    description: 'Magnetic resonance imaging of brain with contrast material',
    medicareRate: 850,
    fairRate: 1200, // Medicare + 140%
  },
  'ct-scan': {
    code: '70450',
    codeType: 'CPT',
    name: 'CT Scan (Head without Contrast)',
    friendlyName: 'CT Scan',
    category: 'Imaging & Radiology',
    subcategory: 'MRI & CT Scans',
    description: 'Computed tomography of head without contrast',
    medicareRate: 250,
    fairRate: 350,
  },
  'hip-replacement': {
    code: '27130',
    codeType: 'CPT',
    name: 'Total Hip Replacement',
    friendlyName: 'Hip Replacement',
    category: 'Orthopedic Surgery',
    subcategory: 'Joint Replacement',
    description: 'Total hip arthroplasty',
    medicareRate: 15000,
    fairRate: 21000,
    drgCode: '470',
  },
  'knee-replacement': {
    code: '27447',
    codeType: 'CPT',
    name: 'Total Knee Replacement',
    friendlyName: 'Knee Replacement',
    category: 'Orthopedic Surgery',
    subcategory: 'Joint Replacement',
    description: 'Total knee arthroplasty',
    medicareRate: 16000,
    fairRate: 22400,
    drgCode: '469',
  },
  'colonoscopy': {
    code: '45378',
    codeType: 'CPT',
    name: 'Colonoscopy',
    friendlyName: 'Colonoscopy',
    category: 'Gastroenterology',
    subcategory: 'Endoscopy',
    description: 'Diagnostic colonoscopy',
    medicareRate: 800,
    fairRate: 1120,
  },
  'er-visit': {
    code: '99285',
    codeType: 'CPT',
    name: 'Emergency Room Visit - Level 5',
    friendlyName: 'ER Visit',
    category: 'Emergency Services',
    subcategory: 'Emergency Department',
    description: 'Emergency department visit, high severity',
    medicareRate: 500,
    fairRate: 700,
  },
  'ultrasound': {
    code: '76700',
    codeType: 'CPT',
    name: 'Ultrasound Abdomen',
    friendlyName: 'Ultrasound',
    category: 'Imaging & Radiology',
    subcategory: 'Ultrasound',
    description: 'Ultrasound examination of abdomen',
    medicareRate: 200,
    fairRate: 280,
  },
};

// ================================================================
// NEGOTIATED RATES DATA (TiC structure)
// Represents what different payers/plans actually pay each provider
// ================================================================

const mockNegotiatedRates = [
  // MRI Scan rates
  {
    procedureKey: 'mri',
    npi: '1234567890', // HighQuality Imaging
    providerName: 'HighQuality Imaging Center',
    negotiatedRate: 425,
    negotiationType: 'fee schedule',
    cashPrice: 425,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Outpatient',
  },
  {
    procedureKey: 'mri',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 2800,
    negotiationType: 'fee schedule',
    cashPrice: 2200,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },
  {
    procedureKey: 'mri',
    npi: '4567890123', // Community Health
    providerName: 'Community Health Center',
    negotiatedRate: 1200,
    negotiationType: 'fee schedule',
    cashPrice: 950,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },

  // Hip Replacement rates
  {
    procedureKey: 'hip-replacement',
    npi: '3456789012', // Austin Orthopedics
    providerName: 'Austin Orthopedics Group',
    negotiatedRate: 18000,
    negotiationType: 'DRG',
    cashPrice: 20000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Inpatient',
  },
  {
    procedureKey: 'hip-replacement',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 42000,
    negotiationType: 'DRG',
    cashPrice: 38000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Inpatient',
  },
  {
    procedureKey: 'hip-replacement',
    npi: '5678901234', // Premium Surgical
    providerName: 'Premium Surgical Institute',
    negotiatedRate: 22000,
    negotiationType: 'DRG',
    cashPrice: 24000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Ambulatory Surgical Center',
  },

  // Knee Replacement rates
  {
    procedureKey: 'knee-replacement',
    npi: '3456789012', // Austin Orthopedics
    providerName: 'Austin Orthopedics Group',
    negotiatedRate: 20000,
    negotiationType: 'DRG',
    cashPrice: 22000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Inpatient',
  },
  {
    procedureKey: 'knee-replacement',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 50000,
    negotiationType: 'DRG',
    cashPrice: 45000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Inpatient',
  },

  // Colonoscopy rates
  {
    procedureKey: 'colonoscopy',
    npi: '4567890123', // Community Health
    providerName: 'Community Health Center',
    negotiatedRate: 1800,
    negotiationType: 'fee schedule',
    cashPrice: 1500,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },
  {
    procedureKey: 'colonoscopy',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 4500,
    negotiationType: 'fee schedule',
    cashPrice: 3800,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },
  {
    procedureKey: 'colonoscopy',
    npi: '5678901234', // Premium Surgical
    providerName: 'Premium Surgical Institute',
    negotiatedRate: 2200,
    negotiationType: 'fee schedule',
    cashPrice: 2400,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Ambulatory Surgical Center',
  },

  // CT Scan rates
  {
    procedureKey: 'ct-scan',
    npi: '1234567890', // HighQuality Imaging
    providerName: 'HighQuality Imaging Center',
    negotiatedRate: 300,
    negotiationType: 'fee schedule',
    cashPrice: 300,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Outpatient',
  },
  {
    procedureKey: 'ct-scan',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 2000,
    negotiationType: 'fee schedule',
    cashPrice: 1600,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },

  // ER Visit rates
  {
    procedureKey: 'er-visit',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 3000,
    negotiationType: 'fee schedule',
    cashPrice: 2500,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Emergency Department',
  },
  {
    procedureKey: 'er-visit',
    npi: '4567890123', // Community Health
    providerName: 'Community Health Center',
    negotiatedRate: 1200,
    negotiationType: 'fee schedule',
    cashPrice: 1000,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Emergency Department',
  },

  // Ultrasound rates
  {
    procedureKey: 'ultrasound',
    npi: '1234567890', // HighQuality Imaging
    providerName: 'HighQuality Imaging Center',
    negotiatedRate: 200,
    negotiationType: 'fee schedule',
    cashPrice: 200,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Outpatient',
  },
  {
    procedureKey: 'ultrasound',
    npi: '2345678901', // MegaHealth Hospital
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 1000,
    negotiationType: 'fee schedule',
    cashPrice: 800,
    planName: 'Blue Cross PPO',
    planType: 'Commercial',
    setting: 'Hospital Outpatient',
  },
];

// ================================================================
// EMPLOYER BENCHMARK DATA
// Mock data showing what employers typically pay vs. fair rates
// ================================================================

const mockEmployerData = {
  companyName: 'TechCo Austin',
  employees: 500,
  annualSpend: 8000000,
  planType: 'Self-Insured',
  tpaName: 'MegaTPA Services',

  // Sample procedures with current rates vs. benchmarks
  procedures: [
    {
      procedure: 'MRI Scan',
      procedureKey: 'mri',
      currentRate: 2400,
      medicareRate: 850,
      fairRate: 1200,
      marketMin: 425,
      marketMax: 2800,
      percentOfMedicare: 282,
      overpaymentVsFair: 1200,
      annualVolume: 120,
      annualCost: 288000,
      potentialSavings: 144000,
    },
    {
      procedure: 'Hip Replacement',
      procedureKey: 'hip-replacement',
      currentRate: 38000,
      medicareRate: 15000,
      fairRate: 21000,
      marketMin: 18000,
      marketMax: 42000,
      percentOfMedicare: 253,
      overpaymentVsFair: 17000,
      annualVolume: 15,
      annualCost: 570000,
      potentialSavings: 255000,
    },
    {
      procedure: 'Colonoscopy',
      procedureKey: 'colonoscopy',
      currentRate: 3800,
      medicareRate: 800,
      fairRate: 1120,
      marketMin: 1800,
      marketMax: 4500,
      percentOfMedicare: 475,
      overpaymentVsFair: 2680,
      annualVolume: 80,
      annualCost: 304000,
      potentialSavings: 214400,
    },
    {
      procedure: 'CT Scan',
      procedureKey: 'ct-scan',
      currentRate: 1600,
      medicareRate: 250,
      fairRate: 350,
      marketMin: 300,
      marketMax: 2000,
      percentOfMedicare: 640,
      overpaymentVsFair: 1250,
      annualVolume: 200,
      annualCost: 320000,
      potentialSavings: 250000,
    },
    {
      procedure: 'ER Visit Level 5',
      procedureKey: 'er-visit',
      currentRate: 2800,
      medicareRate: 500,
      fairRate: 700,
      marketMin: 1200,
      marketMax: 3000,
      percentOfMedicare: 560,
      overpaymentVsFair: 2100,
      annualVolume: 150,
      annualCost: 420000,
      potentialSavings: 315000,
    },
  ],

  // Summary statistics
  summary: {
    totalAnnualSpend: 8000000,
    fairMarketSpend: 5600000,
    totalOverpayment: 2400000,
    overpaymentPercent: 0.30,
    proceduresAudited: 5,
    topSavingsOpportunity: 'Colonoscopy',
  },
};

// ================================================================
// SPREAD PRICING DATA
// Mock claims showing negotiated rate vs. actual payment
// ================================================================

const mockSpreadPricingData = [
  {
    claimId: 'CLM-2024-001234',
    date: '2024-01-15',
    procedure: 'MRI Scan',
    procedureCode: '70553',
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 2800,
    employerPaid: 3100,
    providerReceived: 2500,
    spreadAmount: 600,
    spreadPercent: 0.19,
  },
  {
    claimId: 'CLM-2024-001567',
    date: '2024-01-22',
    procedure: 'Hip Replacement',
    procedureCode: '27130',
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 42000,
    employerPaid: 45000,
    providerReceived: 40000,
    spreadAmount: 5000,
    spreadPercent: 0.11,
  },
  {
    claimId: 'CLM-2024-001890',
    date: '2024-02-05',
    procedure: 'Colonoscopy',
    procedureCode: '45378',
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 4500,
    employerPaid: 5200,
    providerReceived: 4200,
    spreadAmount: 1000,
    spreadPercent: 0.19,
  },
  {
    claimId: 'CLM-2024-002123',
    date: '2024-02-18',
    procedure: 'CT Scan',
    procedureCode: '70450',
    providerName: 'MegaHealth Hospital System',
    negotiatedRate: 2000,
    employerPaid: 2300,
    providerReceived: 1850,
    spreadAmount: 450,
    spreadPercent: 0.20,
  },
];

// Summary of spread pricing impact
const spreadPricingSummary = {
  totalClaims: 450,
  totalEmployerPaid: 12500000,
  totalProviderReceived: 10200000,
  totalSpread: 2300000,
  averageSpreadPercent: 0.184,
  medicalSpread: 1400000,
  pharmacySpread: 900000,
};

// ================================================================
// SEARCH & FILTER FUNCTIONS
// ================================================================

/**
 * Search for providers offering a specific procedure
 * @param {string} procedureKey - Procedure identifier
 * @param {string} zipCode - User's ZIP code (for distance calculation)
 * @param {number} userLat - User latitude
 * @param {number} userLon - User longitude
 * @returns {Array} Array of provider options with pricing
 */
function searchProviders(procedureKey, zipCode, userLat = 30.2672, userLon = -97.7431) {
  const procedure = mockProcedures[procedureKey];
  if (!procedure) return [];

  // Find all rates for this procedure
  const rates = mockNegotiatedRates.filter(r => r.procedureKey === procedureKey);

  // Join with provider data
  const results = rates.map(rate => {
    const provider = mockProviders.find(p => p.npi === rate.npi);
    if (!provider) return null;

    // Calculate distance
    const distance = calculateDistance(userLat, userLon, provider.latitude, provider.longitude);

    // Estimate patient out-of-pocket (simplified: 20% coinsurance after deductible)
    const estimatedCost = rate.negotiatedRate * 0.20;

    // Calculate employer savings vs. most expensive option
    const maxRate = Math.max(...rates.map(r => r.negotiatedRate));
    const employerSavings = maxRate - rate.negotiatedRate;

    return {
      ...provider,
      procedure: procedure.friendlyName,
      negotiatedRate: rate.negotiatedRate,
      cashPrice: rate.cashPrice,
      estimatedCost: estimatedCost,
      setting: rate.setting,
      distance: Math.round(distance * 10) / 10,
      employerSavings: employerSavings > 0 ? employerSavings : null,
      nextAvailable: generateNextAvailable(),
      percentOfMedicare: Math.round((rate.negotiatedRate / procedure.medicareRate) * 100),
      recommended: rate.negotiatedRate === Math.min(...rates.map(r => r.negotiatedRate)),
    };
  }).filter(Boolean);

  // Sort by value (price + quality)
  results.sort((a, b) => {
    const qualityScore = { 'A': 3, 'B': 2, 'C': 1, 'D': 0, 'F': -1 };
    const aScore = qualityScore[a.qualityGrade] * 1000 - a.negotiatedRate;
    const bScore = qualityScore[b.qualityGrade] * 1000 - b.negotiatedRate;
    return bScore - aScore;
  });

  return results;
}

/**
 * Get employer benchmark data
 * @returns {Object} Employer benchmark data
 */
function getEmployerBenchmark() {
  return mockEmployerData;
}

/**
 * Get spread pricing analysis
 * @returns {Object} Spread pricing data and summary
 */
function getSpreadPricingAnalysis() {
  return {
    claims: mockSpreadPricingData,
    summary: spreadPricingSummary,
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate random next available appointment
 */
function generateNextAvailable() {
  const options = ['Today', 'Tomorrow', 'Next Week', '2 weeks', '3 weeks'];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get all available procedures
 */
function getAllProcedures() {
  return Object.entries(mockProcedures).map(([key, proc]) => ({
    key,
    ...proc,
  }));
}

// ================================================================
// EXPORT FOR USE
// ================================================================

window.HealthcareData = {
  // Data
  providers: mockProviders,
  procedures: mockProcedures,
  negotiatedRates: mockNegotiatedRates,
  employerData: mockEmployerData,
  spreadPricingData: mockSpreadPricingData,
  spreadPricingSummary: spreadPricingSummary,

  // Functions
  searchProviders,
  getEmployerBenchmark,
  getSpreadPricingAnalysis,
  getAllProcedures,
  calculateDistance,
};
