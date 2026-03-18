import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllStates,
  getStateName,
  getPopularProcedures,
  getStateProcedurePrice,
  getStateLocalities,
  slugToStateAbbr,
  stateToSlug,
  procedureToSlug,
  CONVERSION_FACTOR,
} from "@/lib/medicare";

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  const states = getAllStates().filter((s) => {
    const name = getStateName(s);
    return name !== s; // filter out any that don't have a name mapping
  });
  return states.map((abbr) => ({
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
    description: `How much do medical procedures cost in ${stateName}? Compare Medicare rates for MRIs, surgeries, office visits, and more. Free cost lookup with 2026 pricing data for ${stateName}.`,
  };
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatPriceExact(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function StatePage({ params }: PageProps) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();

  const stateName = getStateName(abbr);
  const popular = getPopularProcedures();
  const localities = getStateLocalities(abbr);

  // Get all states for the nav section
  const allStates = getAllStates()
    .filter((s) => getStateName(s) !== s)
    .filter((s) => s !== "PR" && s !== "VI");

  // Calculate prices for popular procedures in this state
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

  const avgDiff = proceduresWithPrices.length > 0
    ? proceduresWithPrices.reduce((sum, p) => sum + p.diff, 0) / proceduresWithPrices.length
    : 0;

  const costLabel = avgDiff > 2 ? "above" : avgDiff < -2 ? "below" : "near";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <Link href="/procedures" className="hover:text-blue-600 transition-colors">Procedures</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <span className="text-gray-700 font-medium">{stateName}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Medical Procedure Costs in {stateName}
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl">
          {stateName} medical procedure costs are generally {costLabel} the national average.
          {localities.length > 1
            ? ` Medicare divides ${stateName} into ${localities.length} pricing localities, so costs can vary within the state.`
            : ` ${stateName} has a single Medicare pricing locality.`}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cost vs National Avg</div>
          <div className={`text-3xl font-extrabold ${avgDiff > 2 ? "text-red-600" : avgDiff < -2 ? "text-green-600" : "text-gray-900"}`}>
            {avgDiff > 0 ? "+" : ""}{avgDiff.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">{costLabel === "above" ? "Higher than average" : costLabel === "below" ? "Lower than average" : "Close to average"}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pricing Localities</div>
          <div className="text-3xl font-extrabold text-gray-900">{localities.length}</div>
          <div className="text-xs text-gray-400 mt-1">Medicare pricing regions</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Procedures Covered</div>
          <div className="text-3xl font-extrabold text-gray-900">7,500+</div>
          <div className="text-xs text-gray-400 mt-1">CPT codes with pricing</div>
        </div>
      </div>

      {/* Locality breakdown (if multiple) */}
      {localities.length > 1 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Pricing Regions in {stateName}
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Locality</th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Work GPCI</th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">PE GPCI</th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">MP GPCI</th>
                </tr>
              </thead>
              <tbody>
                {localities.map((loc, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 font-medium text-gray-900 capitalize">{loc.localityName.toLowerCase()}</td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600">{loc.pwGpci.toFixed(3)}</td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600">{loc.peGpci.toFixed(3)}</td>
                    <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-600 hidden sm:table-cell">{loc.mpGpci.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            GPCI (Geographic Practice Cost Index) values adjust Medicare payments for regional cost differences.
            Higher values mean higher costs. A GPCI of 1.000 equals the national average.
          </p>
        </div>
      )}

      {/* Procedure prices table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          Procedure Costs in {stateName}
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Procedure</th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{stateName}</th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">National Avg</th>
                <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Difference</th>
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
                  </td>
                  <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right font-bold text-gray-900">
                    {formatPrice(proc.stateAvgNonFac)}
                  </td>
                  <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-500 hidden sm:table-cell">
                    {formatPrice(proc.nationalNonFacPrice)}
                  </td>
                  <td className={`px-2 py-2 sm:px-5 sm:py-3.5 text-right font-semibold hidden md:table-cell ${proc.diff > 2 ? "text-red-600" : proc.diff < -2 ? "text-green-600" : "text-gray-500"}`}>
                    {proc.diff > 0 ? "+" : ""}{proc.diff.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Prices shown are Medicare office (non-facility) rates. Click any procedure for full details including hospital rates and savings tips.
        </p>
      </div>

      {/* Understanding costs section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Understanding Medical Costs in {stateName}
        </h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            Medical procedure costs in {stateName} are determined by Medicare's Geographic Practice Cost Indices (GPCIs),
            which account for differences in physician work, practice expenses, and malpractice insurance across regions.
            {localities.length > 1
              ? ` Because ${stateName} has ${localities.length} different pricing localities, costs can vary significantly depending on where within the state the procedure is performed.`
              : ""
            }
          </p>
          <p>
            The prices listed above represent Medicare reimbursement rates, which serve as a baseline for what healthcare
            costs in {stateName}. Private insurance companies typically negotiate rates between 130% and 200% of these
            Medicare amounts. If you are paying out of pocket, many providers in {stateName} offer cash discounts of
            20% to 40% off their standard charges.
          </p>
          <p>
            For the most accurate pricing, enter your ZIP code on any procedure page to see costs adjusted for your
            specific locality within {stateName}.
          </p>
        </div>
      </div>

      {/* Ways to save */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          Ways to Save on Medical Costs in {stateName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Compare Insurance Plans",
              desc: `Comparing marketplace plans in ${stateName} could save you thousands on procedures.`,
              link: "https://www.ehealthinsurance.com/",
              cta: "Compare plans on eHealth",
            },
            {
              title: "Try Telehealth First",
              desc: "Many consultations can be done virtually for $50-100, saving hundreds vs an in-person visit.",
              link: "https://sesamecare.com/",
              cta: "Book on Sesame Care",
            },
            {
              title: "Save on Prescriptions",
              desc: "If a procedure leads to a prescription, discount cards can save up to 80% at pharmacies.",
              link: "https://www.goodrx.com/",
              cta: "Check prices on GoodRx",
            },
          ].map((item) => (
            <div key={item.title} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
              <h3 className="font-bold text-sm text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.cta} &rarr;
              </a>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-4">
          Some links are affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </div>

      {/* Other states */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Compare Costs in Other States
        </h2>
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

      {/* Data source */}
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-5">
        Data source: 2026 Medicare Physician Fee Schedule (CMS PPRRVU26B, released March 2026).
        Conversion factor: ${CONVERSION_FACTOR}. Prices shown are Medicare allowed amounts and
        may not reflect actual charges. Private insurance and self-pay estimates are approximations.
      </div>
    </div>
  );
}
