import { getEpisodeEstimate } from "@/lib/episode-estimate";
import { formatPriceRound } from "@/lib/format";
import PriceCard from "@/components/PriceCard";

/**
 * The honest headline: what the whole thing costs, not just the physician fee.
 *
 * This sits directly under the physician price cards on the free pages. It is
 * deliberately free, for two reasons. Showing only the professional fee on a
 * page titled "Total Knee Replacement Cost" was misleading by roughly 12x, and
 * a page that answers the question people actually searched is the one that
 * earns the click. The paid report sells on locality, named hospitals and
 * letters, which is what genuinely needs the ZIP.
 *
 * Uses PriceCard rather than the .display type scale: these are five-figure
 * numbers and the display size overflowed the card.
 */
export default function EpisodeEstimate({
  code,
  procedureName,
}: {
  code: string;
  procedureName: string;
}) {
  const e = getEpisodeEstimate(code);
  if (!e || (!e.hospitalOutpatient && !e.asc)) return null;

  const basisNote =
    e.facilityBasis === "comprehensive"
      ? "Medicare pays the hospital a single comprehensive amount for this procedure, covering the facility's share of the encounter including implants and supplies."
      : e.facilityBasis === "conditional"
      ? "Medicare may pay the facility separately for this code or package it into another service on the same day, so treat the facility share as an upper bound."
      : "This is Medicare's separate payment to the facility on top of the physician's fee.";

  const physicianShare = e.hospitalOutpatient
    ? Math.round((e.physician / e.hospitalOutpatient) * 100)
    : null;

  return (
    <div className="panel mb-12">
      <h2 className="panel-title">What the whole procedure costs</h2>
      <p className="panel-sub">
        The rate above is the physician&rsquo;s fee on its own. The facility
        bills separately, and for most procedures the facility is the larger
        half of the bill. These are 2026 national Medicare amounts.
      </p>

      <div className="price-grid">
        {e.hospitalOutpatient && (
          <PriceCard
            label="Hospital outpatient, total"
            price={formatPriceRound(e.hospitalOutpatient)}
            sublabel={`${formatPriceRound(e.physician)} physician + ${formatPriceRound(
              e.hospitalOutpatient - e.physician
            )} facility`}
            highlight
          />
        )}
        {e.asc && (
          <PriceCard
            label="Surgery centre, total"
            price={formatPriceRound(e.asc)}
            sublabel={`${formatPriceRound(e.physician)} physician + ${formatPriceRound(
              e.asc - e.physician
            )} facility`}
          />
        )}
        <PriceCard
          label="Physician fee alone"
          price={formatPriceRound(e.physician)}
          sublabel={
            physicianShare !== null && physicianShare < 60
              ? `Only ${physicianShare}% of the hospital total`
              : "The professional component"
          }
        />
      </div>

      {e.asc && e.hospitalOutpatient && e.asc < e.hospitalOutpatient && (
        <p className="mt-5 text-sm text-ink">
          <strong>
            Choosing a surgery centre over a hospital saves about{" "}
            {formatPriceRound(e.hospitalOutpatient - e.asc)}
          </strong>{" "}
          on the Medicare allowed amount for {procedureName.toLowerCase()}. Ask
          whether your procedure can be done at an ambulatory surgery centre.
        </p>
      )}

      <p className="mt-4 text-xs text-faint">
        {basisNote} Medicare allowed amounts are not what an uninsured patient
        is charged, and not a quote. Private plans typically allow more.
      </p>
    </div>
  );
}
