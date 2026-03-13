import { NextRequest, NextResponse } from "next/server";
import { searchProcedures, getPopularProcedures } from "@/lib/medicare";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const procedures = searchProcedures(q, 15);

  // Cross-reference with popular procedures for friendly names
  const popular = getPopularProcedures();
  const popularMap = new Map(popular.map((p) => [p.code, p.friendlyName]));

  const results = procedures.map((p) => ({
    code: p.code,
    description: p.description,
    friendlyName: popularMap.get(p.code) || undefined,
  }));

  return NextResponse.json({ results });
}
