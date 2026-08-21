import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getStateName,
  getPopularProcedures,
  getStateProcedurePrice,
  getStateLocalities,
  slugToStateAbbr,
  stateToSlug,
  procedureToSlug,
  getPopularProcedureBySlug,
  getStateSampleZip,
} from "@/lib/medicare";
import { getIndexableStateAbbrs } from "@/lib/geo";
import ZipPriceLookup from "@/components/ZipPriceLookup";
import EpisodeEstimate from "@/components/EpisodeEstimate";
import { getEpisodeEstimate } from "@/lib/episode-estimate";
import PaywallCard from "@/components/PaywallCard";
import PriceCard from "@/components/PriceCard";
import SearchPanel from "@/components/SearchPanel";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import ProcedureEditorial from "@/components/ProcedureEditorial";
import ScopeNote from "@/components/ScopeNote";
import DataSourceNote from "@/components/DataSourceNote";
import { getProcedureContent } from "@/lib/procedure-content";
import { getStateContent } from "@/lib/state-content";
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from "@/lib/schema";
import { formatPrice, formatPriceRound } from "@/lib/format";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ state: string; procedure: string }>;
}

export async function generateStaticParams() {
  const states = getIndexableStateAbbrs();
  const popular = getPopularProcedures();
  const params: { state: string; procedure: string }[] = [];
  for (const abbr of states) {
    for (const proc of popular) {
      params.push({
        state: stateToSlug(getStateName(abbr)),
        procedure: procedureToSlug(proc.friendlyName),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug, procedure: procSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  const proc = getPopularProcedureBySlug(procSlug);
  if (!abbr || !proc) return { title: "Not Found" };

  const stateName = getStateName(abbr);
  const statePrice = getStateProcedurePrice(proc.code, abbr);
  const price = statePrice ? Math.round(statePrice.avgNonFac) : Math.round(proc.nationalNonFacPrice);

  // Lead with the whole-procedure figure, not the physician line. See the same
  // change in app/procedure/[code]/page.tsx for why.
  const est = getEpisodeEstimate(proc.code);
  const description = est?.hospitalOutpatient
    ? `${proc.friendlyName} (CPT ${proc.code}) in ${stateName}: about $${Math.round(est.hospitalOutpatient).toLocaleString("en-US")} in total under Medicare in a hospital outpatient setting, of which about $${price.toLocaleString("en-US")} is the physician fee. Locality table and free ZIP lookup.`
    : `2026 Medicare physician rate for ${proc.friendlyName.toLowerCase()} (CPT ${proc.code}) in ${stateName}: about $${price} in an office. Locality table, office vs hospital, and ZIP lookup. Not a hospital bill.`;

  return {
    title: `${proc.friendlyName} Cost in ${stateName} (2026)`,
    description,
    alternates: { canonical: `/state/${stateSlug}/${procSlug}` },
  };
}

export default async function StateProcedurePage({ params }: PageProps) {
  const { state: stateSlug, procedure: procSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  const proc = getPopularProcedureBySlug(procSlug);
  if (!abbr || !proc) notFound();

  const stateName = getStateName(abbr);
  const statePrice = getStateProcedurePrice(proc.code, abbr);
  if (!statePrice) notFound();

  const nationalNonFac = proc.nationalNonFacPrice;
  const nationalFac = proc.nationalFacPrice;
  const diff = ((statePrice.avgNonFac - nationalNonFac) / nationalNonFac) * 100;
  const primaryPrice = Math.max(statePrice.avgNonFac, statePrice.avgFac);
  const settingGap = Math.abs(statePrice.avgNonFac - statePrice.avgFac);
  const gpciLocalities = getStateLocalities(abbr);
  const stateCopy = getStateContent(abbr);
  const editorial = getProcedureContent(proc.code);

  const popular = getPopularProcedures();
  const relatedProcedures = popular.filter((p) => p.code !== proc.code).slice(0, 8);

  const allStates = getIndexableStateAbbrs();

  const stateComparisons = allStates
    .map((s) => {
      const sp = getStateProcedurePrice(proc.code, s);
      if (!sp) return null;
      return {
        abbr: s,
        name: getStateName(s),
        avgNonFac: sp.avgNonFac,
        diff: ((sp.avgNonFac - nationalNonFac) / nationalNonFac) * 100,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.avgNonFac - b!.avgNonFac) as Array<{
    abbr: string;
    name: string;
    avgNonFac: number;
    diff: number;
  }>;

  const currentRank = stateComparisons.findIndex((s) => s.abbr === abbr) + 1;
  const cheapestState = stateComparisons[0];
  const mostExpensiveState = stateComparisons[stateComparisons.length - 1];

  const sortedLocs = [...statePrice.localities].sort((a, b) => a.nonFac - b.nonFac);
  const cheapestLoc = sortedLocs[0];
  const priciestLoc = sortedLocs[sortedLocs.length - 1];
  const inStateSpread = priciestLoc.nonFac - cheapestLoc.nonFac;

  const procLower = proc.friendlyName.toLowerCase();
  const sampleZip = getStateSampleZip(abbr) ?? undefined;
  const episodeEst = getEpisodeEstimate(proc.code);
  const vsNational =
    diff > 2
      ? `${Math.abs(diff).toFixed(0)}% above the national office rate of ${formatPrice(nationalNonFac)}`
      : diff < -2
        ? `${Math.abs(diff).toFixed(0)}% below the national office rate of ${formatPrice(nationalNonFac)}`
        : `within 2% of the national office rate of ${formatPrice(nationalNonFac)}`;

  const faqs = [
    {
      q: `How much does ${procLower} cost in ${stateName}?`,
      a:
        statePrice.localities.length > 1
          ? `The 2026 Medicare physician office rate for CPT ${proc.code} averages ${formatPrice(statePrice.avgNonFac)} across ${statePrice.localities.length} ${stateName} localities, from ${formatPrice(cheapestLoc.nonFac)} in ${cheapestLoc.name} to ${formatPrice(priciestLoc.nonFac)} in ${priciestLoc.name}. The hospital physician rate averages ${formatPrice(statePrice.avgFac)}. Enter a ZIP for the exact locality.`
          : `${stateName} is a single Medicare locality for this fee schedule. The 2026 physician rate for CPT ${proc.code} is ${formatPrice(statePrice.avgNonFac)} in an office and ${formatPrice(statePrice.avgFac)} in a hospital, statewide. A ZIP lookup still confirms the locality mapping.`,
    },
    {
      q: `Does the rate change inside ${stateName}?`,
      a:
        statePrice.localities.length > 1
          ? `Yes. CMS splits ${stateName} into ${statePrice.localities.length} payment localities. For this CPT the office physician fee spans ${formatPrice(inStateSpread)} from the lowest to highest locality. ${stateCopy?.zipNote ?? "Enter a ZIP to see which locality applies."}`
          : `Not on the physician fee schedule. ${stateName} uses one locality, so the Medicare physician rate is the same from one end of the state to the other. What still changes is site of service (office vs hospital) and any facility fee the hospital bills on its own claim.`,
    },
    {
      q: `What will a Medicare patient owe for the physician fee?`,
      a: `After the Part B deductible, coinsurance is usually 20% of the allowed amount: about ${formatPriceRound(statePrice.avgNonFac * 0.2)} for the office physician line or ${formatPriceRound(statePrice.avgFac * 0.2)} for the hospital physician line in ${stateName}. Medigap may cover that 20%. This is not the hospital facility fee.`,
    },
    {
      q: `Is this the full ${procLower} bill in ${stateName}?`,
      a: episodeEst?.hospitalOutpatient
        ? `No. ${formatPrice(statePrice.avgNonFac)} is only the physician's share. Adding Medicare's facility payment brings the total to about ${formatPriceRound(episodeEst.hospitalOutpatient)} in a hospital outpatient department${episodeEst.asc ? `, or about ${formatPriceRound(episodeEst.asc)} at an ambulatory surgery centre` : ""}. Anesthesia, pathology and other codes billed the same day are extra. ${stateName} ranks #${currentRank} of ${stateComparisons.length} states on the physician line (${vsNational}).`
        : `No. ${formatPrice(statePrice.avgNonFac)} is the Medicare physician allowed amount for CPT ${proc.code}. Anesthesia, facility fees, implants, and other CPT codes billed the same day are extra. ${stateName} ranks #${currentRank} of ${stateComparisons.length} states on this physician line (${vsNational}).`,
    },
  ];

  const url = `/state/${stateSlug}/${procSlug}`;
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: stateName, url: `/state/${stateSlug}` },
      { name: `${proc.friendlyName} Cost`, url },
    ]),
    medicalWebPageSchema({
      name: `${proc.friendlyName} Cost in ${stateName} (2026)`,
      description: `2026 Medicare physician rate for ${procLower} (CPT ${proc.code}) in ${stateName}, with locality breakdown and ZIP lookup.`,
      url,
    }),
    faqSchema(faqs),
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-2 text-sm text-faint mb-8 flex-wrap">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/state/${stateSlug}`} className="hover:text-ink transition-colors">
          {stateName}
        </Link>
        <span>/</span>
        <span className="text-muted">{proc.friendlyName}</span>
      </nav>

      <div className="mb-10">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">
              {proc.friendlyName} Cost in {stateName}
            </h1>
            <p className="lede mt-2">{proc.description}</p>
          </div>
          <span className="text-[11px] font-mono text-muted bg-white border border-[var(--hairline)] px-3 py-1.5 rounded-full shrink-0">
            CPT {proc.code}
          </span>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{stateName} Medicare physician rate (2026)</h2>
          <span className="text-xs text-muted bg-white border border-[var(--hairline)] px-2.5 py-0.5 rounded-full">
            {diff > 0 ? "+" : ""}
            {diff.toFixed(1)}% vs national
          </span>
        </div>
        <p className="text-sm text-faint mb-6">
          {statePrice.localities.length > 1
            ? `Average of ${statePrice.localities.length} localities. Office range ${formatPrice(cheapestLoc.nonFac)}–${formatPrice(priciestLoc.nonFac)}.`
            : `Single statewide locality.`}
        </p>
        <div className="price-grid">
          <PriceCard
            label={`${stateName} (Office)`}
            price={formatPrice(statePrice.avgNonFac)}
            sublabel="Non-facility physician fee"
            highlight
          />
          <PriceCard
            label={`${stateName} (Hospital)`}
            price={formatPrice(statePrice.avgFac)}
            sublabel="Facility physician fee"
          />
          <PriceCard
            label="Private plan est."
            price={`${formatPriceRound(primaryPrice * 1.3)}–${formatPriceRound(primaryPrice * 2.0)}`}
            sublabel="~130–200% of Medicare"
          />
          <PriceCard
            label="Cash / self-pay est."
            price={`${formatPriceRound(primaryPrice * 0.8)}–${formatPriceRound(primaryPrice * 1.5)}`}
            sublabel="~80–150% of Medicare"
          />
        </div>
      </div>

      <EpisodeEstimate code={proc.code} procedureName={proc.friendlyName} />

      <SearchPanel
        title={`Your ZIP in ${stateName}`}
        subtitle={
          stateCopy?.zipNote ??
          `Map a ZIP to the Medicare locality that actually prices CPT ${proc.code} here.`
        }
      >
        <ZipPriceLookup
          code={proc.code}
          label={`Local ${procLower} rate`}
          placeholderZip={sampleZip}
        />
      </SearchPanel>

      <PaywallCard
        code={proc.code}
        procedureName={proc.friendlyName}
        placeholderZip={sampleZip}
        stateName={stateName}
      />

      <ScopeNote
        extra={
          settingGap >= 0.5
            ? `In ${stateName} the office and hospital physician lines for this CPT differ by ${formatPrice(settingGap)}.`
            : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="surface p-6">
          <h3 className="text-[11px] font-medium mb-4 uppercase tracking-[0.08em] text-faint">
            National vs {stateName}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">National office</span>
              <span className="text-sm font-medium text-ink">{formatPrice(nationalNonFac)}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">National hospital (physician)</span>
              <span className="text-sm font-medium text-ink">{formatPrice(nationalFac)}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">{stateName} vs national</span>
              <span className="text-sm font-medium text-ink text-right">{vsNational}</span>
            </div>
          </div>
        </div>
        <div className="surface p-6">
          <h3 className="text-[11px] font-medium mb-4 uppercase tracking-[0.08em] text-faint">
            Where {stateName} ranks for this CPT
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">Rank (lowest physician fee first)</span>
              <span className="text-sm font-medium text-ink">
                #{currentRank} of {stateComparisons.length}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">Lowest state</span>
              <span className="text-sm font-medium text-ink text-right">
                {cheapestState.name} ({formatPrice(cheapestState.avgNonFac)})
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-muted">Highest state</span>
              <span className="text-sm font-medium text-ink text-right">
                {mostExpensiveState.name} ({formatPrice(mostExpensiveState.avgNonFac)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {statePrice.localities.length > 1 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight text-ink mb-4">
            CPT {proc.code} by {stateName} locality
          </h2>
          <div className="surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.02] border-b border-[var(--hairline)]">
                <tr>
                  <th className="text-left px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">
                    Locality
                  </th>
                  <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">
                    Office
                  </th>
                  <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide hidden sm:table-cell">
                    Hospital (physician)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...statePrice.localities]
                  .sort((a, b) => b.nonFac - a.nonFac)
                  .map((loc) => (
                    <tr key={loc.name} className="border-t border-[var(--hairline)]">
                      <td className="px-3 py-3 sm:px-5 font-medium text-ink capitalize">
                        {loc.name.toLowerCase()}
                      </td>
                      <td className="px-3 py-3 sm:px-5 text-right font-medium text-ink">
                        {formatPrice(loc.nonFac)}
                      </td>
                      <td className="px-3 py-3 sm:px-5 text-right text-muted hidden sm:table-cell">
                        {formatPrice(loc.fac)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {gpciLocalities.length > 1 && (
            <p className="text-xs text-faint mt-3">
              PE GPCI ranges from {Math.min(...gpciLocalities.map((g) => g.peGpci)).toFixed(3)} to{" "}
              {Math.max(...gpciLocalities.map((g) => g.peGpci)).toFixed(3)} in {stateName}. That
              index is why the same CPT is not one price statewide.
            </p>
          )}
        </div>
      )}

      {(stateCopy || editorial) && (
        <div className="surface p-6 mb-12 space-y-4 text-sm text-muted leading-relaxed">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            {proc.friendlyName} and how {stateName} is priced
          </h2>
          {stateCopy && <p>{stateCopy.overview}</p>}
          {stateCopy && <p>{stateCopy.costContext}</p>}
          {editorial && (
            <p>
              <span className="font-medium text-ink">This procedure: </span>
              {editorial.whatItIs}
            </p>
          )}
        </div>
      )}

      {editorial && (
        <>
          <ProcedureEditorial name={proc.friendlyName} content={editorial} compact />
          <div className="-mt-8 mb-12 text-sm">
            <Link href={`/procedure/${proc.code}`} className="link">
              Full {procLower} billing notes, RVUs, and ZIP tool →
            </Link>
          </div>
        </>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-4">Other featured procedures in {stateName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {relatedProcedures.map((rp) => {
            const rpPrice = getStateProcedurePrice(rp.code, abbr);
            return (
              <Link
                key={rp.code}
                href={`/state/${stateSlug}/${procedureToSlug(rp.friendlyName)}`}
                className="surface lift p-4"
              >
                <h3 className="font-medium text-sm text-ink mb-1">
                  {rp.friendlyName}
                </h3>
                <p className="font-semibold text-ink text-lg tracking-tight">
                  {rpPrice ? formatPriceRound(rpPrice.avgNonFac) : formatPriceRound(rp.nationalNonFacPrice)}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-4">
          <Link href={`/state/${stateSlug}`} className="link text-sm">
            {stateName} locality index and all featured rates →
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-4">{proc.friendlyName} in other states</h2>
        <div className="flex flex-wrap gap-2">
          {allStates.map((s) => {
            const name = getStateName(s);
            const isCurrentState = s === abbr;
            return (
              <Link
                key={s}
                href={`/state/${stateToSlug(name)}/${procSlug}`}
                className={`chip ${isCurrentState ? "chip-on" : ""}`}
              >
                {s}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-5">
          {proc.friendlyName} in {stateName}: questions
        </h2>
        <FaqList items={faqs} />
      </div>

      <DataSourceNote />
    </div>
  );
}
