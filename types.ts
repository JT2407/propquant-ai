
export interface StructuralSubScores {
  roofExterior: number;
  plumbingWater: number;
  hvacElectrical: number;
  guidance: string;
}

export interface PropertyData {
  url: string;
  price: number;
  location: {
    city: string;
    suburb: string;
    country: string;
  };
  type: string;
  yearBuilt?: number;
  condition?: 'new' | 'good' | 'average' | 'poor';
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  hoaLeviesMonthly: number;
  propertyTaxesAnnual: number;
  currency: string;
  confidence: 'low' | 'medium' | 'high';
  isEstimated: {
    price: boolean;
    levies: boolean;
    taxes: boolean;
    rental: boolean;
    size: boolean;
  };
  inferredMarketData: {
    avgMonthlyRental: number;
    vacancyRate: number;
    annualAppreciation: number;
    effectiveTaxRate: number;
  };
  structuralSubScores?: StructuralSubScores;
  groundingSources?: { title: string; uri: string }[];
}

export interface Financials {
  grossRentalYield: number;
  netRentalYield: number;
  monthlyCashFlow: number;
  annualNoi: number;
  capRate: number;
  cashOnCash: number;
  breakEvenYears: number;
  mortgagePaymentMonthly: number;
  totalAnnualExpenses: number;
  dscr: number;
}

export interface SensitivityAnalysis {
  label: string;
  rate: number;
  monthlyCashFlow: number;
  netYield: number;
}

export interface InstitutionalScores {
  assetQualityScore: number;
  leverageImpactScore: number;
  dealEconomicsScore: number;
  finalScore: number;
  verdict: string;
  scoreExplanation: string;
  mitigationSuggestions: string[];
}

export interface RiskFactor {
  id: string;
  label: string;
  score: number;
  description: string;
}

export interface SanityCheck {
  id: string;
  type: 'warning' | 'info' | 'critical';
  message: string;
  triggered: boolean;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  property: PropertyData;
  financials: Financials;
  risks: RiskFactor[];
  sanityChecks: SanityCheck[];
  institutionalScores: InstitutionalScores;
  sensitivity: SensitivityAnalysis[];
  projections: {
    year: number;
    value: number;
    equity: number;
  }[];
}

export interface AnalysisConfig {
  downPaymentPct: number;
  interestRate: number;
  loanTermYears: number;
  maintenancePct: number;
  insurancePct: number;
  managementPct: number;
  selfManaged: boolean;
}
