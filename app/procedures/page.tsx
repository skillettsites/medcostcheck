import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import Link from "next/link";
import {
  getPopularProcedures,
  getCategories,
} from "@/lib/medicare";
import ProcedureSearch from "@/components/ProcedureSearch";
import SearchPanel from "@/components/SearchPanel";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Featured Medical Procedure Costs",
  description:
    "59 featured 2026 Medicare physician-rate pages. Search 7,500+ CPT codes by name or code. ZIP lookup for locality pricing.",
  alternates: { canonical: "/procedures" },
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
    <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
      <JsonLd
        data={[
          collectionPageSchema({
            name: "Featured Medical Procedure Costs",
            description:
              "Every featured procedure with its 2026 Medicare physician rate and full episode cost.",
            url: "/procedures",
            itemCount: popular.length,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Procedures", url: "/procedures" },
          ]),
        ]}
      />
      <div className="mb-10">
        <h1 className="page-title mb-3">
          Featured procedure costs
        </h1>
        <p className="lede max-w-3xl">
          {popular.length} dedicated pages with national Medicare physician
          rates (2026). The fee schedule has 7,500+ payable codes — search
          those here; we do not publish a thin page for every code.
        </p>
      </div>

      <SearchPanel
        title="Search any CPT or name"
        subtitle="Add a ZIP for a locality rate, or skip it for the national figure."
      >
        <ProcedureSearch />
      </SearchPanel>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const procs = popular.filter((p) => cat.codes.includes(p.code));
          if (procs.length === 0) return null;
          return (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="chip"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
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
            <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span> {cat.name}
            </h2>
            <div className="surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/[0.02] border-b border-[var(--hairline)]">
                  <tr>
                    <th className="text-left px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">
                      Procedure
                    </th>
                    <th className="text-left px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide hidden md:table-cell">
                      CPT Code
                    </th>
                    <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide">
                      Office
                    </th>
                    <th className="text-right px-3 py-3 sm:px-5 font-medium text-faint text-xs uppercase tracking-wide hidden sm:table-cell">
                      Hospital
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procs.map((proc) => (
                    <tr
                      key={proc.code}
                      className="border-t border-[var(--hairline)] hover:bg-black/[0.02] transition-colors"
                    >
                      <td className="px-3 py-3 sm:px-5">
                        <Link
                          href={`/procedure/${proc.code}`}
                          className="text-ink font-medium hover:text-accent transition-colors"
                        >
                          {proc.friendlyName}
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-5 font-mono text-xs text-faint hidden md:table-cell">
                        {proc.code}
                      </td>
                      <td className="px-3 py-3 sm:px-5 text-right font-medium text-ink">
                        {formatPrice(proc.nationalNonFacPrice)}
                      </td>
                      <td className="px-3 py-3 sm:px-5 text-right text-muted hidden sm:table-cell">
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
