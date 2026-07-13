import { NextRequest, NextResponse } from "next/server";
import { searchProcedures, getPopularProcedures } from "@/lib/medicare";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

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

  return NextResponse.json({ results: results.slice(0, 15) });
}
