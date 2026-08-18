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
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const stored = await loadStoredReport(token);
  if (!stored || stored.product !== "bundle") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const r = stored.report;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Cost Report CPT ${r.cpt} ${r.zip}</title>
<style>body{font-family:Arial,sans-serif;max-width:740px;margin:32px auto;color:#0f172a;line-height:1.45}h1{font-size:22px}pre{white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px}</style>
</head><body>
<h1>${r.procedureName} (CPT ${r.cpt}) — ZIP ${r.zip}</h1>
<p>${r.locality}, ${r.stateName}. Generated ${r.generatedAt}.</p>
<h2>Episode (Medicare)</h2>
<ul>
<li>Office: ${r.episode.office ?? "n/a"}</li>
<li>Hospital outpatient: ${r.episode.hospitalOutpatient ?? "n/a"}</li>
<li>ASC: ${r.episode.asc ?? "n/a"}</li>
</ul>
<h2>Scheduler script</h2>
<p>${r.schedulerScript}</p>
${
  r.letters
    ? `<h2>Good Faith Estimate letter</h2><pre>${r.letters.gfe}</pre><h2>Negotiation letter</h2><pre>${r.letters.negotiation}</pre>`
    : ""
}
<p style="font-size:12px;color:#64748b">${r.scope}</p>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="medcostcheck-${r.cpt}-${r.zip}.html"`,
      "Cache-Control": "no-store",
    },
  });
}
