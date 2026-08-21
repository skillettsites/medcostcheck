/**
 * Search quality harness.
 *
 * Replays the real queries users typed on the live site (pulled from the shared
 * `searches` table) plus a hand-built regression set, and reports how many now
 * return a usable answer. Run: npx tsx scripts/test-search.ts
 */
import { searchCatalogue, normaliseQuery, priceScope } from "../lib/procedure-search";

// Every distinct query real users typed, taken from the searches table for
// site_id='medcostcheck'. Keystroke prefixes of a longer query in the same
// session are excluded; these are the settled queries only.
const REAL_QUERIES = [
  "0766T", "transcutaneous magnetic stimulation", "05004", "Ct coronary",
  "Ct cardiac score", "Calcium", "Ct calcium", "knee gel injection",
  "Cervical Facet: Bilateral Levels C4/5,5/6", "Cervical Facet: Bilateral Levels",
  "Cervical Facet Injection", "Facet Injection", "spine surgeon", "spine eval",
  "spine surgery", "0101T", "shockwave", "metabolic panel", "panel",
  "96361", "96376", "99285", "J1171", "hydromorphone",
  "99204", "99203", "20552", "99212", "72131", "73200", "72125", "95004",
  "Knee Replacement", "55715", "64490", "64491", "64493", "64494", "99284",
  "63081", "72148", "72141", "neck surgery", "neck", "colon", "72196",
  "72197", "99205", "74177", "96374", "96375", "93306",
];

// Queries that must keep working (regressions from earlier fixes) plus the
// whitespace cases that used to dead-end.
const REGRESSION = [
  "99285 ", " 99285", "knee replacement ", "colonoscopy", "mri scan", "ct scan",
  "c-section", "childbirth", "flu shot", "checkup", "annual physical",
  "hip replacement", "cataract surgery", "physical therapy", "echocardiogram",
  "office visit", "er visit", "emergency room", "coronary calcium score",
  "calcium score", "facet injection", "lumbar facet", "cortisone shot",
  "MRI", "X-Ray", "blood test", "root canal",
];

let pass = 0;
let fail = 0;
const failures: string[] = [];

function run(label: string, queries: string[]) {
  console.log("\n=== " + label + " ===");
  for (const q of queries) {
    const hits = searchCatalogue(q, 5);
    const top = hits[0];
    if (hits.length > 0) {
      pass++;
      console.log(
        "  OK   " + JSON.stringify(q).padEnd(46) +
        top.code + " [" + top.scope + "] " + (top.friendlyName || top.description)
      );
    } else {
      fail++;
      failures.push(q);
      console.log("  MISS " + JSON.stringify(q).padEnd(46) + "normalised=" + JSON.stringify(normaliseQuery(q)));
    }
  }
}

run("real user queries", REAL_QUERIES);
run("regression set", REGRESSION);

const total = pass + fail;
console.log("\n---------------------------------------------");
console.log("result rate: " + pass + "/" + total + " = " + ((100 * pass) / total).toFixed(1) + "%");
if (failures.length) console.log("still missing: " + failures.map((f) => JSON.stringify(f)).join(", "));

// Spot-check that specific queries resolve to the RIGHT code, not just any code.
const EXPECTED: Array<[string, string]> = [
  ["Cervical Facet Injection", "64490"],
  ["coronary calcium score", "75571"],
  ["metabolic panel", "80053"],
  ["shockwave", "0101T"],
  ["transcutaneous magnetic stimulation", "0766T"],
  ["J1171", "J1171"],
  ["99285 ", "99285"],
  ["knee replacement", "27447"],
  ["hip replacement", "27130"],
  ["echocardiogram", "93306"],
];
console.log("\n=== correctness spot-checks (top 5 must contain the right code) ===");
let correct = 0;
for (const [q, want] of EXPECTED) {
  const hits = searchCatalogue(q, 5);
  const at = hits.findIndex((h) => h.code === want);
  const ok = at >= 0;
  if (ok) correct++;
  console.log(
    (ok ? "  OK   " : "  WRONG") + " " + JSON.stringify(q).padEnd(40) +
    "want " + want + (ok ? " at rank " + (at + 1) : " -> got " + hits.slice(0, 3).map((h) => h.code).join(","))
  );
}
console.log("spot-checks: " + correct + "/" + EXPECTED.length);
console.log("scope of 80053: " + priceScope("80053") + ", J1171: " + priceScope("J1171") + ", 27447: " + priceScope("27447"));
