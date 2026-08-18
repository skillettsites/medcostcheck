import assert from "node:assert/strict";
import { buildCostReport } from "../lib/cost-report";
import { deriveReportToken, isValidReportToken } from "../lib/report-token";
import { getProduct } from "../lib/products";
import { wageAdjust } from "../lib/facility";

const echo = buildCostReport({ code: "93306", zip: "33101", product: "premium" });
assert.equal(echo.cpt, "93306");
assert.equal(echo.zip, "33101");
assert.equal(echo.product, "premium");
assert.equal(echo.letters, null);
assert.ok(echo.physician.office > 0);
assert.ok(echo.facility.oppsNational && echo.facility.oppsNational > 400);
assert.ok(echo.episode.hospitalOutpatient && echo.episode.hospitalOutpatient > echo.physician.hospital);
assert.ok(echo.hospitals.length >= 1 && echo.hospitals.length <= 5);
assert.ok(echo.schedulerScript.includes("93306"));

const knee = buildCostReport({ code: "27447", zip: "19103", product: "bundle" });
assert.equal(knee.product, "bundle");
assert.ok(knee.letters?.gfe.includes("27447"));
assert.ok(knee.letters?.negotiation.includes("19103"));
assert.ok(knee.facility.ascNational && knee.facility.ascNational > 8000);
assert.ok(knee.hospitals.length >= 1 && knee.hospitals.length <= 15);
assert.equal(knee.episode.office, null);

const token = deriveReportToken("cs_live_b1RIR529NHKHfoPnnECUcyEc3KlysdCRcEb6hUnTn1jg2tVKUIwCTotHSh");
assert.equal(token, "VKUIwCTotHSh");
assert.equal(isValidReportToken(token), true);
assert.equal(isValidReportToken("short"), false);
assert.equal(getProduct("premium")?.priceInCents, 499);
assert.equal(getProduct("bundle")?.priceInCents, 699);
assert.equal(getProduct("bundle_upgrade")?.priceInCents, 200);
assert.equal(wageAdjust(1000, 1.2), 1120);

console.log("ok", {
  echoHospital: echo.episode.hospitalOutpatient,
  echoOpps: echo.facility.oppsAdjusted,
  echoHospitals: echo.hospitals.length,
  kneeHospital: knee.episode.hospitalOutpatient,
  kneeAsc: knee.episode.asc,
  kneeHospitals: knee.hospitals.length,
  miamiHospital: echo.hospitals[0]?.name,
  phillyHospital: knee.hospitals[0]?.name,
});
