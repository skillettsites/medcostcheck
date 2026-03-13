import ProcedureSearch from "@/components/ProcedureSearch";
import Link from "next/link";
import { getPopularProcedures, getCategories } from "@/lib/medicare";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function HomePage() {
  const popular = getPopularProcedures();
  const categories = getCategories();
  const topProcedures = popular.slice(0, 12);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Updated for 2026 Medicare rates
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
            How much does your<br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              procedure cost?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-xl mx-auto">
            Look up the cost of 7,500+ medical procedures by ZIP code.
            Free, transparent, powered by official Medicare data.
          </p>

          <ProcedureSearch />

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-blue-200/70">
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-400/80"><path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.354-8.354a.5.5 0 00-.708-.708L7.5 9.086 5.854 7.44a.5.5 0 10-.708.708l2.15 2.15a.5.5 0 00.708 0l3.35-3.35z" clipRule="evenodd"/></svg>
              7,500+ procedures
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-400/80"><path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.354-8.354a.5.5 0 00-.708-.708L7.5 9.086 5.854 7.44a.5.5 0 10-.708.708l2.15 2.15a.5.5 0 00.708 0l3.35-3.35z" clipRule="evenodd"/></svg>
              43,000 ZIP codes
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-400/80"><path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.354-8.354a.5.5 0 00-.708-.708L7.5 9.086 5.854 7.44a.5.5 0 10-.708.708l2.15 2.15a.5.5 0 00.708 0l3.35-3.35z" clipRule="evenodd"/></svg>
              100% free
            </span>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Official CMS data
            </span>
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              112 pricing localities
            </span>
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Updated annually
            </span>
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              No signup required
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Three steps to transparent medical pricing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Enter your ZIP code",
              desc: "Medical costs vary by location. Your ZIP code determines local pricing adjustments based on cost of living.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ),
            },
            {
              step: "2",
              title: "Search a procedure",
              desc: "Type the name of any procedure, test, or visit. We cover over 7,500 CPT codes from the Medicare Fee Schedule.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              ),
            },
            {
              step: "3",
              title: "See your cost estimate",
              desc: "Get Medicare rates, private insurance estimates, and self-pay pricing, all adjusted for your specific area.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                {item.step}
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 mt-2">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50/80 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500">
              Find pricing for common medical procedures by specialty
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/procedures?category=${cat.slug}`}
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-100"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {cat.codes.length} procedures
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular procedures */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Popular Procedures
          </h2>
          <p className="text-gray-500">
            National average Medicare rates (2026). Enter a ZIP code for local pricing.
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
                    {formatPrice(proc.nationalNonFacPrice)}
                  </p>
                </div>
                {proc.nationalFacPrice !== proc.nationalNonFacPrice && (
                  <div>
                    <span className="text-gray-400 text-xs">Hospital</span>
                    <p className="font-semibold text-gray-600 text-lg">
                      {formatPrice(proc.nationalFacPrice)}
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
            View All 7,500+ Procedures
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3l5 5-5 5"/></svg>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50/80 py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Where does this pricing data come from?",
                a: "All prices are based on the 2026 Medicare Physician Fee Schedule published by the Centers for Medicare & Medicaid Services (CMS). This is the same data used by hospitals and doctors to set their rates.",
              },
              {
                q: "Why do prices vary by ZIP code?",
                a: "Medicare adjusts payments based on local cost of living using Geographic Practice Cost Indices (GPCIs). Areas with higher labor costs, office rents, and malpractice insurance premiums have higher procedure prices.",
              },
              {
                q: "Are these the actual prices I will pay?",
                a: "These are Medicare reimbursement rates, which serve as a baseline. Private insurance typically pays 130-200% of Medicare rates, while self-pay/cash prices can vary widely. Always verify costs with your provider and insurance company before any procedure.",
              },
              {
                q: "What is the difference between office and hospital pricing?",
                a: "\"Office\" (non-facility) pricing applies when a procedure is done in a doctor's office or clinic. \"Hospital\" (facility) pricing applies when done in a hospital or surgical center. Hospital pricing is often lower for the physician fee because the facility charges a separate fee.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-3">
            Stop overpaying for medical procedures
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Know the fair price before your next appointment. Look up any procedure in seconds.
          </p>
          <Link
            href="/save"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold rounded-xl px-8 py-3.5 hover:bg-blue-50 transition-colors"
          >
            Ways to Save on Medical Costs
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3l5 5-5 5"/></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
