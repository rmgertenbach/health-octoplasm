// Healthcare Transparency Glossary Data
// Terms and definitions for timeline tooltips

const glossaryTerms = {
  // Major Legislation
  "ERISA": "Employee Retirement Income Security Act of 1974. Established that employer benefit plans are subject to fiduciary duty - employers must act in employees' best interest, not vendors'.",

  "HIPAA": "Health Insurance Portability and Accountability Act of 1996. Protected patient health information but was weaponized by TPAs to hide pricing from employers for 25+ years.",

  "ACA": "Affordable Care Act of 2010 (Obamacare). Comprehensive healthcare reform that included transparency provisions like Medical Loss Ratio and rate review, but didn't address negotiated rates.",

  "CAA": "Consolidated Appropriations Act of 2020. Game-changing law that made gag clauses illegal, required broker compensation disclosure, and clarified employer fiduciary duty to use transparency data.",

  // Key Terms
  "Gag Clause": "Contractual provisions that prevent disclosure of provider-specific cost or quality data, claims data, or out-of-network rates. Made illegal by CAA 2020.",

  "Gag Clauses": "Contractual provisions that prevent disclosure of provider-specific cost or quality data, claims data, or out-of-network rates. Made illegal by CAA 2020.",

  "Fiduciary Duty": "Legal obligation for employers to act in participants' best interest when managing benefit plans. Established by ERISA 1974 but only enforceable after CAA 2020 transparency requirements.",

  "Spread Pricing": "When a middleman (PBM or TPA) charges the employer more than they actually pay the provider or pharmacy, pocketing the difference. Can be 100-600% markup on some drugs.",

  "Chargemaster": "Hospital's full list of charges for every service. Typically 3-5x actual payment amounts and completely meaningless for price comparison. Required to be public but largely ignored.",

  "Medical Loss Ratio": "The 80/20 rule from ACA requiring insurers to spend 80-85% of premiums on medical care (vs. administration/profit). Must report annually and issue rebates if they miss the target.",

  "MLR": "Medical Loss Ratio. The 80/20 rule from ACA requiring insurers to spend 80-85% of premiums on medical care (vs. administration/profit).",

  // Organizations & Players
  "TPA": "Third-Party Administrator. Company that processes claims and manages benefits for self-insured employers. Often takes hidden fees through spread pricing.",

  "PBM": "Pharmacy Benefit Manager. Middleman between employers and pharmacies that negotiates drug prices. Known for spread pricing and rebate retention.",

  "CMS": "Centers for Medicare & Medicaid Services. Federal agency that issued hospital and payer transparency rules in 2019-2020.",

  "PBGH": "Pacific Business Group on Health. Conducted 2023 demonstration project proving transparency works - 100+ employers found 20-30% overpayment.",

  // Data & Files
  "MRF": "Machine-Readable File. JSON files that health plans and insurers must publish monthly showing all negotiated rates with all providers. Required by Transparency in Coverage rule effective July 2022.",

  "MRFs": "Machine-Readable Files. JSON files that health plans and insurers must publish monthly showing all negotiated rates with all providers. Required by Transparency in Coverage rule effective July 2022.",

  "NPI": "National Provider Identifier. Unique 10-digit number for healthcare providers used to identify them in MRF files and claims data.",

  // Contracting & Pricing
  "Direct Contracting": "When employers negotiate directly with hospitals/providers, bypassing TPAs and their markups. Can save 20-40% on common procedures.",

  "Reference-Based Pricing": "Setting maximum payment for services based on a benchmark (e.g., Medicare rates + 140%) rather than accepting billed charges. Forces providers to justify pricing.",

  "Surprise Billing": "Unexpected out-of-network charges, often from emergency care or out-of-network providers at in-network facilities. Limited by No Surprises Act in CAA 2020.",

  "Network Adequacy": "Requirement that health plans include sufficient providers to ensure timely access to care. Used to justify keeping expensive, low-quality providers in network.",

  // Quality & Safety
  "Leapfrog": "Independent nonprofit that rates hospital safety and quality with letter grades (A-F). Often shows expensive hospitals have worse safety than cheaper alternatives.",

  // Plan Types
  "Self-Insured": "When an employer directly pays employee medical claims rather than buying insurance. Covers about 160 million Americans and gives employers more flexibility but more risk.",

  "Stop-Loss Insurance": "Insurance that protects self-insured employers from catastrophic claims. Kicks in when individual claims exceed a threshold (e.g., $250K).",

  // Transparency Rules
  "Hospital Price Transparency": "CMS rule from November 2019 requiring hospitals to publicly post machine-readable files with all negotiated rates. Effective January 2021. Penalty: $300/day for non-compliance.",

  "Transparency in Coverage": "Tri-agency rule from November 2020 requiring health plans to publish MRFs showing all negotiated rates and out-of-network allowed amounts. Effective July 2022.",

  // Other Key Terms
  "AEOB": "Advanced Explanation of Benefits. Good-faith estimate of costs that providers must give before service. Required by CAA 2020.",

  "Rebate": "Money paid by drug manufacturers to PBMs. Often retained by PBM rather than passed to employer - another form of spread pricing.",

  "Utilization Management": "Process of reviewing and approving medical services before they're provided. Often used to delay or deny care to save money."
};

// Export for use in timeline
if (typeof module !== 'undefined' && module.exports) {
  module.exports = glossaryTerms;
}
