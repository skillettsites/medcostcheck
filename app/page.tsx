import type { Metadata } from "next";
import ProcedureSearch from "@/components/ProcedureSearch";
import Link from "next/link";
import { getPopularProcedures, getCategories } from "@/lib/medicare";
import { getAllGuides } from "@/lib/guides";
import { formatPriceRound } from "@/lib/format";

export const metadata: Metadata = {
  title: "How Much Does an MRI or Surgery Cost Near You?",
  description:
    "Look up 2026 Medicare physician rates by ZIP code or CPT code. Search 7,500+ codes. Free MRI, surgery, office visit, and lab estimates from the 2026 fee schedule.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "How Much Does an MRI or Surgery Cost Near You?",
    description:
      "Free medical procedure cost lookup by ZIP code. MRI, surgery, office visit, and lab estimates from official 2026 Medicare data.",
    url: "https://www.medcostcheck.com/",
    type: "website",
  },
};

export default function HomePage() {
  const popular = getPopularProcedures();
  const categories = getCategories();
  const topProcedures = popular.slice(0, 12);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            2026 Medicare Physician Fee Schedule
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Look up a procedure cost
            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mt-1">
              by ZIP code or CPT code
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
            Free Medicare physician-rate lookup. Search 7,500+ CPT codes from
            the official fee schedule. We publish featured pages for the
            procedures people actually look up — the rest live in the search
            tool, not as thousands of extra pages.
          </p>

          <ProcedureSearch />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-blue-200/70">
            <span>7,500+ searchable CPT codes</span>
            <span>43,000 ZIP codes → 112 localities</span>
            <span>59 featured procedure pages</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
            <span>Official CMS public data</span>
            <span>Physician fee only — not a hospital bill</span>
            <span>No signup</span>
            <span>Not medical advice</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            How the lookup works
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            The same formula CMS uses to pay physicians, applied to your ZIP
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Enter a ZIP (or skip it)",
              desc: "A ZIP maps to one of 112 Medicare pricing localities. Skip it to see the national unadjusted rate; add it to apply GPCI geographic adjustments.",
            },
            {
              step: "2",
              title: "Search a name or CPT code",
              desc: "Type echocardiogram, 93306, or knee replacement. The tool searches the 2026 fee schedule. Featured pages below are a curated subset, not the whole schedule.",
            },
            {
              step: "3",
              title: "Read the physician rate",
              desc: "You get the Medicare allowed amount for the professional fee, office vs hospital, and labeled insurance/cash ranges. Facility fees and anesthesia are separate.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 mt-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50/80 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Featured categories
            </h2>
            <p className="text-gray-500">
              Jump to the curated procedure list. Use search above for any
              other CPT code.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/procedures#${cat.slug}`}
                className="group bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-100"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {cat.codes.length} featured
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Featured procedure pages
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            National average Medicare physician rates (2026). Open a page and
            enter a ZIP for the locality rate. These {popular.length} pages are
            the browseable set — not 7,500 individual articles.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProcedures.map((proc) => (
            <Link
              key={proc.code}
              href={`/procedure/${proc.code}`}
              className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {proc.friendlyName}
                </h3>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded ml-2 shrink-0">
                  {proc.code}
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs">Office</span>
                  <p className="font-bold text-blue-700 text-lg">
                    {formatPriceRound(proc.nationalNonFacPrice)}
                  </p>
                </div>
                {proc.nationalFacPrice !== proc.nationalNonFacPrice && (
                  <div>
                    <span className="text-gray-400 text-xs">Hospital</span>
                    <p className="font-semibold text-gray-600 text-lg">
                      {formatPriceRound(proc.nationalFacPrice)}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/procedures"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold"
          >
            All {popular.length} featured procedures
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Billing guides
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              How US medical bills actually work — written to explain the
              numbers, not to multiply pages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAllGuides()
              .slice(0, 6)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                    {g.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {g.description}
                  </p>
                  <span className="text-xs text-gray-400">{g.readingTime}</span>
                </Link>
              ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold"
            >
              All guides
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/80 py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              What you should know before you search
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Where do the prices come from?",
                a: "The 2026 Medicare Physician Fee Schedule published by CMS. Payment = [(Work RVU × work GPCI) + (PE RVU × PE GPCI) + (MP RVU × MP GPCI)] × $33.4009. We do not invent or crowdsource prices.",
              },
              {
                q: "Can I look up any CPT code?",
                a: "Yes, in the search box — by code or name. About 7,500 payable physician codes are in the tool. Dedicated pages exist for 59 commonly searched procedures, plus state pages for those same procedures. That is the browseable set on purpose.",
              },
              {
                q: "Is this what I will pay?",
                a: "No. These are Medicare physician allowed amounts. Private plans often allow more; hospitals add facility fees; your deductible and coinsurance still apply. Use the number as a public benchmark, then confirm with the provider and insurer.",
              },
              {
                q: "Why do office and hospital rates differ?",
                a: "Medicare pays a different practice-expense RVU when the service is in a facility. The hospital then bills its own facility fee, which this tool does not include. The physician line is often lower in a hospital; the total bill is often higher.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-3">
            Independent cost tool, CMS data
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Not a hospital, insurer, or medical practice. Corrections:{" "}
            <a href="mailto:contact@medcostcheck.com" className="underline font-semibold">
              contact@medcostcheck.com
            </a>
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold rounded-xl px-8 py-3.5 hover:bg-blue-50 transition-colors"
          >
            How the numbers are calculated
          </Link>
        </div>
      </section>
    </>
  );
}
