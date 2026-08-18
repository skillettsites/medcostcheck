import { NextRequest, NextResponse } from "next/server";
import { searchProcedures, getPopularProcedures } from "@/lib/medicare";
import { logSearch } from "@/lib/search-log";

// A handful of common lay phrases that map cleanly onto a single indexed term.
// Kept deliberately small and hand-verified: generic suffix-stripping (e.g.
// removing "test" or "exam" from any query) was tried and rejected because it
// produces false matches, "blood" matches "Repair major blood vessel" and
// "eye" matches "Blepharoplasty eyelid" surgery, which would be actively
// misleading on a factual pricing site. Only add entries here once verified
// against the real data.
const SEARCH_ALIASES: Record<string, string> = {
  "mri scan": "mri",
  "ct scan": "ct",
  "cat scan": "ct",
  "c-section": "cesarean",
  "c section": "cesarean",
  "csection": "cesarean",
  "childbirth": "delivery",
  "giving birth": "delivery",
  "flu shot": "immunization",
  "vaccine": "immunization",
  "vaccination": "immunization",
  "checkup": "office visit",
  "check up": "office visit",
  "annual checkup": "office visit",
  "annual physical": "office visit",
  "physical exam": "office visit",
  "wellness visit": "office visit",
  "doctor visit": "office visit",
};

function runSearch(q: string) {
  const query = q.toLowerCase();
  const popular = getPopularProcedures();
  const popularMap = new Map(popular.map((p) => [p.code, p.friendlyName]));

  // Match against curated lay-friendly names first. Raw CMS billing descriptions
  // often don't contain the everyday term a user searches (e.g. "Total knee
  // arthroplasty" has no word "replacement"), so a plain description search
  // misses common queries like "knee replacement" or "cataract surgery".
  const friendlyMatches = popular.filter((p) =>
    p.friendlyName.toLowerCase().includes(query)
  );

  const descriptionMatches = searchProcedures(q, 15);

  const seen = new Set<string>();
  const results: { code: string; description: string; friendlyName?: string }[] = [];

  for (const p of friendlyMatches) {
    if (seen.has(p.code)) continue;
    seen.add(p.code);
    results.push({ code: p.code, description: p.description, friendlyName: p.friendlyName });
  }

  for (const p of descriptionMatches) {
    if (results.length >= 15) break;
    if (seen.has(p.code)) continue;
    seen.add(p.code);
    results.push({ code: p.code, description: p.description, friendlyName: popularMap.get(p.code) });
  }

  return results.slice(0, 15);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const started = Date.now();
  let results = runSearch(q);

  if (results.length === 0) {
    const alias = SEARCH_ALIASES[q.toLowerCase().trim()];
    if (alias) {
      results = runSearch(alias);
    }
  }

  // No match at all, even after aliasing. Rather than dead-end the user,
  // hand back real, verified-to-exist popular procedures so the UI can
  // suggest something clickable instead of an empty box.
  if (results.length === 0) {
    // This endpoint is a debounced typeahead, so logging every call would
    // record partial keystrokes ("kne", "knee rep"). Successful searches get
    // logged as procedure page views instead; only the dead-ends are logged
    // here, because a query that matches nothing even after aliasing is a
    // real gap in the catalogue and only visible at this point.
    logSearch({
      query: q.trim(),
      resultFound: false,
      durationMs: Date.now() - started,
    });
    const suggestions = getPopularProcedures()
      .slice(0, 6)
      .map((p) => ({ code: p.code, description: p.description, friendlyName: p.friendlyName }));
    return NextResponse.json({ results, suggestions });
  }

  return NextResponse.json({ results });
}
