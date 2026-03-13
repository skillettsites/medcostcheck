/**
 * Medicare Fee Schedule data access layer.
 *
 * Pre-processed JSON files from CMS data:
 *   - procedures.json: 7,575 payable procedures with RVUs
 *   - gpci.json: 112 localities with geographic cost indices
 *   - zip-locality.json: 42,956 ZIP codes mapped to localities
 *   - popular-procedures.json: 59 curated popular procedures
 *   - categories.json: 8 procedure categories
 *
 * Price calculation:
 *   [(Work RVU x PW GPCI) + (PE RVU x PE GPCI) + (MP RVU x MP GPCI)] x CF
 *   CF (2026) = $33.4009
 */

import proceduresData from "@/data/processed/procedures.json";
import gpciData from "@/data/processed/gpci.json";
import zipLocalityData from "@/data/processed/zip-locality.json";
import popularProceduresData from "@/data/processed/popular-procedures.json";
import categoriesData from "@/data/processed/categories.json";

const CONVERSION_FACTOR = 33.4009;

// Type assertions for JSON imports
const procedures = proceduresData as Record<string, Procedure>;
const gpci = gpciData as Record<string, GpciEntry>;
const zipLocality = zipLocalityData as Record<string, ZipEntry>;
const popularProcedures = popularProceduresData as PopularProcedure[];
const categories = categoriesData as Category[];

export interface Procedure {
  code: string;
  description: string;
  workRvu: number;
  nonFacPeRvu: number;
  facPeRvu: number;
  mpRvu: number;
  nonFacTotal: number;
  facTotal: number;
}

interface GpciEntry {
  state: string;
  localityName: string;
  pwGpci: number;
  peGpci: number;
  mpGpci: number;
}

interface ZipEntry {
  state: string;
  carrier: string;
  locality: string;
  key: string;
}

export interface PopularProcedure {
  code: string;
  friendlyName: string;
  description: string;
  workRvu: number;
  nonFacTotal: number;
  facTotal: number;
  nationalNonFacPrice: number;
  nationalFacPrice: number;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  codes: string[];
}

export interface PriceResult {
  procedure: Procedure;
  nonFacPrice: number;
  facPrice: number;
  nationalNonFacPrice: number;
  nationalFacPrice: number;
  locality: string;
  state: string;
  zip: string;
  estimatedPrivateInsurance: {
    low: number;
    high: number;
  };
  estimatedSelfPay: {
    low: number;
    high: number;
  };
}

/**
 * Calculate the Medicare price for a procedure in a specific locality.
 */
function calculatePrice(proc: Procedure, gpciEntry: GpciEntry): { nonFac: number; fac: number } {
  const nonFac =
    (proc.workRvu * gpciEntry.pwGpci +
      proc.nonFacPeRvu * gpciEntry.peGpci +
      proc.mpRvu * gpciEntry.mpGpci) *
    CONVERSION_FACTOR;

  const fac =
    (proc.workRvu * gpciEntry.pwGpci +
      proc.facPeRvu * gpciEntry.peGpci +
      proc.mpRvu * gpciEntry.mpGpci) *
    CONVERSION_FACTOR;

  return {
    nonFac: Math.round(nonFac * 100) / 100,
    fac: Math.round(fac * 100) / 100,
  };
}

/**
 * Get the price for a procedure code in a ZIP code.
 */
export function getProcedurePrice(code: string, zip: string): PriceResult | null {
  const proc = procedures[code];
  if (!proc) return null;

  const zipEntry = zipLocality[zip];
  if (!zipEntry) return null;

  const gpciEntry = gpci[zipEntry.key];
  if (!gpciEntry) return null;

  const { nonFac, fac } = calculatePrice(proc, gpciEntry);
  const nationalNonFac = Math.round(proc.nonFacTotal * CONVERSION_FACTOR * 100) / 100;
  const nationalFac = Math.round(proc.facTotal * CONVERSION_FACTOR * 100) / 100;

  // Private insurance typically pays 130-200% of Medicare
  // Self-pay/cash is typically 80-150% of Medicare (discounted)
  const primaryPrice = Math.max(nonFac, fac);

  return {
    procedure: proc,
    nonFacPrice: nonFac,
    facPrice: fac,
    nationalNonFacPrice: nationalNonFac,
    nationalFacPrice: nationalFac,
    locality: gpciEntry.localityName,
    state: gpciEntry.state,
    zip,
    estimatedPrivateInsurance: {
      low: Math.round(primaryPrice * 1.3),
      high: Math.round(primaryPrice * 2.0),
    },
    estimatedSelfPay: {
      low: Math.round(primaryPrice * 0.8),
      high: Math.round(primaryPrice * 1.5),
    },
  };
}

/**
 * Get procedure info without location-specific pricing.
 */
export function getProcedure(code: string): Procedure | null {
  return procedures[code] || null;
}

/**
 * Search procedures by keyword.
 */
export function searchProcedures(query: string, limit = 20): Procedure[] {
  const q = query.toLowerCase();
  const results: Procedure[] = [];

  // Exact code match first
  if (procedures[query.toUpperCase()]) {
    results.push(procedures[query.toUpperCase()]);
  }

  for (const proc of Object.values(procedures)) {
    if (results.length >= limit) break;
    if (proc.code === query.toUpperCase()) continue; // Already added
    if (
      proc.description.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q)
    ) {
      results.push(proc);
    }
  }

  return results;
}

/**
 * Check if a ZIP code is valid.
 */
export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip) && zip in zipLocality;
}

/**
 * Get locality info for a ZIP code.
 */
export function getZipInfo(zip: string): { state: string; locality: string } | null {
  const entry = zipLocality[zip];
  if (!entry) return null;
  const gpciEntry = gpci[entry.key];
  return {
    state: entry.state,
    locality: gpciEntry?.localityName || 'Unknown',
  };
}

/**
 * Get popular procedures list.
 */
export function getPopularProcedures(): PopularProcedure[] {
  return popularProcedures;
}

/**
 * Get categories.
 */
export function getCategories(): Category[] {
  return categories;
}

/**
 * Get all procedure codes (for static generation).
 */
export function getAllProcedureCodes(): string[] {
  return Object.keys(procedures);
}

/**
 * Get all state abbreviations from ZIP data.
 */
export function getAllStates(): string[] {
  const states = new Set<string>();
  for (const entry of Object.values(zipLocality)) {
    states.add((entry as ZipEntry).state);
  }
  return [...states].sort();
}

/**
 * State name lookup.
 */
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia', PR: 'Puerto Rico', VI: 'Virgin Islands',
};

export function getStateName(abbr: string): string {
  return STATE_NAMES[abbr] || abbr;
}

export { CONVERSION_FACTOR };
