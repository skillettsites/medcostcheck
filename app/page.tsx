import ProcedureSearch from "@/components/ProcedureSearch";
import Link from "next/link";
import { getPopularProcedures, getCategories } from "@/lib/medicare";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function HomePage() {
  const popular = getPopularProcedures();
  const categories = getCategories();

  // Show top 12 popular procedures on homepage
  const topProcedures = popular.slice(0, 12);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Much Does It Cost?
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Look up the cost of any medical procedure by ZIP code. Free,
            instant, powered by 2026 Medicare data.
          </p>
          <ProcedureSearch />
          <p className="text-blue-200 text-sm mt-4">
            7,500+ procedures. 43,000 ZIP codes. Updated for 2026.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-700 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold mb-2">Search a procedure</h3>
            <p className="text-gray-600 text-sm">
              Type the name of any medical procedure, test, or office visit.
              We cover over 7,500 CPT codes.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-700 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold mb-2">Enter your ZIP code</h3>
            <p className="text-gray-600 text-sm">
              Medical costs vary significantly by location. Your ZIP code
              determines local pricing adjustments.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-700 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold mb-2">See your cost estimate</h3>
            <p className="text-gray-600 text-sm">
              Get Medicare rates, estimated private insurance costs, and
              self-pay estimates for your area.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/procedures?category=${cat.slug}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <p className="text-gray-500 text-xs mt-1">
                  {cat.codes.length} procedures
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular procedures */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          Popular Procedures
        </h2>
        <p className="text-gray-600 text-center mb-10">
          National average Medicare rates (2026). Enter a ZIP code for local pricing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProcedures.map((proc) => (
            <Link
              key={proc.code}
              href={`/procedure/${proc.code}`}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {proc.friendlyName}
                </h3>
                <span className="text-xs font-mono text-gray-400 ml-2">
                  {proc.code}
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Office: </span>
                  <span className="font-semibold text-blue-700">
                    {formatPrice(proc.nationalNonFacPrice)}
                  </span>
                </div>
                {proc.nationalFacPrice !== proc.nationalNonFacPrice && (
                  <div>
                    <span className="text-gray-500">Hospital: </span>
                    <span className="font-semibold text-blue-700">
                      {formatPrice(proc.nationalFacPrice)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/procedures"
            className="inline-block px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            View All 7,500+ Procedures
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Where does this pricing data come from?
              </h3>
              <p className="text-gray-600">
                All prices are based on the 2026 Medicare Physician Fee
                Schedule published by the Centers for Medicare & Medicaid
                Services (CMS). This is the same data used by hospitals and
                doctors to set their rates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Why do prices vary by ZIP code?
              </h3>
              <p className="text-gray-600">
                Medicare adjusts payments based on local cost of living using
                Geographic Practice Cost Indices (GPCIs). Areas with higher
                labor costs, office rents, and malpractice insurance premiums
                have higher procedure prices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Are these the actual prices I will pay?
              </h3>
              <p className="text-gray-600">
                These are Medicare reimbursement rates, which serve as a
                baseline. Private insurance typically pays 130-200% of
                Medicare rates, while self-pay/cash prices can vary widely.
                Always verify costs with your provider and insurance company
                before any procedure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                What is the difference between office and hospital pricing?
              </h3>
              <p className="text-gray-600">
                &ldquo;Office&rdquo; (non-facility) pricing applies when a procedure
                is done in a doctor&rsquo;s office or clinic. &ldquo;Hospital&rdquo; (facility)
                pricing applies when done in a hospital or ambulatory surgical
                center. Hospital pricing is often lower for the physician fee
                because the facility charges a separate fee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
