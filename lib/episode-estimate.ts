/**
 * Free national "what does the whole thing cost" estimate.
 *
 * Why this exists: every free page led with the Medicare *physician* fee, which
 * for a total knee replacement is about $1,166 while the hospital's own
 * Medicare payment for the same encounter is about $13,117. Someone searching
 * "knee replacement cost" was being shown 8% of the answer as though it were
 * the answer. That is wrong on a page about medical costs, and it is almost
 * certainly why pages ranking at position 7-9 were earning almost no clicks.
 *
 * The facility figures come from the same CMS OPPS/ASC addenda the paid report
 * uses, unadjusted for locality. The paid report still adds the things that
 * actually need a ZIP: wage-adjusted local rates, named nearby hospitals with
 * their ratings, add-on codes, the good-faith-estimate and negotiation letters,
 * and a PDF.
 */

import { getProcedure, CONVERSION_FACTOR } from "@/lib/medicare";
import { getOppsRate, getAscRate } from "@/lib/facility";

export interface EpisodeEstimate {
  /** National Medicare physician allowed amount in a facility. */
  physician: number;
  /** Physician + hospital outpatient facility payment. */
  hospitalOutpatient: number | null;
  /** Physician + ambulatory surgery centre facility payment. */
  asc: number | null;
  /** hospitalOutpatient / physician, when both exist. */
  multiple: number | null;
  /** OPPS status indicator, which decides how firm the facility figure is. */
  oppsStatus: string | null;
  /**
   * How to describe the facility payment honestly for this status indicator.
   * J1/J2 are comprehensive APCs: one payment covering the hospital's whole
   * encounter, implants and supplies included. Q-codes may be packaged into
   * another service instead of paid on their own.
   */
  facilityBasis: "comprehensive" | "standalone" | "conditional" | null;
}

const COMPREHENSIVE = new Set(["J1", "J2"]);
const STANDALONE = new Set(["S", "S1", "T", "V", "R", "U", "G"]);
const CONDITIONAL = new Set(["Q1", "Q2", "Q3"]);

function basisFor(si: string | null): EpisodeEstimate["facilityBasis"] {
  if (!si) return null;
  if (COMPREHENSIVE.has(si)) return "comprehensive";
  if (STANDALONE.has(si)) return "standalone";
  if (CONDITIONAL.has(si)) return "conditional";
  return null;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * National episode estimate for a CPT code, or null when the code has no
 * facility rate worth showing (office-only services, drugs, packaged codes).
 */
export function getEpisodeEstimate(code: string): EpisodeEstimate | null {
  const proc = getProcedure(code);
  if (!proc) return null;

  const opps = getOppsRate(code);
  const asc = getAscRate(code);
  const basis = basisFor(opps?.si ?? null);

  // Nothing useful to add beyond the physician fee.
  if (!opps && !asc) return null;
  if (opps && !basis && !asc) return null;

  const physician = round(proc.facTotal * CONVERSION_FACTOR);
  if (physician <= 0) return null;

  const hospitalOutpatient = opps && basis ? round(physician + opps.rate) : null;
  const ascTotal = asc?.rate ? round(physician + asc.rate) : null;

  return {
    physician,
    hospitalOutpatient,
    asc: ascTotal,
    multiple:
      hospitalOutpatient && physician > 0
        ? Math.round((hospitalOutpatient / physician) * 10) / 10
        : null,
    oppsStatus: opps?.si ?? null,
    facilityBasis: basis,
  };
}

/**
 * One-line summary for meta descriptions and snippets. Leads with the number
 * the searcher actually wants rather than the professional fee.
 */
export function episodeHeadline(code: string, name: string): string | null {
  const e = getEpisodeEstimate(code);
  if (!e?.hospitalOutpatient) return null;
  return `${name} costs about $${Math.round(e.hospitalOutpatient).toLocaleString("en-US")} in total under Medicare in a hospital outpatient setting: roughly $${Math.round(e.physician).toLocaleString("en-US")} to the surgeon and the rest to the facility.`;
}
