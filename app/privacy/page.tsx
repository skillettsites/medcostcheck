import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MedCostCheck privacy policy. We do not collect personal data, use cookies, or track users. All lookups are anonymous.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            MedCostCheck is committed to protecting your privacy. This site is
            designed to be as simple and transparent as possible. We do not
            collect, store, or sell any personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            No Personal Data Collection
          </h2>
          <p className="text-gray-700 leading-relaxed">
            MedCostCheck does not collect any personally identifiable
            information. There are no user accounts, no sign-up forms, and no
            login systems. You can use the site without providing any personal
            details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            No Cookies or Tracking
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This site does not use cookies, analytics trackers, or any third-party
            tracking scripts. Your browsing activity on MedCostCheck is not
            monitored or recorded.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Anonymous Lookups
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All procedure cost lookups are completely anonymous. We do not log
            which procedures you search for, which ZIP codes you enter, or how
            often you visit the site. No search history is stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Data Sources
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All cost data displayed on MedCostCheck comes from publicly available
            government sources, specifically the 2026 Medicare Physician Fee
            Schedule published by the Centers for Medicare & Medicaid Services
            (CMS). No private or proprietary data is used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Hosting
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This site is hosted on Vercel. Vercel may collect standard server
            logs (such as IP addresses and request timestamps) as part of normal
            web hosting operations. This is standard infrastructure logging and
            is not controlled or accessed by MedCostCheck. You can review{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Vercel&apos;s privacy policy
            </a>{" "}
            for more details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If we add any data collection, analytics, or tracking features in
            the future, this policy will be updated accordingly. Any significant
            changes will be clearly noted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this privacy policy, you can reach us at{" "}
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
