import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "MedCostCheck terms of use. Cost estimates are for reference only and should not be treated as medical or financial advice.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By using MedCostCheck, you agree to these terms of use. If you do
            not agree with any part of these terms, please do not use this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Information Only
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All information on MedCostCheck is provided for general reference
            purposes only. It is <strong>not medical advice</strong>,{" "}
            <strong>not financial advice</strong>, and should not be used as a
            substitute for professional guidance. Always consult with a qualified
            healthcare provider or financial advisor for decisions related to
            your health or finances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Cost Estimates
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The prices displayed on this site are estimates based on the 2026
            Medicare Physician Fee Schedule published by the Centers for Medicare
            & Medicaid Services (CMS). These figures represent Medicare
            reimbursement rates and should be understood as a baseline reference
            point.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Actual costs will vary.</strong> The price you pay for a
              medical procedure depends on many factors, including your insurance
              plan, whether the provider is in-network, your deductible and
              copay structure, the facility type (hospital vs. outpatient), and
              any additional services performed. Always verify costs directly
              with your healthcare provider and insurance company before
              scheduling a procedure.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            No Guarantee of Accuracy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            While we make every effort to present accurate and up-to-date
            information, MedCostCheck does not guarantee the accuracy,
            completeness, or reliability of any data on this site. Medicare fee
            schedules are updated periodically by CMS, and there may be
            discrepancies between the data shown here and the most current
            published rates. Errors in data processing are also possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Use at Your Own Risk
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You use MedCostCheck entirely at your own risk. We are not
            responsible for any decisions you make based on the information
            provided on this site. This includes, but is not limited to,
            decisions about medical treatment, insurance coverage, or financial
            planning related to healthcare costs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, MedCostCheck and its
            operators shall not be held liable for any damages arising from the
            use of, or inability to use, this site or the information it
            contains. This includes direct, indirect, incidental, and
            consequential damages of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Third-Party Links
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This site may contain links to external websites. MedCostCheck is
            not responsible for the content, privacy practices, or availability
            of any third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Changes to These Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these terms from time to time. Continued use of the
            site after changes are posted constitutes acceptance of the revised
            terms. We recommend reviewing this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about these terms, you can reach us at{" "}
            <a
              href="mailto:contact@medcostcheck.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact@medcostcheck.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
