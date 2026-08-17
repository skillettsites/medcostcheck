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
} from "@/lib/medicare";
import { getIndexableStateAbbrs } from "@/lib/geo";
import ProcedureSearch from "@/components/ProcedureSearch";
import JsonLd from "@/components/JsonLd";
import ScopeNote from "@/components/ScopeNote";
import DataSourceNote from "@/components/DataSourceNote";
import { getStateContent } from "@/lib/state-content";
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from "@/lib/schema";
import { formatPriceRound } from "@/lib/format";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return getIndexableStateAbbrs().map((abbr) => ({
    state: stateToSlug(getStateName(abbr)),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "State Not Found" };

  const stateName = getStateName(abbr);
  return {
    title: `Medical Procedure Costs in ${stateName} (2026)`,
    description: `2026 Medicare physician rates in ${stateName}: localities, GPCI, and featured procedure costs. Search any CPT by ZIP. Not a hospital chargemaster.`,
    alternates: { canonical: `/state/${slug}` },
  };
}

function formatGpci(n: number): string {
  return n.toFixed(3);
}

export default async function StatePage({ params }: PageProps) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();

  const stateName = getStateName(abbr);
  const popular = getPopularProcedures();
  const localities = getStateLocalities(abbr);
  const stateCopy = getStateContent(abbr);

  const allStates = getIndexableStateAbbrs();

  const proceduresWithPrices = popular
    .map((proc) => {
      const statePrice = getStateProcedurePrice(proc.code, abbr);
      if (!statePrice) return null;
      return {
        ...proc,
        stateAvgNonFac: statePrice.avgNonFac,
        stateAvgFac: statePrice.avgFac,
        diff: ((statePrice.avgNonFac - proc.nationalNonFacPrice) / proc.nationalNonFacPrice) * 100,
      };
    })
    .filter(Boolean) as Array<{
    code: string;
    friendlyName: string;
    description: string;
    nationalNonFacPrice: number;
    nationalFacPrice: number;
    stateAvgNonFac: number;
    stateAvgFac: number;
    diff: number;
  }>;

  const avgDiff =
    proceduresWithPrices.length > 0
      ? proceduresWithPrices.reduce((sum, p) => sum + p.diff, 0) / proceduresWithPrices.length
      : 0;

  const costLabel = avgDiff > 2 ? "above" : avgDiff < -2 ? "below" : "near";
  const peMin = localities.length ? Math.min(...localities.map((l) => l.peGpci)) : 1;
  const peMax = localities.length ? Math.max(...localities.map((l) => l.peGpci)) : 1;

  const examples = proceduresWithPrices
    .slice(0, 3)
    .map((p) => `${p.friendlyName.toLowerCase()} ${formatPriceRound(p.stateAvgNonFac)}`)
    .join(", ");

  const faqs = [
    {
      q: `How do Medicare physician rates in ${stateName} compare nationally?`,
      a: `Across the ${proceduresWithPrices.length} featured procedures on this page, ${stateName} sits ${costLabel} the national average${avgDiff > 2 || avgDiff < -2 ? ` by about ${Math.abs(avgDiff).toFixed(0)}%` : ""}. Examples: ${examples}. Search any other CPT in the box above — those codes are in the tool, not as extra ${stateName} articles.`,
    },
    {
      q: `How many Medicare localities does ${stateName} have?`,
      a:
        localities.length > 1
          ? `${stateName} has ${localities.length} payment localities. Practice-expense GPCI runs from ${formatGpci(peMin)} to ${formatGpci(peMax)} (1.000 is the national average). ${stateCopy?.zipNote ?? "Enter a ZIP to see which locality applies."}`
          : `${stateName} is one Medicare locality, so the physician fee schedule is statewide. Site of service (office vs hospital) and hospital facility fees still change what a patient is billed.`,
    },
    {
      q: `What do these ${stateName} prices include?`,
      a: `Medicare physician allowed amounts only — the professional fee after GPCI. They do not include hospital facility charges, anesthesia, or your plan’s contracted rate. Medicare patients typically owe 20% of the allowed amount after the Part B deductible, before Medigap.`,
    },
    {
      q: `Can I look up a CPT that is not in the table?`,
      a: `Yes. The table is the featured set (${popular.length} procedures). The search box looks up 7,500+ payable codes from the 2026 fee schedule and applies ${stateName}’s locality when you enter a ZIP.`,
    },
  ];

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "States", url: "/states" },
      { name: stateName, url: `/state/${slug}` },
    ]),
    medicalWebPageSchema({
      name: `Medical Procedure Costs in ${stateName} (2026)`,
      description: `2026 Medicare physician rates in ${stateName} across ${localities.length} ${localities.length === 1 ? "locality" : "localities"}, with featured procedure prices and ZIP lookup.`,
      url: `/state/${slug}`,
    }),
    faqSchema(faqs),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <Link href="/states" className="hover:text-blue-600 transition-colors">
          States
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <span className="text-gray-700 font-medium">{stateName}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Medical Procedure Costs in {stateName}
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl">
          {stateName} Medicare physician rates are generally {costLabel} the
          national average
          {avgDiff > 2 || avgDiff < -2 ? ` (${avgDiff > 0 ? "+" : ""}${avgDiff.toFixed(1)}%)` : ""}.
          {localities.length > 1
            ? ` CMS uses ${localities.length} localities here, so a ZIP matters.`
            : ` One statewide locality — the ZIP tool still maps you onto that locality.`}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
        <h2 className="text-xl font-bold mb-1">Look up any CPT in {stateName}</h2>
        <p className="text-blue-200 text-sm mb-5">
          Featured table below is {popular.length} procedures. Search covers
          7,500+ fee-schedule codes.
        </p>
        <ProcedureSearch />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            vs national (featured set)
          </div>
          <div
            className={`text-3xl font-extrabold ${
              avgDiff > 2 ? "text-red-600" : avgDiff < -2 ? "text-green-600" : "text-gray-900"
            }`}
          >
            {avgDiff > 0 ? "+" : ""}
            {avgDiff.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Medicare localities
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{localities.length}</div>
          <div className="text-xs text-gray-400 mt-1">
            PE GPCI {formatGpci(peMin)}
            {peMin !== peMax ? `–${formatGpci(peMax)}` : ""}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            On this page
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{popular.length}</div>
          <div className="text-xs text-gray-400 mt-1">featured procedures · rest via search</div>
        </div>
      </div>

      <ScopeNote extra={`These ${stateName} averages are unweighted means of the state’s localities, not population-weighted.`} />

      {stateCopy && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            How Medicare prices {stateName}
          </h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>{stateCopy.overview}</p>
            <p>{stateCopy.costContext}</p>
            <p>{stateCopy.zipNote}</p>
          </div>
        </div>
      )}

      {localities.length > 1 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {stateName} payment localities (GPCI)
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Locality
                  </th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Work
                  </th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    PE
                  </th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                    MP
                  </th>
                </tr>
              </thead>
              <tbody>
                {localities.map((loc) => (
                  <tr key={loc.localityName} className="border-t border-gray-50">
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 font-medium text-gray-900 capitalize">
                      {loc.localityName.toLowerCase()}
                    </td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600">
                      {formatGpci(loc.pwGpci)}
                    </td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600">
                      {formatGpci(loc.peGpci)}
                    </td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600 hidden sm:table-cell">
                      {formatGpci(loc.mpGpci)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            GPCI of 1.000 equals the national average. Higher PE GPCI raises
            office-based procedures more than hospital physician lines.
          </p>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Featured physician rates in {stateName}
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Procedure
                </th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  {stateName}
                </th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                  National
                </th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                  Diff
                </th>
              </tr>
            </thead>
            <tbody>
              {proceduresWithPrices.map((proc) => (
                <tr key={proc.code} className="border-t border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <td className="px-2 py-2 sm:px-5 sm:py-3.5">
                    <Link
                      href={`/state/${slug}/${procedureToSlug(proc.friendlyName)}`}
                      className="text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors"
                    >
                      {proc.friendlyName}
                    </Link>
                    <span className="text-xs font-mono text-gray-400 ml-2">{proc.code}</span>
                  </td>
                  <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right font-bold text-gray-900">
                    {formatPriceRound(proc.stateAvgNonFac)}
                  </td>
                  <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-500 hidden sm:table-cell">
                    {formatPriceRound(proc.nationalNonFacPrice)}
                  </td>
                  <td
                    className={`px-2 py-2 sm:px-5 sm:py-3.5 text-right font-semibold hidden md:table-cell ${
                      proc.diff > 2 ? "text-red-600" : proc.diff < -2 ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {proc.diff > 0 ? "+" : ""}
                    {proc.diff.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Office (non-facility) physician rates. Open a row for the locality
          table and ZIP tool.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Other states</h2>
        <div className="flex flex-wrap gap-2">
          {allStates.map((s) => {
            const name = getStateName(s);
            const isCurrentState = s === abbr;
            return (
              <Link
                key={s}
                href={`/state/${stateToSlug(name)}`}
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
          Medical costs in {stateName}: questions
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
