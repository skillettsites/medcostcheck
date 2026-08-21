import { MetadataRoute } from "next";
import popularProceduresData from "@/data/processed/popular-procedures.json";
import { getAllGuides } from "@/lib/guides";
import {
  getIndexableStateAbbrs,
  getStateName,
  stateToSlug,
  procedureToSlug,
} from "@/lib/geo";

/**
 * Lightweight sitemap: do not import lib/medicare.ts (that pulls ~4MB of
 * ZIP + RVU JSON and is the reason /sitemap.xml was 500ing).
 *
 * Only real, already-published URLs: static pages, guides, 51 state hubs,
 * 59 featured procedure pages, and the existing state×procedure set.
 */
export const revalidate = 86400;

const BASE = "https://www.medcostcheck.com";

/**
 * Date the page content last genuinely changed. Bump this whenever pricing
 * data is reprocessed or the page templates change what they say.
 *
 * Do NOT replace it with `new Date()`: that would claim every page changed on
 * every deploy, which is a false freshness signal. Leaving it frozen is the
 * opposite failure and is what happened here, where it sat at 2026-08-01 while
 * the templates were rewritten, so Google had no reason to recrawl.
 */
const LAST_MOD = new Date("2026-08-21");

interface PopularRow {
  code: string;
  friendlyName: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const popular = popularProceduresData as PopularRow[];
  const states = getIndexableStateAbbrs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: LAST_MOD, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/procedures`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/states`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/glossary`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/about`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/editorial-policy`, lastModified: LAST_MOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: LAST_MOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/save`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: LAST_MOD, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: LAST_MOD, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = getAllGuides().map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: LAST_MOD,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const statePages: MetadataRoute.Sitemap = states.map((abbr) => ({
    url: `${BASE}/state/${stateToSlug(getStateName(abbr))}`,
    lastModified: LAST_MOD,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 0.9: these 59 are the canonical procedure pages, and they compete for
  // crawl budget with 3,060 state x procedure pages. /procedure/27447 was still
  // "unknown to Google" months after launch despite being linked from the
  // homepage, /procedures and 51 state pages.
  const procedurePages: MetadataRoute.Sitemap = popular.map((proc) => ({
    url: `${BASE}/procedure/${proc.code}`,
    lastModified: LAST_MOD,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const stateProcedurePages: MetadataRoute.Sitemap = [];
  for (const abbr of states) {
    const stateSlug = stateToSlug(getStateName(abbr));
    for (const proc of popular) {
      stateProcedurePages.push({
        url: `${BASE}/state/${stateSlug}/${procedureToSlug(proc.friendlyName)}`,
        lastModified: LAST_MOD,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...guidePages, ...statePages, ...procedurePages, ...stateProcedurePages];
}
