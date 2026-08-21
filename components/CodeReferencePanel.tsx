import Link from "next/link";
import type { PriceScope } from "@/lib/procedure-search";
import { formatPrice } from "@/lib/format";

/**
 * Shown for a real CPT/HCPCS code that is NOT on the Physician Fee Schedule.
 *
 * Before this existed, searching "metabolic panel", "shockwave" or a J-code
 * off a bill returned nothing at all, because the search only knew the 7,575
 * PFS codes. These codes are real and CMS names them, so the honest answer is
 * to confirm the code and say plainly which schedule pays it and why we do not
 * quote a price, rather than either dead-ending or inventing a figure.
 */
export default function CodeReferencePanel({
  code,
  description,
  scope,
  oppsRate,
  ascRate,
}: {
  code: string;
  description: string;
  scope: PriceScope;
  oppsRate?: number;
  ascRate?: number;
}) {
  const explanation: Record<PriceScope, { heading: string; body: string }> = {
    pfs: {
      heading: "Physician Fee Schedule",
      body: "This code is priced elsewhere on the site.",
    },
    facility: {
      heading: "Paid as a facility service, not a physician fee",
      body:
        "Medicare does not assign this code a physician fee schedule rate. It is paid to the hospital outpatient department or ambulatory surgery centre instead, so the rate below is what the facility is allowed, not what a doctor bills. Your own share depends on your plan, and a hospital may bill a separate physician line under a different code.",
    },
    lab: {
      heading: "Paid under the Clinical Laboratory Fee Schedule",
      body:
        "Lab panels and assays are not on the Physician Fee Schedule, so this site does not price them. The code and its official CMS description are correct, and you can look the payment amount up in the CMS Clinical Laboratory Fee Schedule. Labs are frequently billed at many times the Medicare rate when you are uninsured, so it is worth asking for the cash price before the draw.",
    },
    drug: {
      heading: "A drug code, priced per billing unit",
      body:
        "HCPCS J-codes identify a drug, not a procedure, and Medicare prices them per billing unit rather than per dose. That means the unit rate cannot be read as the cost of one injection: the number of units billed depends on the dose you receive. The procedure of administering it is billed separately under its own CPT code.",
    },
    dental: {
      heading: "A dental code",
      body:
        "ADA dental codes are outside the Physician Fee Schedule and Medicare generally does not cover routine dental care. A rate exists only for the narrow situations where the work is done in a hospital outpatient setting as part of a covered medical service, so it is not a guide to what a dentist would charge.",
    },
    unpriced: {
      heading: "Recognised code, no separate Medicare payment",
      body:
        "CMS recognises this code but does not pay it separately. That usually means the service is bundled into another code, is not covered, or is priced by your local Medicare contractor case by case. Ask the provider which code the payment actually falls under.",
    },
  };

  const { heading, body } = explanation[scope];
  const rate = oppsRate ?? ascRate;
  const showRate = scope === "facility" && typeof rate === "number" && rate > 0;

  return (
    <div className="panel p-6 sm:p-8">
      <p className="text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-2">
        {heading}
      </p>
      <h2 className="text-lg font-semibold text-ink mb-3">
        CPT/HCPCS {code} is a real code, but we do not price it here
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-5">{body}</p>

      {showRate && (
        <div className="border border-[var(--hairline)] rounded-lg p-4 mb-5 bg-canvas">
          <p className="text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1">
            2026 national facility rate
          </p>
          <p className="text-2xl font-semibold text-ink">{formatPrice(rate!)}</p>
          <p className="text-xs text-muted mt-1">
            {typeof oppsRate === "number" && oppsRate > 0
              ? "Hospital outpatient (OPPS) national unadjusted amount"
              : "Ambulatory surgery centre (ASC) national amount"}
            . Not adjusted for your area, and not a quote.
          </p>
        </div>
      )}

      <p className="text-sm text-muted">
        CMS describes it as &ldquo;{description}&rdquo;.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link href="/procedures" className="btn btn-primary">
          Browse procedures we do price
        </Link>
        <Link href="/guides/how-medical-billing-works" className="btn">
          How medical billing works
        </Link>
      </div>
    </div>
  );
}
