import { Resend } from "resend";
import type { CostReport } from "@/lib/cost-report";
import { formatPrice } from "@/lib/format";
import { buildReportUrl } from "@/lib/report-token";

function getResend() {
  const key = (process.env.RESEND_API_KEY || "").replace(/\\n$/, "").trim();
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "reports@carcostcheck.co.uk";

export async function sendCostReportEmail(
  to: string,
  report: CostReport,
  stripeSessionId: string
): Promise<string | null> {
  const liveUrl = buildReportUrl(stripeSessionId);
  const title =
    report.product === "bundle" ? "Complete Cost Report" : "Premium Cost Report";
  const subject = `${title}: CPT ${report.cpt} in ${report.zip}`;
  const hospital =
    report.episode.hospitalOutpatient != null
      ? formatPrice(report.episode.hospitalOutpatient)
      : "n/a";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
      <h1 style="font-size:20px;">Your ${title} is ready</h1>
      <p>CPT ${report.cpt} (${report.procedureName}) in ZIP ${report.zip} — ${report.locality}, ${report.stateName}.</p>
      <p>Hospital outpatient episode (Medicare): <strong>${hospital}</strong></p>
      ${
        liveUrl
          ? `<p><a href="${liveUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">Open your report</a></p>
             <p style="font-size:13px;color:#475569;">Keep this link. Parser fixes show up on the same URL.</p>`
          : ""
      }
      <p style="font-size:12px;color:#64748b;">${report.scope}</p>
    </div>
  `;
  const text = liveUrl
    ? `Your ${title} for CPT ${report.cpt} in ${report.zip} is ready.\n\nView your report:\n${liveUrl}\n`
    : `Your ${title} for CPT ${report.cpt} in ${report.zip} is ready.`;

  const resend = getResend();
  const result = await resend.emails.send({
    from: `MedCostCheck <${FROM_EMAIL}>`,
    replyTo: "contact@medcostcheck.com",
    to,
    subject,
    html,
    text,
  });
  if (result.error) {
    throw new Error(`Resend failed: ${result.error.message}`);
  }
  return result.data?.id ?? null;
}
