import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ways to Save on Medical Costs | MedCostCheck",
  description:
    "Practical ways to save money on healthcare. Compare health insurance, find cheaper prescriptions, save on lab tests, and negotiate medical bills. Free tips and trusted services.",
  keywords: [
    "save on medical costs",
    "cheap health insurance",
    "prescription savings",
    "telehealth savings",
    "medical bill negotiation",
    "discount lab tests",
    "dental savings plans",
  ],
};

interface ServiceCardProps {
  name: string;
  url: string;
  description: string;
  savings: string;
  buttonText?: string;
}

function ServiceCard({
  name,
  url,
  description,
  savings,
  buttonText = "Learn More",
}: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-3 flex-1">{description}</p>
      <p className="text-blue-700 font-semibold text-sm mb-4">{savings}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
      >
        {buttonText} &rarr;
      </a>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}

function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
        <svg
          className="w-3 h-3 text-blue-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="text-gray-700">{children}</span>
    </li>
  );
}

export default function SavePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ways to Save on Medical Costs
          </h1>
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Medical bills are the #1 cause of bankruptcy in the United States.
            You do not have to overpay for healthcare.
          </p>
          <p className="text-blue-200 text-sm max-w-xl mx-auto">
            We have gathered the best tools and services to help you save
            hundreds, or even thousands, on medical expenses.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Compare Health Insurance */}
        <section>
          <SectionHeading
            title="Compare Health Insurance"
            subtitle="If you're uninsured, comparing plans could save you thousands per year."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="eHealth Insurance"
              url="https://www.ehealthinsurance.com"
              description="Compare health insurance plans from major carriers side by side. Covers individual, family, Medicare, and small business plans. One of the largest online health insurance marketplaces in the US."
              savings="Save $1,000+ per year by comparing plans"
              buttonText="Compare Plans"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            eHealth lets you compare plans from top carriers in minutes. No
            cost to compare, and licensed agents are available to help.
          </p>
        </section>

        {/* Telehealth / Virtual Visits */}
        <section>
          <SectionHeading
            title="Telehealth and Virtual Visits"
            subtitle="A telehealth visit costs $50-100 vs $200-400 for an in-person visit. Same doctors, lower price."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="Sesame Care"
              url="https://www.sesamecare.com"
              description="Transparent, upfront pricing for doctor visits, labs, imaging, and prescriptions. Book directly with providers at cash-pay rates. No insurance needed, no hidden fees."
              savings="Save 40-60% vs traditional office visits"
              buttonText="Check Prices"
            />
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="PlushCare"
              url="https://www.plushcare.com"
              description="Board-certified doctors available for virtual appointments within 15 minutes. Covers urgent care, mental health, primary care, and prescriptions. $99 per visit without insurance."
              savings="Save $100-300 vs in-person urgent care"
              buttonText="Book a Visit"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Telehealth is ideal for common conditions like colds, UTIs, rashes,
            prescription refills, and mental health consultations.
          </p>
        </section>

        {/* Prescription Savings */}
        <section>
          <SectionHeading
            title="Prescription Savings"
            subtitle="Always check both GoodRx and SingleCare before filling a prescription. Prices vary by pharmacy."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="GoodRx"
              url="https://www.goodrx.com"
              description="Free prescription discount card accepted at over 70,000 pharmacies nationwide. Compare prices across pharmacies and find coupons for your medications. Save up to 80% on prescriptions."
              savings="Average savings: $300+ per year on prescriptions"
              buttonText="Get Free Card"
            />
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="SingleCare"
              url="https://www.singlecare.com"
              description="Free prescription savings card with no membership required. Accepted at 35,000+ pharmacies including CVS, Walgreens, and Walmart. Sometimes cheaper than GoodRx for certain drugs."
              savings="Save up to 80% on prescriptions"
              buttonText="Get Free Card"
            />
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">
              Pro tip: Check both GoodRx and SingleCare for every prescription.
              Prices differ by pharmacy and drug, so the cheaper option changes
              depending on what you need and where you fill it.
            </p>
          </div>
        </section>

        {/* Discount Lab Testing */}
        <section>
          <SectionHeading
            title="Discount Lab Testing"
            subtitle="Lab tests without insurance can cost $100-500 at a hospital vs $20-100 through discount services."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="Ulta Lab Tests"
              url="https://www.ultalabtests.com"
              description="Order your own blood work and lab tests without a doctor's order. Results in 1-2 days from certified labs. Covers metabolic panels, cholesterol, thyroid, STD testing, and more."
              savings="Save 50-80% vs hospital lab pricing"
              buttonText="Browse Tests"
            />
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="Life Line Screening"
              url="https://www.lifelinescreening.com"
              description="Affordable preventive health screenings for stroke, heart disease, and other conditions. Community-based screening events across the US. Packages start at around $149."
              savings="Screenings from $149 vs $1,000+ at hospitals"
              buttonText="Find Screenings"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Ordering your own lab work is legal in most US states. Results are
            delivered securely online and can be shared with your doctor.
          </p>
        </section>

        {/* Dental Savings */}
        <section>
          <SectionHeading
            title="Dental Savings"
            subtitle="Dental discount plans save 10-60% on dental procedures with no waiting periods."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="DentalPlans.com"
              url="https://www.dentalplans.com"
              description="Compare dental discount plans from top providers. Plans start at around $8/month and cover cleanings, fillings, crowns, braces, and more. No annual maximums, no waiting periods, no paperwork."
              savings="Save 10-60% on all dental procedures"
              buttonText="Compare Plans"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Unlike dental insurance, discount plans have no waiting periods, no
            annual maximums, and no claim forms. You pay the discounted rate
            directly at the dentist.
          </p>
        </section>

        {/* Healthcare Sharing */}
        <section>
          <SectionHeading
            title="Healthcare Sharing Plans"
            subtitle="Healthcare sharing plans can cost 40-60% less than traditional insurance."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AFFILIATE: swap URL when approved */}
            <ServiceCard
              name="Medi-Share"
              url="https://www.medishare.com"
              description="A healthcare sharing program where members share each other's medical bills. Monthly costs are significantly lower than traditional insurance. Over 400,000 members and growing."
              savings="Save 40-60% vs traditional health insurance premiums"
              buttonText="Get a Quote"
            />
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Healthcare sharing plans are not
              insurance. They are voluntary programs where members agree to
              share medical expenses. Coverage and eligibility vary, so review
              the guidelines carefully before joining.
            </p>
          </div>
        </section>

        {/* Medical Bill Negotiation Tips */}
        <section>
          <SectionHeading
            title="Medical Bill Negotiation Tips"
            subtitle="You can often reduce a medical bill by 20-50% simply by asking. Here is how."
          />
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
            <ul className="space-y-4">
              <TipItem>
                <strong>Always ask for an itemized bill.</strong> Request a
                detailed breakdown of every charge. Generic bills hide errors
                and inflated fees.
              </TipItem>
              <TipItem>
                <strong>Request the cash or self-pay rate.</strong> Hospitals
                often have a lower rate for patients paying out of pocket.
                This can be 30-60% less than the sticker price.
              </TipItem>
              <TipItem>
                <strong>Ask about financial assistance programs.</strong> Most
                hospitals are required to offer charity care or sliding-scale
                fees based on income. Ask the billing department directly.
              </TipItem>
              <TipItem>
                <strong>Negotiate a payment plan.</strong> Even if the total
                cannot be reduced, most providers offer interest-free payment
                plans. Always ask before putting medical debt on a credit card.
              </TipItem>
              <TipItem>
                <strong>Check for billing errors.</strong> Studies show up to
                80% of medical bills contain errors. Look for duplicate
                charges, incorrect codes, services you did not receive, and
                charges for items that should be included in a bundled rate.
              </TipItem>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Use{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  MedCostCheck
                </Link>{" "}
                to look up the Medicare rate for your procedure before
                negotiating. Knowing the baseline cost gives you leverage when
                discussing your bill.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Affiliate Disclosure */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
            Some links on this page are affiliate links. We may earn a
            commission if you sign up through them at no extra cost to you. This
            helps keep MedCostCheck free. We only recommend services we believe
            provide genuine value.
          </p>
        </div>
      </section>
    </>
  );
}
