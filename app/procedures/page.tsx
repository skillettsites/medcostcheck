import { Metadata } from "next";
import Link from "next/link";
import {
  getPopularProcedures,
  getCategories,
  CONVERSION_FACTOR,
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Medical Procedure Costs</h1>
      <p className="text-gray-600 mb-10">
        National average Medicare rates (2026). Click any procedure for
        ZIP-level pricing.
      </p>

      {categories.map((cat) => {
        const procs = popular.filter((p) => cat.codes.includes(p.code));
        if (procs.length === 0) return null;

        return (
          <section key={cat.slug} id={cat.slug} className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{cat.icon}</span> {cat.name}
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Procedure
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                      CPT Code
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      Office
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                      Hospital
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procs.map((proc) => (
                    <tr
                      key={proc.code}
                      className="border-t border-gray-100 hover:bg-blue-50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/procedure/${proc.code}`}
                          className="text-blue-700 hover:underline font-medium"
                        >
                          {proc.friendlyName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500 hidden md:table-cell">
                        {proc.code}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatPrice(proc.nationalNonFacPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 hidden sm:table-cell">
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
