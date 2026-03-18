import { Metadata } from "next";
import Link from "next/link";
import {
  getAllStates,
  getStateName,
  getPopularProcedures,
  getStateProcedurePrice,
  stateToSlug,
} from "@/lib/medicare";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Medical Costs by State",
  description:
    "Compare medical procedure costs across all 50 US states and DC. See how Medicare rates vary by location for MRIs, surgeries, office visits, and more.",
};

export default function StatesPage() {
  const states = getAllStates()
    .filter((s) => {
      const name = getStateName(s);
      return name !== s && s !== "PR" && s !== "VI";
    });

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Medical Costs by State
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl">
          Medical procedure costs vary significantly across the United States. Compare Medicare
          rates in every state and find detailed pricing for 59 common procedures.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="text-left px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">State</th>
              <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Avg Office Visit</th>
              <th className="text-right px-2 py-2 sm:px-5 sm:py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">vs National Avg</th>
            </tr>
          </thead>
          <tbody>
            {statesWithPrices.map((state) => (
              <tr key={state.abbr} className="border-t border-gray-50 hover:bg-blue-50/50 transition-colors">
                <td className="px-2 py-2 sm:px-5 sm:py-3.5">
                  <Link
                    href={`/state/${stateToSlug(state.name)}`}
                    className="text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors"
                  >
                    {state.name}
                  </Link>
                </td>
                <td className="px-2 py-2 sm:px-5 sm:py-3.5 text-right font-bold text-gray-900">
                  {formatPrice(state.price)}
                </td>
                <td className={`px-2 py-2 sm:px-5 sm:py-3.5 text-right font-semibold hidden sm:table-cell ${state.diff > 2 ? "text-red-600" : state.diff < -2 ? "text-green-600" : "text-gray-500"}`}>
                  {state.diff > 0 ? "+" : ""}{state.diff.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Prices shown are average Medicare rates for a standard office visit (CPT 99213) across all
        localities within each state. Click any state to see full procedure pricing.
      </p>
    </div>
  );
}
