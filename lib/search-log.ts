// Search logging into the shared Supabase `searches` table.
//
// This is what puts MedCostCheck on the CommandCenter searches board alongside
// CarCostCheck, CheckAFirm, CaravanCheck and ProbateCheck: same table, same
// row shape, own `site_id`.
//
// Two rules, inherited from the sister sites because both were learned the
// hard way:
//
//   1. ANON key only, never the service-role key. The Supabase project is
//      shared with ~ninety other tables and the service-role key bypasses RLS
//      on all of them, so a leak here would expose every site.
//   2. Never break or slow the search. Every call swallows its own errors and
//      is not awaited by the response path. An analytics outage must not take
//      procedure search down.

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const HAS_ANALYTICS = !!(URL_BASE && ANON_KEY);

export type SearchLog = {
  /** The procedure query as typed, trimmed. */
  query: string;
  /** False when nothing matched even after aliasing, so misses are measurable. */
  resultFound: boolean;
  durationMs?: number | null;
};

/**
 * Log a procedure search. Call WITHOUT awaiting from the request path.
 *
 * `site_id` must stay exactly 'medcostcheck' to match projects.ts and the
 * allSiteIds list in commandcenter's /api/searches route.
 */
export function logSearch(row: SearchLog): void {
  if (!HAS_ANALYTICS || !row.query) return;
  void (async () => {
    try {
      await fetch(`${URL_BASE}/rest/v1/searches`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
          // return=minimal: we do not want the row back. Do NOT add
          // resolution=ignore-duplicates, which PostgREST treats as an upsert
          // and which needs UPDATE permission anon does not have.
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          site_id: "medcostcheck",
          search_query: row.query.slice(0, 120),
          result_found: row.resultFound,
          search_type: "procedure",
          duration_ms: row.durationMs ?? null,
        }),
        cache: "no-store",
      });
    } catch {
      // Swallowed on purpose. See rule 2 above.
    }
  })();
}
