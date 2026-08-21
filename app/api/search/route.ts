import { NextRequest, NextResponse } from "next/server";
import { getPopularProcedures } from "@/lib/medicare";
import { searchCatalogue } from "@/lib/procedure-search";

/**
 * Typeahead for the procedure search box.
 *
 * This endpoint does NOT log. It is called on every debounced keystroke, so
 * logging here recorded one "no result" row per character typed: a user
 * spelling out "knee gel injection" produced a dozen misses and a user who
 * found what they wanted produced a single hit, which is why the Command
 * Center result rate read ~20% while the real settled figure was far higher.
 * The client logs once per settled query instead, in ProcedureSearch.tsx.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = searchCatalogue(q, 15);

  if (results.length === 0) {
    // Real dead end. Hand back verified popular procedures so the box always
    // offers something clickable rather than an empty panel.
    const suggestions = getPopularProcedures()
      .slice(0, 6)
      .map((p) => ({
        code: p.code,
        description: p.description,
        friendlyName: p.friendlyName,
        scope: "pfs" as const,
      }));
    return NextResponse.json({ results, suggestions });
  }

  return NextResponse.json({ results });
}
