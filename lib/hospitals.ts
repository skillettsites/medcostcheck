import hospitalsData from "@/data/processed/hospitals.json";
import { getZipInfo } from "@/lib/medicare";

export interface NearbyHospital {
  name: string;
  city: string;
  state: string;
  zip: string;
  rating: string;
  type: string;
  ownership: string;
  emergency: boolean;
  match: "zip" | "zip3" | "state";
}

interface HospitalRow {
  name: string;
  city: string;
  state: string;
  zip: string;
  rating: string;
  type: string;
  ownership: string;
  emergency: boolean;
}

const hospitals = hospitalsData as HospitalRow[];

function ratingScore(rating: string): number {
  const n = Number(rating);
  return Number.isFinite(n) ? n : -1;
}

export function getNearbyHospitals(zip: string, limit: number): NearbyHospital[] {
  const info = getZipInfo(zip);
  const state = info?.state;
  const zip3 = zip.slice(0, 3);
  const scored: NearbyHospital[] = [];

  for (const h of hospitals) {
    let match: NearbyHospital["match"] | null = null;
    if (h.zip === zip) match = "zip";
    else if (h.zip.startsWith(zip3)) match = "zip3";
    else if (state && h.state === state) match = "state";
    if (!match) continue;
    if (match === "state" && scored.length >= limit * 8) continue;
    scored.push({ ...h, match });
  }

  const rank = { zip: 0, zip3: 1, state: 2 };
  scored.sort((a, b) => {
    const m = rank[a.match] - rank[b.match];
    if (m !== 0) return m;
    const r = ratingScore(b.rating) - ratingScore(a.rating);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name);
  });

  return scored.slice(0, limit);
}
