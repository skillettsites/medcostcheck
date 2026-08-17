import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact MedCostCheck with questions, corrections, or feedback about our medical procedure cost data. We respond to every message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10">
        MedCostCheck is an independent cost-lookup tool, not a medical
        practice or insurer. Questions, corrections, or feedback go to one
        inbox. We read every message.
      </p>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            General enquiries
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            For questions about the site, how estimates are calculated, or
            anything else, email{" "}
            <a href="mailto:contact@medcostcheck.com" className="text-blue-600 font-medium">
              contact@medcostcheck.com
            </a>
            . We usually reply within two business days. We do not publish a
            street address.
          </p>
          <a
            href="mailto:contact@medcostcheck.com"
            className="inline-block bg-blue-600 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-blue-700 transition-colors"
          >
            contact@medcostcheck.com
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Report a data error
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our pricing comes directly from the 2026 Medicare Physician Fee
            Schedule published by CMS, but mistakes can happen in processing or
            presentation. If a price, procedure description, or locality looks
            wrong, email us with the page URL and the CPT code and we will
            investigate and correct it. Corrections are applied to the live site
            as soon as they are verified.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Press and partnerships
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Journalists and researchers are welcome to cite our data with
            attribution to MedCostCheck and CMS. For partnership or licensing
            questions, use the same email address with &quot;Partnership&quot;
            in the subject line.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">
            A note on medical questions
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            MedCostCheck provides cost and billing information only. We cannot
            answer questions about diagnoses, treatment decisions, or whether a
            procedure is right for you. Please speak with your doctor or, for
            insurance coverage questions, call the number on the back of your
            insurance card.
          </p>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        You can also learn more about our data and methodology on the{" "}
        <Link href="/about" className="text-blue-600 hover:text-blue-800 font-medium">
          About page
        </Link>
        .
      </div>
    </div>
  );
}
