import Link from "next/link";
import { formatPrice, formatPriceRound } from "@/lib/format";
import type { CostReport } from "@/lib/cost-report";
import UpgradeCta from "@/components/UpgradeCta";

function Card({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 text-center ${
        highlight
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${highlight ? "text-blue-200" : "text-gray-400"}`}>
        {label}
      </div>
      <div className={`text-2xl font-extrabold ${highlight ? "" : "text-gray-900"}`}>{value}</div>
      {sub && <div className={`text-xs mt-2 ${highlight ? "text-blue-200" : "text-gray-400"}`}>{sub}</div>}
    </div>
  );
}

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
        {isBundle ? "Complete Cost Report + Letters" : "Premium Cost Report"}
      </p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
        {report.procedureName}
      </h1>
      <p className="text-gray-500 mt-2">
        CPT {report.cpt} · ZIP {report.zip} · {report.locality}, {report.stateName}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <Card
          label="Office / clinic"
          value={money(report.episode.office)}
          sub="Physician non-facility allowed amount"
        />
        <Card
          label="Hospital outpatient"
          value={money(report.episode.hospitalOutpatient)}
          sub="Physician + OPPS facility"
          highlight
        />
        <Card
          label="ASC"
          value={money(report.episode.asc)}
          sub="Physician + ASC facility"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">How that episode is built</h2>
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
            <div key={label} className="flex justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-900 text-right">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{report.facility.note}</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">What to say to the scheduler</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{report.schedulerScript}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Typical add-ons</h2>
        <div className="space-y-4">
          {report.addOns.map((line) => (
            <div key={line.name} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between gap-3">
                <p className="font-semibold text-gray-900 text-sm">
                  {line.name}
                  {line.code ? <span className="text-gray-400 font-mono font-normal"> · {line.code}</span> : null}
                </p>
                {line.physicianOffice != null && (
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(line.physicianOffice)}</p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{line.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Nearby hospitals</h2>
        <p className="text-xs text-gray-400 mb-4">
          CMS Hospital Compare, matched by ZIP then 3-digit prefix then {report.stateName}. Ratings are CMS overall stars, not prices.
        </p>
        <div className="divide-y divide-gray-50">
          {report.hospitals.map((h) => (
            <div key={`${h.name}-${h.zip}`} className="py-3 flex justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{h.name}</p>
                <p className="text-xs text-gray-500">
                  {h.city}, {h.state} {h.zip}
                  {h.emergency ? " · ED" : ""} · {h.match === "zip" ? "same ZIP" : h.match === "zip3" ? "nearby ZIP" : report.stateName}
                </p>
              </div>
              <p className="text-sm font-bold text-blue-700 shrink-0">
                {h.rating === "Not Available" ? "Unrated" : `${h.rating}★`}
              </p>
            </div>
          ))}
          {report.hospitals.length === 0 && (
            <p className="text-sm text-gray-500">No Hospital Compare facilities matched this ZIP.</p>
          )}
        </div>
      </div>

      {isBundle && report.letters ? (
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">Letters</h2>
            <a
              href={`/api/r/${token}/download`}
              className="text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              Download HTML / print to PDF
            </a>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Good Faith Estimate request</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{report.letters.gfe}</pre>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Bill negotiation letter</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{report.letters.negotiation}</pre>
          </div>
        </div>
      ) : (
        <UpgradeCta token={token} />
      )}

      <p className="text-xs text-gray-400 leading-relaxed mb-8">{report.scope}</p>
      <p className="text-sm">
        <Link href={`/procedure/${report.cpt}?zip=${report.zip}`} className="text-blue-600 font-bold hover:text-blue-800">
          Back to the free lookup for CPT {report.cpt}
        </Link>
      </p>
    </div>
  );
}
