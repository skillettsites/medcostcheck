import oppsData from "@/data/processed/opps-rates.json";
import ascData from "@/data/processed/asc-rates.json";

export interface FacilityRate {
  rate: number;
  si: string;
  apc?: string;
}

const oppsRates = oppsData as Record<string, FacilityRate>;
const ascRates = ascData as Record<string, FacilityRate>;

/** OPPS labor-related share used in the wage-index formula. */
const LABOR_SHARE = 0.6;

export function getOppsRate(code: string): FacilityRate | null {
  return oppsRates[code] || null;
}

export function getAscRate(code: string): FacilityRate | null {
  return ascRates[code] || null;
}

/**
 * Apply a locality PE GPCI as a stand-in for the hospital wage index.
 * Real OPPS uses the hospital's CBSA wage index; this is close enough
 * for a ZIP-level shop-ahead number and is labelled as a proxy on the report.
 */
export function wageAdjust(national: number, peGpci: number): number {
  const adjusted = national * (1 - LABOR_SHARE + LABOR_SHARE * peGpci);
  return Math.round(adjusted * 100) / 100;
}
