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
} from "@/lib/medicare";
import { getIndexableStateAbbrs } from "@/lib/geo";
import ZipPriceLookup from "@/components/ZipPriceLookup";
import PaywallCard from "@/components/PaywallCard";
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

  return {
    title: `${proc.friendlyName} Cost in ${stateName} (2026)`,
    description: `2026 Medicare physician rate for ${proc.friendlyName.toLowerCase()} (CPT ${proc.code}) in ${stateName}: about $${price} in an office. Locality table, office vs hospital, and ZIP lookup. Not a hospital bill.`,
    alternates: { canonical: `/state/${stateSlug}/${procSlug}` },
  };
}

function PriceCard({
  label,
  price,
  sublabel,
  highlight,
}: {
  label: string;
  price: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 text-center transition-shadow ${
        highlight
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${highlight ? "text-blue-200" : "text-gray-400"}`}>
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${highlight ? "" : "text-gray-900"}`}>{price}</div>
      {sublabel && (
        <div className={`text-xs mt-2 ${highlight ? "text-blue-200" : "text-gray-400"}`}>{sublabel}</div>
      )}
    </div>
  );
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
      a: `No. ${formatPrice(statePrice.avgNonFac)} is the Medicare physician allowed amount for CPT ${proc.code}. Anesthesia, facility fees, implants, and other CPT codes billed the same day are extra. ${stateName} ranks #${currentRank} of ${stateComparisons.length} states on this physician line (${vsNational}).`,
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <Link href={`/state/${stateSlug}`} className="hover:text-blue-600 transition-colors">
          {stateName}
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <span className="text-gray-700 font-medium">{proc.friendlyName}</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {proc.friendlyName} Cost in {stateName}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">{proc.description}</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shrink-0">
            CPT {proc.code}
          </span>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-bold text-gray-900">{stateName} Medicare physician rate (2026)</h2>
          <span
            className={`text-sm font-medium px-2.5 py-0.5 rounded-full border ${
              diff > 2
                ? "bg-red-50 text-red-700 border-red-100"
                : diff < -2
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-gray-50 text-gray-700 border-gray-100"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {diff.toFixed(1)}% vs national
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          {statePrice.localities.length > 1
            ? `Average of ${statePrice.localities.length} localities. Office range ${formatPrice(cheapestLoc.nonFac)}–${formatPrice(priciestLoc.nonFac)}.`
            : `Single statewide locality.`}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
        <h2 className="text-xl font-bold mb-1">Your ZIP in {stateName}</h2>
        <p className="text-blue-200 text-sm mb-5">
          {stateCopy?.zipNote ??
            `Map a ZIP to the Medicare locality that actually prices CPT ${proc.code} here.`}
        </p>
        <ZipPriceLookup code={proc.code} label={`Local ${procLower} rate`} />
      </div>

      <PaywallCard code={proc.code} procedureName={proc.friendlyName} />

      <ScopeNote
        extra={
          settingGap >= 0.5
            ? `In ${stateName} the office and hospital physician lines for this CPT differ by ${formatPrice(settingGap)}.`
            : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wide text-gray-500">
            National vs {stateName}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">National office</span>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(nationalNonFac)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">National hospital (physician)</span>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(nationalFac)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{stateName} vs national</span>
              <span className="text-sm font-semibold text-gray-900">{vsNational}</span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wide text-gray-500">
            Where {stateName} ranks for this CPT
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Rank (lowest physician fee first)</span>
              <span className="text-sm font-semibold text-gray-900">
                #{currentRank} of {stateComparisons.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Lowest state</span>
              <span className="text-sm font-semibold text-gray-900">
                {cheapestState.name} ({formatPrice(cheapestState.avgNonFac)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Highest state</span>
              <span className="text-sm font-semibold text-gray-900">
                {mostExpensiveState.name} ({formatPrice(mostExpensiveState.avgNonFac)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {statePrice.localities.length > 1 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            CPT {proc.code} by {stateName} locality
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Locality
                  </th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Office
                  </th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                    Hospital (physician)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...statePrice.localities]
                  .sort((a, b) => b.nonFac - a.nonFac)
                  .map((loc) => (
                    <tr key={loc.name} className="border-t border-gray-50">
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 font-medium text-gray-900 capitalize">
                        {loc.name.toLowerCase()}
                      </td>
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right font-bold text-gray-900">
                        {formatPrice(loc.nonFac)}
                      </td>
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-500 hidden sm:table-cell">
                        {formatPrice(loc.fac)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {gpciLocalities.length > 1 && (
            <p className="text-xs text-gray-400 mt-3">
              PE GPCI ranges from {Math.min(...gpciLocalities.map((g) => g.peGpci)).toFixed(3)} to{" "}
              {Math.max(...gpciLocalities.map((g) => g.peGpci)).toFixed(3)} in {stateName}. That
              index is why the same CPT is not one price statewide.
            </p>
          )}
        </div>
      )}

      {(stateCopy || editorial) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-12 space-y-4 text-sm text-gray-600 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900">
            {proc.friendlyName} and how {stateName} is priced
          </h2>
          {stateCopy && <p>{stateCopy.overview}</p>}
          {stateCopy && <p>{stateCopy.costContext}</p>}
          {editorial && (
            <p>
              <span className="font-semibold text-gray-900">This procedure: </span>
              {editorial.whatItIs}
            </p>
          )}
        </div>
      )}

      {editorial && (
        <>
          <ProcedureEditorial name={proc.friendlyName} content={editorial} compact />
          <div className="-mt-8 mb-12 text-sm">
            <Link href={`/procedure/${proc.code}`} className="text-blue-600 hover:text-blue-800 font-bold">
              Full {procLower} billing notes, RVUs, and ZIP tool →
            </Link>
          </div>
        </>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Other featured procedures in {stateName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {relatedProcedures.map((rp) => {
            const rpPrice = getStateProcedurePrice(rp.code, abbr);
            return (
              <Link
                key={rp.code}
                href={`/state/${stateSlug}/${procedureToSlug(rp.friendlyName)}`}
                className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                  {rp.friendlyName}
                </h3>
                <p className="text-blue-700 font-bold text-lg">
                  {rpPrice ? formatPriceRound(rpPrice.avgNonFac) : formatPriceRound(rp.nationalNonFacPrice)}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-4">
          <Link href={`/state/${stateSlug}`} className="text-sm text-blue-600 hover:text-blue-800 font-bold">
            {stateName} locality index and all featured rates →
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{proc.friendlyName} in other states</h2>
        <div className="flex flex-wrap gap-2">
          {allStates.map((s) => {
            const name = getStateName(s);
            const isCurrentState = s === abbr;
            return (
              <Link
                key={s}
                href={`/state/${stateToSlug(name)}/${procSlug}`}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrentState
                    ? "bg-blue-600 text-white border-blue-600 font-bold"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {s}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {proc.friendlyName} in {stateName}: questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-2">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <DataSourceNote />
    </div>
  );
}
