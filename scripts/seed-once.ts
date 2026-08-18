import { buildCostReport } from "../lib/cost-report";
import { deriveReportToken } from "../lib/report-token";
import { saveStoredReport, loadStoredReport } from "../lib/reports-store";

async function main() {
  const cpt = process.argv[2] || "93306";
  const zip = process.argv[3] || "33101";
  const product = process.argv[4] === "bundle" ? "bundle" : "premium";

  const fakeSessionId = `cs_test_seed${cpt}${zip}${Date.now()}QaToken12ab`;
  const token = deriveReportToken(fakeSessionId);
  if (!token) throw new Error("token");
  const report = buildCostReport({ code: cpt, zip, product });
  await saveStoredReport(token, {
    stripeSessionId: fakeSessionId,
    product,
    email: null,
    cpt,
    zip,
    createdAt: new Date().toISOString(),
    emailSent: false,
    report,
  });
  const loaded = await loadStoredReport(token);
  if (!loaded) throw new Error("reload failed");
  console.log(JSON.stringify({ token, url: `/r/${token}`, product: loaded.product, hospital: loaded.report.episode.hospitalOutpatient }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
