import { NextRequest, NextResponse } from "next/server";
import { buildCostReport } from "@/lib/cost-report";
import { saveStoredReport } from "@/lib/reports-store";
import { deriveReportToken } from "@/lib/report-token";
import { isValidZip, getProcedure } from "@/lib/medicare";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const provided = req.headers.get("x-admin-key") || "";
  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const cpt = String(body.cpt || "").trim().toUpperCase();
  const zip = String(body.zip || "").trim();
  const product = body.product === "bundle" ? "bundle" : "premium";
  if (!getProcedure(cpt) || !isValidZip(zip)) {
    return NextResponse.json({ error: "bad_cpt_or_zip" }, { status: 400 });
  }

  const fakeSessionId = `cs_test_seed${cpt}${zip}${Date.now()}AbCdEfGhIjKl`.replace(/[^A-Za-z0-9]/g, "");
  const report = buildCostReport({ code: cpt, zip, product });
  const token = deriveReportToken(fakeSessionId);
  if (!token) return NextResponse.json({ error: "token" }, { status: 500 });
  await saveStoredReport(token, {
    stripeSessionId: fakeSessionId,
    product,
    email: body.email || null,
    cpt,
    zip,
    createdAt: new Date().toISOString(),
    emailSent: false,
    report,
  });
  return NextResponse.json({ token, url: `/r/${token}` });
}
