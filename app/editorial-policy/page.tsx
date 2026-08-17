import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How MedCostCheck sources, calculates, reviews, and corrects the pricing data and billing guides on this site, and how advertising is kept separate.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Editorial Policy
      </h1>
      <p className="text-gray-500 mb-10">
        How the information on MedCostCheck is produced, checked, and kept
        honest.
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Where our numbers come from
          </h2>
          <p className="mb-3">
            Every price on this site is computed from the official data files
            of the Medicare Physician Fee Schedule published by the Centers
            for Medicare &amp; Medicaid Services (CMS): the relative value
            unit (RVU) files, the geographic practice cost index (GPCI) files,
            and the ZIP-code-to-locality crosswalk. We apply the published
            Medicare payment formula with the current conversion factor. We do
            not estimate, average, or adjust these figures editorially, and we
            do not accept pricing submissions from providers.
          </p>
          <p>
            Where we show private insurance and self-pay ranges, they are
            clearly labeled as estimates based on widely reported multiples of
            Medicare rates, not as quoted prices. The full methodology is
            explained on our{" "}
            <Link href="/about" className="text-blue-600 hover:text-blue-800 underline">
              About page
            </Link>{" "}
            and in our guide to{" "}
            <Link href="/guides/medicare-vs-private-prices" className="text-blue-600 hover:text-blue-800 underline">
              why Medicare rates are the benchmark
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            How our guides are written
          </h2>
          <p className="mb-3">
            Our billing and cost guides are written and maintained by the
            MedCostCheck team. They explain how United States medical billing,
            insurance, and consumer protection rules work in plain English.
            They are based on public sources: federal rules and statutes (such
            as the No Surprises Act and the hospital price transparency rule),
            CMS documentation, and established consumer billing practice.
          </p>
          <p>
            We do not publish medical advice. Nothing on this site recommends
            a treatment, a diagnosis, or a provider, and our guides tell
            readers to confirm clinical questions with their doctor and
            coverage questions with their insurer. Cost and billing education
            is the entire scope of this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Review and updates
          </h2>
          <p>
            Pricing data is refreshed when CMS publishes fee schedule updates,
            which happens at least annually with revisions during the year.
            Each pricing page states the exact CMS file release it is built
            from. Guides carry a visible &quot;Updated&quot; date and are revised when
            the rules they describe change.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Corrections
          </h2>
          <p>
            When a reader reports an error via the{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              contact page
            </Link>
            , we check the claim against the original CMS files or the primary
            legal source. Confirmed errors are corrected on the live site as
            soon as they are verified. We would rather show less information
            than wrong information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Advertising and affiliate independence
          </h2>
          <p className="mb-3">
            MedCostCheck is free to use and is supported by advertising and a
            small number of affiliate links. Two rules keep that funding
            separate from our content:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Ads are served by third-party networks and are visually distinct
              from our content. Advertisers have no input into any price,
              guide, or page on this site.
            </li>
            <li>
              Affiliate links are disclosed on the pages where they appear.
              Whether a partner pays us has no effect on the data we display,
              which comes only from public CMS files.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Who is behind MedCostCheck
          </h2>
          <p>
            MedCostCheck is an independent cost-lookup site, not a medical
            practice, hospital, or insurer. We are not clinicians. Everything
            we publish can be traced to a public CMS or legal source. The
            public contact is{" "}
            <a
              href="mailto:contact@medcostcheck.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact@medcostcheck.com
            </a>
            . We do not publish a street address.
          </p>
        </section>
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Questions about our process?</h2>
        <p className="text-blue-100 mb-4">
          We read every message and correct verified errors quickly.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
