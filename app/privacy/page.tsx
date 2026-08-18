import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MedCostCheck privacy policy: what we collect, how analytics and advertising cookies work on this site, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: August 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            MedCostCheck is a free medical cost information site. You can use
            every feature without creating an account or telling us who you
            are. This policy explains the limited data that is collected when
            you visit, who collects it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            What We Do Not Collect
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Free lookups do not require an account. We do not ask for medical
            records, insurance cards, or names on the lookup pages. Procedure
            searches and ZIP codes used on the public site are not linked to
            your identity by us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Paid reports
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you buy a Cost Report, Stripe collects your email and payment
            details to process the charge. We store the Stripe session id, the
            CPT code, the ZIP you entered, the report JSON, and the email so we
            can send you the link and show the report at /r/{"{token}"}. We do
            not store names of patients, insurance IDs, or medical records.
            Report pages are noindex. You can email contact@medcostcheck.com to
            ask us to delete a stored report.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Analytics
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use Google Analytics and Vercel Analytics to understand, in
            aggregate, which pages are visited and how the site performs.
            These services may use cookies or similar technologies and collect
            information such as your approximate location (city level), device
            type, browser, and the pages you view. We use this data only to
            improve the site. You can block analytics cookies in your browser
            settings or with the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Google Analytics opt-out browser add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Advertising (Google AdSense)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            This site uses Google AdSense to display advertising, which keeps
            the cost lookup tool free. Google and its partners are third-party
            vendors that use cookies to serve ads based on your prior visits
            to this website and other websites.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
            <li>
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visits to this site
              and other sites on the Internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Google Ads Settings
              </a>
              . You can also opt out of many third-party vendors&apos; use of
              cookies for personalized advertising at{" "}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                www.aboutads.info
              </a>
              .
            </li>
            <li>
              Where required by law, visitors are shown a consent message and
              can decline personalized advertising; ads shown after declining
              are non-personalized.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Affiliate Links
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Some outbound links on this site are affiliate links, meaning we
            may earn a commission if you click through and sign up or make a
            purchase, at no extra cost to you. Affiliate partners may use
            their own cookies to attribute that visit. Affiliate relationships
            never change the prices we display, which come solely from public
            CMS data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Data Sources
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All cost data displayed on MedCostCheck comes from publicly
            available government sources, specifically the 2026 Medicare
            Physician Fee Schedule published by the Centers for Medicare &amp;
            Medicaid Services (CMS). No private or proprietary patient data is
            used anywhere on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Hosting and Server Logs
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This site is hosted on Vercel. Vercel may collect standard server
            logs (such as IP addresses and request timestamps) as part of
            normal web hosting operations. You can review{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Vercel&apos;s privacy policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Your Choices
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
            <li>Use the site without providing any personal information (always the case).</li>
            <li>Block or delete cookies through your browser settings.</li>
            <li>Opt out of personalized ads via the Google and aboutads.info links above.</li>
            <li>Use the consent controls shown on your first visit where applicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If our data practices change, this policy will be updated and the
            date at the top revised. Significant changes will be clearly noted
            on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">
            Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this privacy policy, you can reach us
            via the{" "}
            <Link href="/contact" className="link">
              contact page
            </Link>{" "}
            or at{" "}
            <a
              href="mailto:contact@medcostcheck.com"
              className="link"
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
