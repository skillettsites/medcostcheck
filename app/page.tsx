import type { Metadata } from "next";
import ProcedureSearch from "@/components/ProcedureSearch";
import FaqList from "@/components/FaqList";
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
      <section className="relative z-20 px-5 pt-14 pb-8 sm:pt-24 sm:pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow anim-rise">2026 Medicare Physician Fee Schedule</p>
          <h1 className="display mt-4 anim-rise d1">
            Look up what a procedure costs.
          </h1>
          <p className="lede mt-5 max-w-xl mx-auto anim-rise d2">
            Search 7,500+ CPT codes. Add a ZIP for the locality rate. Featured
            pages cover the procedures people actually look up.
          </p>
        </div>
        <div className="search-shell max-w-xl mx-auto mt-10">
          <div className="panel">
            <ProcedureSearch />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-faint anim-rise d4">
          7,500+ codes · 43,000 ZIP codes · 59 featured pages
        </p>
      </section>

      <section className="px-5 py-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-muted">
          <span>Official CMS public data</span>
          <span>Physician fee only</span>
          <span>No signup</span>
          <span>Not medical advice</span>
        </div>
      </section>

      <section className="px-5 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="page-title">How the lookup works</h2>
            <p className="lede mt-3 max-w-md mx-auto">
              The same formula CMS uses to pay physicians, applied to your ZIP.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "Enter a ZIP, or skip it",
                desc: "A ZIP maps to one of 112 Medicare pricing localities. Skip it to see the national unadjusted rate; add it to apply GPCI geographic adjustments.",
              },
              {
                step: "02",
                title: "Search a name or CPT",
                desc: "Type echocardiogram, 93306, or knee replacement. Featured pages below are a curated subset, not the whole schedule.",
              },
              {
                step: "03",
                title: "Read the physician rate",
                desc: "You get the Medicare allowed amount for the professional fee, office vs hospital, and labeled insurance/cash ranges. Facility fees and anesthesia are separate.",
              },
            ].map((item) => (
              <div key={item.step} className="surface p-7 sm:p-8">
                <p className="text-[13px] font-medium text-faint tabular-nums mb-6">{item.step}</p>
                <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="page-title">Featured categories</h2>
            <p className="lede mt-3">
              Jump to the curated list, or search above for any other CPT.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/procedures#${cat.slug}`}
                className="surface lift p-4 sm:p-6 text-center"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold text-sm tracking-tight text-ink">{cat.name}</h3>
                <p className="text-faint text-xs mt-1">{cat.codes.length} featured</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="page-title">Featured procedure pages</h2>
            <p className="lede mt-3 max-w-xl mx-auto">
              National average Medicare physician rates. Open a page and enter a
              ZIP for the locality rate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topProcedures.map((proc) => (
              <Link
                key={proc.code}
                href={`/procedure/${proc.code}`}
                className="surface lift p-5"
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="font-semibold tracking-tight text-ink">
                    {proc.friendlyName}
                  </h3>
                  <span className="text-[11px] font-mono text-faint bg-canvas px-2 py-0.5 rounded-md shrink-0">
                    {proc.code}
                  </span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-faint text-[11px] uppercase tracking-wide">Office</span>
                    <p className="font-semibold text-ink text-lg tracking-tight">
                      {formatPriceRound(proc.nationalNonFacPrice)}
                    </p>
                  </div>
                  {proc.nationalFacPrice !== proc.nationalNonFacPrice && (
                    <div>
                      <span className="text-faint text-[11px] uppercase tracking-wide">Hospital</span>
                      <p className="font-semibold text-muted text-lg tracking-tight">
                        {formatPriceRound(proc.nationalFacPrice)}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/procedures" className="btn btn-ghost">
              All {popular.length} featured procedures
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="page-title">Billing guides</h2>
            <p className="lede mt-3 max-w-md mx-auto">
              How US medical bills actually work — written to explain the numbers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getAllGuides()
              .slice(0, 6)
              .map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="surface lift p-5">
                  <h3 className="font-semibold tracking-tight text-ink mb-2">{g.title}</h3>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                    {g.description}
                  </p>
                  <span className="text-xs text-faint">{g.readingTime}</span>
                </Link>
              ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/guides" className="btn btn-ghost">
              All guides
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:pb-28">
        <div className="max-w-2xl mx-auto">
          <h2 className="page-title text-center mb-8">Before you search</h2>
          <FaqList
            items={[
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
            ]}
          />
        </div>
      </section>

      <section className="px-5 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="cta-band">
            <h2>Independent cost tool. CMS data.</h2>
            <p>
              Not a hospital, insurer, or medical practice. Corrections:{" "}
              <a href="mailto:contact@medcostcheck.com" className="underline decoration-white/30 underline-offset-4">
                contact@medcostcheck.com
              </a>
            </p>
            <Link href="/about" className="btn btn-light">
              How the numbers are calculated
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
