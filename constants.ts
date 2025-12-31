
import { AnalysisConfig } from './types';

export const INSTITUTIONAL_FLOORS = {
  VACANCY_MIN: 4.0, // Institutional minimum floor
  VACANCY_DEFAULT: 5.0,
  CLOSING_COSTS_PCT: 4.0,
};

export const MAINTENANCE_TIERS = {
  NEW_BUILD: 0.6,    // < 5 years old or "new"
  EXCELLENT: 0.8,   // Well maintained
  AVERAGE: 1.0,     // Standard
  DEFERRED: 1.25,   // Older / Poor condition
};

export const DEFAULT_CONFIG: AnalysisConfig = {
  downPaymentPct: 20,
  interestRate: 6.8,
  loanTermYears: 30,
  maintenancePct: MAINTENANCE_TIERS.AVERAGE, 
  insurancePct: 0.5,
  managementPct: 8.0,
  selfManaged: false,
};

export const SCORE_LABELS = {
  POOR: { min: 0, max: 40, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  AVERAGE: { min: 41, max: 60, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  GOOD: { min: 61, max: 75, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  STRONG: { min: 76, max: 100, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
};
