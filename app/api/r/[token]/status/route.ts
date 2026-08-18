import { NextRequest, NextResponse } from "next/server";
import { isValidReportToken } from "@/lib/report-token";
import { loadStoredReport } from "@/lib/reports-store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!isValidReportToken(token)) {
    return NextResponse.json({ ready: false }, { status: 404 });
  }
  const stored = await loadStoredReport(token);
  if (!stored) return NextResponse.json({ ready: false });
  return NextResponse.json({
    ready: true,
    product: stored.product,
    cpt: stored.cpt,
    zip: stored.zip,
  });
}
