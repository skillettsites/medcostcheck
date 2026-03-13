import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how MedCostCheck works. Free medical procedure cost lookup powered by the 2026 Medicare Physician Fee Schedule from the Centers for Medicare & Medicaid Services.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        About MedCostCheck
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          What is MedCostCheck?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          MedCostCheck is a free tool that lets you look up the estimated cost of
          medical procedures by ZIP code. Whether you need an MRI, a blood test,
          or an office visit, you can search by procedure name or CPT code and
          see what Medicare pays in your area. All cost data comes from the 2026
          Medicare Physician Fee Schedule published by the Centers for Medicare &
          Medicaid Services (CMS).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Our Data Source
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All pricing information on this site is derived from the{" "}
          <strong>2026 Medicare Physician Fee Schedule</strong>, a public dataset
          maintained by the Centers for Medicare & Medicaid Services (CMS). This
          dataset covers over <strong>7,500 medical procedures</strong> across{" "}
          <strong>43,000 ZIP codes</strong> in the United States.
        </p>
        <p className="text-gray-700 leading-relaxed">
          CMS publishes this data annually. It is the most comprehensive,
          standardized source of medical procedure pricing available to the
          public. You can access the original data at{" "}
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

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          How Pricing Works
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Medicare calculates procedure costs using a system called{" "}
          <strong>Relative Value Units (RVUs)</strong>. Each procedure is
          assigned an RVU that reflects the work involved, the practice expenses,
          and the malpractice risk. These RVU components are then adjusted by{" "}
          <strong>Geographic Practice Cost Indices (GPCIs)</strong>, which
          account for cost-of-living differences across 112 Medicare localities
          in the US.
        </p>
        <p className="text-gray-700 leading-relaxed">
          The adjusted RVUs are multiplied by a national conversion factor
          (a dollar amount set by CMS each year) to produce the final Medicare
          payment rate. This is why the same procedure can cost different amounts
          depending on your location.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Important Limitations
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">*</span>
              <span>
                <strong>Medicare rates are a baseline, not a final price.</strong>{" "}
                The amounts shown represent what Medicare reimburses providers.
                They are not necessarily what you will pay out of pocket.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">*</span>
              <span>
                <strong>Private insurance typically pays more.</strong> Most
                commercial insurers pay between 130% and 200% of Medicare rates,
                depending on the plan and provider network.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">*</span>
              <span>
                <strong>Self-pay prices vary widely.</strong> If you are
                uninsured, the cash price charged by a hospital or clinic may be
                significantly higher or lower than the Medicare rate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">*</span>
              <span>
                <strong>Always verify with your provider.</strong> Use
                MedCostCheck as a starting point for understanding costs, then
                confirm pricing directly with your healthcare provider and
                insurance company.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
