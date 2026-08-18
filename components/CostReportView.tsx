import Link from "next/link";
import { formatPrice, formatPriceRound } from "@/lib/format";
import type { CostReport } from "@/lib/cost-report";
import UpgradeCta from "@/components/UpgradeCta";
import PriceCard from "@/components/PriceCard";

export default function CostReportView({
  report,
  token,
}: {
  report: CostReport;
  token: string;
}) {
  const isBundle = report.product === "bundle";
  const money = (n: number | null) => (n == null ? "n/a" : formatPrice(n));

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
      <p className="eyebrow mb-2">
        {isBundle ? "Complete Cost Report + Letters" : "Premium Cost Report"}
      </p>
      <h1 className="page-title">
        {report.procedureName}
      </h1>
      <p className="lede mt-2">
        CPT {report.cpt} · ZIP {report.zip} · {report.locality}, {report.stateName}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-8">
        <PriceCard
          label="Office / clinic"
          price={money(report.episode.office)}
          sublabel="Physician non-facility allowed amount"
        />
        <PriceCard
          label="Hospital outpatient"
          price={money(report.episode.hospitalOutpatient)}
          sublabel="Physician + OPPS facility"
          highlight
        />
        <PriceCard
          label="ASC"
          price={money(report.episode.asc)}
          sublabel="Physician + ASC facility"
        />
      </div>

      <div className="surface p-6 mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">How that episode is built</h2>
        <div className="space-y-0 text-sm">
          {[
            ["Physician, office", formatPrice(report.physician.office)],
            ["Physician, facility setting", formatPrice(report.physician.hospital)],
            [
              "OPPS facility (national → locality)",
              report.facility.oppsNational != null
                ? `${formatPrice(report.facility.oppsNational)} → ${formatPrice(report.facility.oppsAdjusted || 0)} (APC ${report.facility.oppsApc || "—"})`
                : "Not separately payable in July 2026 Addendum B",
            ],
            [
              "ASC facility (national → locality)",
              report.facility.ascNational != null
                ? `${formatPrice(report.facility.ascNational)} → ${formatPrice(report.facility.ascAdjusted || 0)}`
                : "Not on the July 2026 ASC covered list",
            ],
            ["Private-plan ballpark (130–200% of hospital episode)", report.episode.hospitalOutpatient != null ? `${formatPriceRound(report.episode.hospitalOutpatient * 1.3)}–${formatPriceRound(report.episode.hospitalOutpatient * 2)}` : "n/a"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3 border-b border-[var(--hairline)] last:border-0">
              <span className="text-muted">{label}</span>
              <span className="font-medium text-ink text-right">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-faint mt-4 leading-relaxed">{report.facility.note}</p>
      </div>

      <div className="surface p-6 mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-2">What to say to the scheduler</h2>
        <p className="text-sm text-muted leading-relaxed">{report.schedulerScript}</p>
      </div>

      <div className="surface p-6 mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">Typical add-ons</h2>
        <div className="space-y-4">
          {report.addOns.map((line) => (
              <div key={line.name} className="border-b border-[var(--hairline)] pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between gap-3">
                  <p className="font-medium text-ink text-sm">
                    {line.name}
                    {line.code ? <span className="text-faint font-mono font-normal"> · {line.code}</span> : null}
                  </p>
                  {line.physicianOffice != null && (
                    <p className="text-sm font-medium text-ink">{formatPrice(line.physicianOffice)}</p>
                  )}
                </div>
                <p className="text-sm text-muted mt-1">{line.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface p-6 mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-1">Nearby hospitals</h2>
        <p className="text-xs text-faint mb-4">
          CMS Hospital Compare, matched by ZIP then 3-digit prefix then {report.stateName}. Ratings are CMS overall stars, not prices.
        </p>
        <div className="divide-y divide-[var(--hairline)]">
          {report.hospitals.map((h) => (
            <div key={`${h.name}-${h.zip}`} className="py-3 flex justify-between gap-4">
              <div>
                <p className="font-medium text-ink text-sm">{h.name}</p>
                <p className="text-xs text-muted">
                  {h.city}, {h.state} {h.zip}
                  {h.emergency ? " · ED" : ""} · {h.match === "zip" ? "same ZIP" : h.match === "zip3" ? "nearby ZIP" : report.stateName}
                </p>
              </div>
              <p className="text-sm font-medium text-ink shrink-0">
                {h.rating === "Not Available" ? "Unrated" : `${h.rating}★`}
              </p>
            </div>
          ))}
          {report.hospitals.length === 0 && (
            <p className="text-sm text-muted">No Hospital Compare facilities matched this ZIP.</p>
          )}
        </div>
      </div>

      {isBundle && report.letters ? (
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Letters</h2>
            <a
              href={`/api/r/${token}/download`}
              className="link text-sm"
            >
              Download HTML / print to PDF
            </a>
          </div>
          <div className="surface p-6">
            <h3 className="font-semibold text-ink mb-3">Good Faith Estimate request</h3>
            <pre className="text-sm text-muted whitespace-pre-wrap font-sans leading-relaxed">{report.letters.gfe}</pre>
          </div>
          <div className="surface p-6">
            <h3 className="font-semibold text-ink mb-3">Bill negotiation letter</h3>
            <pre className="text-sm text-muted whitespace-pre-wrap font-sans leading-relaxed">{report.letters.negotiation}</pre>
          </div>
        </div>
      ) : (
        <UpgradeCta token={token} />
      )}

      <p className="text-xs text-faint leading-relaxed mb-8">{report.scope}</p>
      <p className="text-sm">
        <Link href={`/procedure/${report.cpt}?zip=${report.zip}`} className="link">
          Back to the free lookup for CPT {report.cpt}
        </Link>
      </p>
    </div>
  );
}
