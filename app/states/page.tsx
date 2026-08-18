import { Metadata } from "next";
import Link from "next/link";
import {
  getStateName,
  getPopularProcedures,
  getStateProcedurePrice,
  stateToSlug,
} from "@/lib/medicare";
import { getIndexableStateAbbrs } from "@/lib/geo";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Medical Costs by State",
  description:
    "Compare medical procedure costs across all 50 US states and DC. See how Medicare rates vary by location for MRIs, surgeries, office visits, and more.",
};

export default function StatesPage() {
  const states = getIndexableStateAbbrs();

  // Use a common procedure (office visit 99213) for comparison
  const refCode = "99213";
  const popular = getPopularProcedures();
  const refProc = popular.find((p) => p.code === refCode);
  const nationalPrice = refProc?.nationalNonFacPrice || 95.19;

  const statesWithPrices = states
    .map((abbr) => {
      const name = getStateName(abbr);
      const price = getStateProcedurePrice(refCode, abbr);
      return {
        abbr,
        name,
        price: price?.avgNonFac || 0,
        diff: price ? ((price.avgNonFac - nationalPrice) / nationalPrice) * 100 : 0,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  function formatPrice(price: number): string {
    return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="page-title mb-3">
          Medical Costs by State
        </h1>
        <p className="lede max-w-3xl">
          Compare 2026 Medicare physician rates across the 50 states and DC.
          Each state hub lists {popular.length} featured procedures and a ZIP
          search for the rest of the fee schedule.
        </p>
      </div>

      <div className="surface overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] border-b border-[var(--hairline)]">
            <tr>
              <th className="text-left px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">State</th>
              <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">Avg Office Visit</th>
              <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide hidden sm:table-cell">vs National Avg</th>
            </tr>
          </thead>
          <tbody>
            {statesWithPrices.map((state) => (
              <tr key={state.abbr} className="border-t border-[var(--hairline)] hover:bg-black/[0.02] transition-colors">
                <td className="px-3 py-3 sm:px-5">
                  <Link
                    href={`/state/${stateToSlug(state.name)}`}
                    className="text-ink font-medium hover:opacity-70 transition-opacity"
                  >
                    {state.name}
                  </Link>
                </td>
                <td className="px-3 py-3 sm:px-5 text-right font-medium text-ink">
                  {formatPrice(state.price)}
                </td>
                <td className={`px-3 py-3 sm:px-5 text-right font-medium hidden sm:table-cell ${state.diff > 2 ? "text-red-600" : state.diff < -2 ? "text-green-700" : "text-muted"}`}>
                  {state.diff > 0 ? "+" : ""}{state.diff.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-faint">
        Prices shown are average Medicare rates for a standard office visit (CPT 99213) across all
        localities within each state. Click any state to see full procedure pricing.
      </p>
    </div>
  );
}
