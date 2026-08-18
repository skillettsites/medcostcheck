import type Stripe from "stripe";
import { buildCostReport } from "@/lib/cost-report";
import { sendCostReportEmail } from "@/lib/email";
import { getProduct, type ReportProductId } from "@/lib/products";
import { deriveReportToken } from "@/lib/report-token";
import { loadStoredReport, saveStoredReport } from "@/lib/reports-store";

export async function fulfilCheckout(session: Stripe.Checkout.Session): Promise<{ token: string }> {
  const meta = session.metadata || {};
  const productId = meta.product || "premium";
  const product = getProduct(productId);
  if (!product) throw new Error("invalid_product");

  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const isUpgrade = productId === "bundle_upgrade";
  const existingToken = meta.existing_token || "";

  if (isUpgrade) {
    if (!existingToken) throw new Error("upgrade_missing_token");
    const existing = await loadStoredReport(existingToken);
    if (!existing) throw new Error("upgrade_report_not_found");
    const report = buildCostReport({
      code: existing.cpt,
      zip: existing.zip,
      product: "bundle",
    });
    await saveStoredReport(existingToken, {
      ...existing,
      product: "bundle",
      email: customerEmail || existing.email,
      report,
      emailSent: false,
    });
    if (customerEmail) {
      try {
        await sendCostReportEmail(customerEmail, report, existing.stripeSessionId);
        const stored = await loadStoredReport(existingToken);
        if (stored) {
          stored.emailSent = true;
          await saveStoredReport(existingToken, stored);
        }
      } catch (err) {
        console.error("upgrade email failed", err);
      }
    }
    return { token: existingToken };
  }

  const code = (meta.cpt || "").trim();
  const zip = (meta.zip || "").trim();
  if (!code || !zip) throw new Error("missing_cpt_or_zip");

  const token = deriveReportToken(session.id);
  if (!token) throw new Error("bad_session_id");

  const already = await loadStoredReport(token);
  if (already?.report) return { token };

  const reportProduct = product.reportProduct as ReportProductId;
  const report = buildCostReport({ code, zip, product: reportProduct });

  await saveStoredReport(token, {
    stripeSessionId: session.id,
    product: reportProduct,
    email: customerEmail,
    cpt: code,
    zip,
    createdAt: new Date().toISOString(),
    emailSent: false,
    report,
  });

  if (customerEmail) {
    try {
      await sendCostReportEmail(customerEmail, report, session.id);
      const stored = await loadStoredReport(token);
      if (stored) {
        stored.emailSent = true;
        await saveStoredReport(token, stored);
      }
    } catch (err) {
      console.error("report email failed", err);
    }
  }

  return { token };
}
