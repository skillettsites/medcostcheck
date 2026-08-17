import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how MedCostCheck works. Free medical procedure cost lookup powered by the 2026 Medicare Physician Fee Schedule from the Centers for Medicare & Medicaid Services.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        About MedCostCheck
      </h1>
      <p className="text-gray-500 mb-10">
        Free medical procedure cost estimates for every US ZIP code.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">7,500+</p>
          <p className="text-sm text-blue-600 mt-1">Searchable CPT codes</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">43,000+</p>
          <p className="text-sm text-blue-600 mt-1">ZIP codes</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">112</p>
          <p className="text-sm text-blue-600 mt-1">Pricing localities</p>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            What is MedCostCheck?
          </h2>
          <p>
            MedCostCheck is a free, independent cost-lookup tool. Search by
            procedure name or CPT code, optionally add a ZIP, and see the 2026
            Medicare <em>physician</em> allowed amount for that locality. About
            7,500 payable codes are in the search tool. We publish featured
            pages for 59 commonly searched procedures (and state pages for
            those same procedures). The rest are meant to be looked up, not
            turned into thousands of near-duplicate articles. All prices come
            from the 2026 Medicare Physician Fee Schedule published by CMS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Our Data Source
          </h2>
          <p>
            All pricing is derived from the{" "}
            <strong>2026 Medicare Physician Fee Schedule</strong>, the most
            comprehensive standardized source of medical procedure pricing
            available to the public. CMS publishes this data annually. You can
            access the original data at{" "}
            <a
              href="https://www.cms.gov/medicare/payment/fee-schedules/physician"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              cms.gov
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            How Pricing Works
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="mb-3">
              Medicare calculates costs using{" "}
              <strong>Relative Value Units (RVUs)</strong> adjusted by{" "}
              <strong>Geographic Practice Cost Indices (GPCIs)</strong>:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-center mb-3">
              Payment = [(Work RVU x Work GPCI) + (PE RVU x PE GPCI) + (MP RVU
              x MP GPCI)] x $33.4009
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-800">Work RVU</p>
                <p className="text-blue-600 mt-1">
                  Physician time, skill, and effort
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-800">Practice Expense</p>
                <p className="text-blue-600 mt-1">
                  Rent, equipment, supplies, staff
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-800">Malpractice</p>
                <p className="text-blue-600 mt-1">
                  Professional liability insurance
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Understanding the Estimates
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Price Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">How It Compares to Medicare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Medicare Rate</td>
                  <td className="px-4 py-3 text-gray-600">Baseline. What Medicare pays providers.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Private Insurance</td>
                  <td className="px-4 py-3 text-gray-600">130-200% of Medicare, depending on plan and network.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Self-Pay / Cash</td>
                  <td className="px-4 py-3 text-gray-600">Varies widely. Many providers offer 20-40% cash discounts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Hospital Chargemaster</td>
                  <td className="px-4 py-3 text-gray-600">Often 300-500%+ of Medicare. Rarely what anyone actually pays.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Important Limitations
            </h3>
            <ul className="space-y-2 text-amber-800">
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">*</span>
                <span>
                  <strong>Medicare rates are a baseline, not a final price.</strong>{" "}
                  They represent what Medicare reimburses, not what you will pay.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">*</span>
                <span>
                  <strong>Office vs Hospital matters.</strong> The same procedure
                  often costs less in a doctor&apos;s office than in a hospital,
                  because hospitals charge a separate facility fee.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">*</span>
                <span>
                  <strong>Always verify with your provider</strong> and insurance
                  company before any procedure.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Who publishes MedCostCheck
          </h2>
          <p className="mb-3">
            MedCostCheck is an independent, reader-supported website. It is
            not a medical practice, hospital, insurer, or government agency,
            and it is not owned by any of those. No provider can pay to change
            a price. We are not clinicians and do not give medical advice.
            There is no separate legal-entity name or street address published
            here; the public contact for the site is{" "}
            <a
              href="mailto:contact@medcostcheck.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              contact@medcostcheck.com
            </a>
            .
          </p>
          <p className="mb-3">
            Estimates are computed from the public CMS files listed above,
            using the published Medicare payment formula, and refreshed when
            CMS releases fee schedule updates.
          </p>
          <p className="mb-3">
            Alongside the pricing tool, we publish plain-English{" "}
            <Link href="/guides" className="text-blue-600 hover:text-blue-800 underline">
              guides to medical billing and costs
            </Link>{" "}
            covering topics like reading an EOB, negotiating a bill, facility
            fees, and the No Surprises Act. These are general education, not
            medical, legal, or financial advice.
          </p>
          <p>
            <strong>Corrections:</strong> if you spot a price, code, or
            description that looks wrong,{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              contact us
            </Link>{" "}
            with the page URL and CPT code. We verify reports against the
            original CMS files and correct confirmed errors on the live site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
          <p>
            Questions or feedback? Email us at{" "}
            <a
              href="mailto:contact@medcostcheck.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              contact@medcostcheck.com
            </a>
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Look up a procedure cost</h2>
        <p className="text-blue-100 mb-4">
          Search 7,500+ CPT codes. Featured pages cover the procedures people look up most.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors"
        >
          Search Procedures
        </Link>
      </div>
    </div>
  );
}
