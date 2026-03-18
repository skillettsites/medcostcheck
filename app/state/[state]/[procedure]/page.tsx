import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllStates,
  getStateName,
  getPopularProcedures,
  getStateProcedurePrice,
  slugToStateAbbr,
  stateToSlug,
  procedureToSlug,
  getPopularProcedureBySlug,
  CONVERSION_FACTOR,
} from "@/lib/medicare";
import ProcedureSearch from "@/components/ProcedureSearch";

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ state: string; procedure: string }>;
}

export async function generateStaticParams() {
  const states = getAllStates().filter((s) => {
    const name = getStateName(s);
    return name !== s && s !== "PR" && s !== "VI";
  });
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
    description: `How much does ${proc.friendlyName.toLowerCase()} cost in ${stateName}? Average Medicare rate: $${price}. Compare office vs hospital pricing, see regional variations, and find ways to save. CPT code ${proc.code}.`,
  };
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPriceRound(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
      <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${highlight ? "text-blue-200" : "text-gray-400"}`}>{label}</div>
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

  const popular = getPopularProcedures();
  const relatedProcedures = popular
    .filter((p) => p.code !== proc.code)
    .slice(0, 8);

  // Get neighboring states for comparison
  const allStates = getAllStates()
    .filter((s) => getStateName(s) !== s && s !== "PR" && s !== "VI");

  // Get prices for this procedure across all states for comparison
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <Link href={`/state/${stateSlug}`} className="hover:text-blue-600 transition-colors">{stateName}</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <span className="text-gray-700 font-medium">{proc.friendlyName}</span>
      </nav>

      {/* Header */}
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

      {/* Price cards */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-bold text-gray-900">
            {stateName} Average Cost (2026)
          </h2>
          <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full border ${diff > 2 ? "bg-red-50 text-red-700 border-red-100" : diff < -2 ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-700 border-gray-100"}`}>
            {diff > 0 ? "+" : ""}{diff.toFixed(1)}% vs national avg
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Average across {statePrice.localities.length} Medicare {statePrice.localities.length === 1 ? "locality" : "localities"} in {stateName}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PriceCard
            label={`${stateName} (Office)`}
            price={formatPrice(statePrice.avgNonFac)}
            sublabel="Non-facility rate"
            highlight
          />
          <PriceCard
            label={`${stateName} (Hospital)`}
            price={formatPrice(statePrice.avgFac)}
            sublabel="Facility rate"
          />
          <PriceCard
            label="Private Insurance Est."
            price={`${formatPriceRound(primaryPrice * 1.3)} - ${formatPriceRound(primaryPrice * 2.0)}`}
            sublabel="130-200% of Medicare"
          />
          <PriceCard
            label="Self-Pay / Cash Est."
            price={`${formatPriceRound(primaryPrice * 0.8)} - ${formatPriceRound(primaryPrice * 1.5)}`}
            sublabel="80-150% of Medicare"
          />
        </div>
      </div>

      {/* National comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-500">National Average</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Office Rate</span>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(nationalNonFac)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Hospital Rate</span>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(nationalFac)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-500">State Ranking</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{stateName} rank</span>
              <span className="text-sm font-semibold text-gray-900">#{currentRank} of {stateComparisons.length} {currentRank <= 10 ? "(least expensive)" : currentRank >= stateComparisons.length - 9 ? "(most expensive)" : ""}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Cheapest state</span>
              <span className="text-sm font-semibold text-gray-900">{cheapestState.name} ({formatPrice(cheapestState.avgNonFac)})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Most expensive</span>
              <span className="text-sm font-semibold text-gray-900">{mostExpensiveState.name} ({formatPrice(mostExpensiveState.avgNonFac)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Locality breakdown */}
      {statePrice.localities.length > 1 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Cost by Region in {stateName}
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Region</th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Office Rate</th>
                  <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Hospital Rate</th>
                </tr>
              </thead>
              <tbody>
                {statePrice.localities
                  .sort((a, b) => b.nonFac - a.nonFac)
                  .map((loc, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 font-medium text-gray-900 capitalize">{loc.name.toLowerCase()}</td>
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right font-bold text-gray-900">{formatPrice(loc.nonFac)}</td>
                      <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right text-gray-500 hidden sm:table-cell">{formatPrice(loc.fac)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Get local pricing */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
        <h2 className="text-xl font-bold mb-1">
          Get exact pricing for your ZIP code
        </h2>
        <p className="text-blue-200 text-sm mb-5">
          Enter your ZIP code to see costs adjusted for your specific locality within {stateName}
        </p>
        <ProcedureSearch />
      </div>

      {/* Understanding costs */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          About {proc.friendlyName} Costs in {stateName}
        </h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            The average Medicare reimbursement for {proc.friendlyName.toLowerCase()} in {stateName} is{" "}
            {formatPrice(statePrice.avgNonFac)} for an office setting and {formatPrice(statePrice.avgFac)} in a hospital.
            {diff > 2 ? ` This is about ${Math.abs(diff).toFixed(0)}% higher than the national average of ${formatPrice(nationalNonFac)}.` :
             diff < -2 ? ` This is about ${Math.abs(diff).toFixed(0)}% lower than the national average of ${formatPrice(nationalNonFac)}.` :
             ` This is close to the national average of ${formatPrice(nationalNonFac)}.`}
          </p>
          <p>
            <strong className="text-gray-900">Medicare patients</strong> typically pay 20% of the Medicare rate after
            meeting their deductible. For this procedure in {stateName}, that would be roughly{" "}
            {formatPriceRound(statePrice.avgNonFac * 0.2)} for an office visit or{" "}
            {formatPriceRound(statePrice.avgFac * 0.2)} in a hospital setting.
          </p>
          <p>
            <strong className="text-gray-900">Private insurance</strong> plans in {stateName} typically pay between
            130% and 200% of Medicare rates for this procedure, putting the total somewhere between{" "}
            {formatPriceRound(primaryPrice * 1.3)} and {formatPriceRound(primaryPrice * 2.0)}.
          </p>
          <p>
            <strong className="text-gray-900">Without insurance</strong>, you may be able to negotiate a cash discount.
            Many providers in {stateName} will reduce their fees by 20% to 40% for self-pay patients.
            Always ask about cash pricing before scheduling your procedure.
          </p>
        </div>
      </div>

      {/* Ways to save */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          Ways to Save on {proc.friendlyName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Compare Insurance Plans",
              desc: `Uninsured? Comparing marketplace plans in ${stateName} could save you thousands on procedures like this.`,
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
              desc: "If this procedure leads to a prescription, check discount cards for up to 80% savings.",
              link: "https://www.goodrx.com/",
              cta: "Check prices on GoodRx",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-blue-100/50 shadow-sm">
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
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-100/50">
          <p className="text-[10px] text-gray-400">
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
          <Link href="/save" className="text-xs text-blue-600 hover:text-blue-800 font-bold">
            More ways to save &rarr;
          </Link>
        </div>
      </div>

      {/* Related procedures in this state */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Other Procedures in {stateName}
        </h2>
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
          <Link
            href={`/state/${stateSlug}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-bold"
          >
            View all procedures in {stateName} &rarr;
          </Link>
        </div>
      </div>

      {/* Compare this procedure across states */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {proc.friendlyName} Cost by State
        </h2>
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

      {/* Data source */}
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-5">
        Data source: 2026 Medicare Physician Fee Schedule (CMS PPRRVU26B, released March 2026).
        Conversion factor: ${CONVERSION_FACTOR}. Prices shown are Medicare allowed amounts and
        may not reflect actual charges. Private insurance and self-pay estimates are approximations
        based on industry averages.
      </div>
    </div>
  );
}
