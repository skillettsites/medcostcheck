import { Metadata } from "next";
import Link from "next/link";
import {
  getPopularProcedures,
  getCategories,
} from "@/lib/medicare";

export const metadata: Metadata = {
  title: "All Medical Procedures",
  description:
    "Browse all medical procedure costs. Compare prices for MRIs, surgeries, office visits, lab tests, and more. 2026 Medicare rates.",
};

function formatPrice(price: number): string {
  return (
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

export default function ProceduresPage() {
  const popular = getPopularProcedures();
  const categories = getCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Medical Procedure Costs
        </h1>
        <p className="text-gray-500 text-lg">
          National average Medicare rates (2026). Click any procedure for
          ZIP-level pricing.
        </p>
      </div>

      {/* Quick jump */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const procs = popular.filter((p) => cat.codes.includes(p.code));
          if (procs.length === 0) return null;
          return (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
            </a>
          );
        })}
      </div>

      {/* Category sections */}
      {categories.map((cat) => {
        const procs = popular.filter((p) => cat.codes.includes(p.code));
        if (procs.length === 0) return null;

        return (
          <section key={cat.slug} id={cat.slug} className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
              <span className="text-2xl">{cat.icon}</span> {cat.name}
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                      Procedure
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                      CPT Code
                    </th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                      Office
                    </th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                      Hospital
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procs.map((proc) => (
                    <tr
                      key={proc.code}
                      className="border-t border-gray-50 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/procedure/${proc.code}`}
                          className="text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors"
                        >
                          {proc.friendlyName}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400 hidden md:table-cell">
                        {proc.code}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-gray-900">
                        {formatPrice(proc.nationalNonFacPrice)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-500 hidden sm:table-cell">
                        {formatPrice(proc.nationalFacPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
