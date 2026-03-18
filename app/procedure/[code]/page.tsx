import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProcedure,
  getProcedurePrice,
  getPopularProcedures,
  getStateName,
  CONVERSION_FACTOR,
} from "@/lib/medicare";
import ProcedureSearch from "@/components/ProcedureSearch";

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ zip?: string }>;
}

function getFriendlyName(code: string): string | undefined {
  const popular = getPopularProcedures();
  return popular.find((p) => p.code === code)?.friendlyName;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const { zip } = await searchParams;
  const proc = getProcedure(code);
  if (!proc) return { title: "Procedure Not Found" };

  const friendly = getFriendlyName(code);
  const name = friendly || proc.description;
  const zipText = zip ? ` in ${zip}` : "";
  const price = Math.round(proc.nonFacTotal * CONVERSION_FACTOR);

  return {
    title: `${name} Cost${zipText} (${code})`,
    description: `How much does ${name.toLowerCase()} cost${zipText}? Medicare rate: $${price}. Compare office vs hospital pricing. CPT code ${code}. Free lookup powered by 2026 Medicare data.`,
  };
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPriceRound(price: number): string {
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function PriceCard({
  label,
  price,
  sublabel,
  highlight,
}: {
  label: string;
  price: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 text-center transition-shadow ${
        highlight
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${highlight ? "text-blue-200" : "text-gray-400"}`}>{label}</div>
      <div className={`text-3xl font-extrabold ${highlight ? "" : "text-gray-900"}`}>
        {price}
      </div>
      {sublabel && (
        <div className={`text-xs mt-2 ${highlight ? "text-blue-200" : "text-gray-400"}`}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

export default async function ProcedurePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { zip } = await searchParams;

  const proc = getProcedure(code);
  if (!proc) notFound();

  const friendlyName = getFriendlyName(code);
  const hasZip = zip && /^\d{5}$/.test(zip);
  const priceResult = hasZip ? getProcedurePrice(code, zip) : null;

  const nationalNonFac = Math.round(proc.nonFacTotal * CONVERSION_FACTOR * 100) / 100;
  const nationalFac = Math.round(proc.facTotal * CONVERSION_FACTOR * 100) / 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4"/></svg>
        <Link href="/procedures" className="hover:text-blue-600 transition-colors">Procedures</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4"/></svg>
        <span className="text-gray-700 font-medium">{code}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {friendlyName || proc.description}
            </h1>
            {friendlyName && (
              <p className="text-gray-500 mt-2 text-lg">{proc.description}</p>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shrink-0">
            CPT {code}
          </span>
        </div>
      </div>

      {/* ZIP-specific pricing */}
      {priceResult ? (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">
              Cost in {zip}
            </h2>
            <span className="text-sm bg-green-50 text-green-700 font-medium px-2.5 py-0.5 rounded-full border border-green-100">
              {getStateName(priceResult.state)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Medicare locality: {priceResult.locality}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceCard
              label="Medicare (Office)"
              price={formatPrice(priceResult.nonFacPrice)}
              sublabel="Non-facility rate"
              highlight
            />
            <PriceCard
              label="Medicare (Hospital)"
              price={formatPrice(priceResult.facPrice)}
              sublabel="Facility rate"
            />
            <PriceCard
              label="Private Insurance Est."
              price={`${formatPriceRound(priceResult.estimatedPrivateInsurance.low)} - ${formatPriceRound(priceResult.estimatedPrivateInsurance.high)}`}
              sublabel="130-200% of Medicare"
            />
            <PriceCard
              label="Self-Pay / Cash Est."
              price={`${formatPriceRound(priceResult.estimatedSelfPay.low)} - ${formatPriceRound(priceResult.estimatedSelfPay.high)}`}
              sublabel="80-150% of Medicare"
            />
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            National Average Cost (2026)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceCard
              label="Medicare (Office)"
              price={formatPrice(nationalNonFac)}
              sublabel="Non-facility rate"
              highlight
            />
            <PriceCard
              label="Medicare (Hospital)"
              price={formatPrice(nationalFac)}
              sublabel="Facility rate"
            />
            <PriceCard
              label="Private Insurance Est."
              price={`${formatPriceRound(nationalNonFac * 1.3)} - ${formatPriceRound(nationalNonFac * 2)}`}
              sublabel="130-200% of Medicare"
            />
            <PriceCard
              label="Self-Pay / Cash Est."
              price={`${formatPriceRound(nationalNonFac * 0.8)} - ${formatPriceRound(nationalNonFac * 1.5)}`}
              sublabel="80-150% of Medicare"
            />
          </div>
          {!hasZip && (
            <div className="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-blue-900 text-sm font-bold mb-1">
                    Enter your ZIP code for local pricing
                  </p>
                  <p className="text-blue-700/80 text-sm">
                    Medical costs vary significantly by location. Use the search below to see prices adjusted for your area.
                  </p>
                </div>
              </div>
            </div>
          )}
          {hasZip && !priceResult && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 text-sm">
                ZIP code {zip} was not found in the Medicare locality database.
                Showing national average prices instead.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search for local pricing */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
        <h2 className="text-xl font-bold mb-1">
          {priceResult ? "Check another location" : "Get local pricing"}
        </h2>
        <p className="text-blue-200 text-sm mb-5">
          Enter your ZIP code and search to see costs in your area
        </p>
        <ProcedureSearch zip={zip} />
      </div>

      {/* Procedure details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Procedure Details
          </h2>
          <div className="space-y-0">
            {[
              { label: "CPT Code", value: code, mono: true },
              { label: "Description", value: proc.description },
              { label: "Work RVU", value: proc.workRvu.toFixed(2) },
              { label: "Practice Expense RVU (Office)", value: proc.nonFacPeRvu.toFixed(2) },
              { label: "Practice Expense RVU (Hospital)", value: proc.facPeRvu.toFixed(2) },
              { label: "Malpractice RVU", value: proc.mpRvu.toFixed(2) },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className={`text-sm font-semibold text-gray-900 ${row.mono ? "font-mono" : ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Understanding the Cost
          </h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">Medicare rate</strong> is the amount Medicare
              pays providers. If you have Medicare, you typically pay 20% of
              this amount after your deductible.
            </p>
            <p>
              <strong className="text-gray-900">Private insurance</strong> plans
              negotiate their own rates, typically 130-200% of Medicare. Your
              out-of-pocket cost depends on your deductible, copay, and coinsurance.
            </p>
            <p>
              <strong className="text-gray-900">Self-pay/cash</strong> prices
              vary widely. Many providers offer cash discounts of 20-40% off
              their standard charges. Always ask about cash pricing.
            </p>
            <p>
              <strong className="text-gray-900">Office vs Hospital</strong>: the
              same procedure often costs less in a doctor's office than a
              hospital, because hospitals charge a separate facility fee.
            </p>
          </div>
        </div>
      </div>

      {/* Ways to save */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          Ways to Save on This Procedure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Compare Insurance Plans",
              desc: "Uninsured? Comparing marketplace plans could save you thousands on procedures like this.",
              link: "https://www.ehealthinsurance.com/",
              cta: "Compare plans on eHealth",
            },
            {
              title: "Try Telehealth First",
              desc: "Many consultations can be done virtually for $50-100, saving hundreds vs an in-person visit.",
              link: "https://sesamecare.com/",
              cta: "Book on Sesame Care",
            },
            {
              title: "Save on Prescriptions",
              desc: "If this procedure leads to a prescription, check discount cards for up to 80% savings.",
              link: "https://www.goodrx.com/",
              cta: "Check prices on GoodRx",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-blue-100/50 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
              <a
                href={item.link} /* AFFILIATE: swap URL when approved */
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.cta} &rarr;
              </a>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-100/50">
          <p className="text-[10px] text-gray-400">
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
          <Link href="/save" className="text-xs text-blue-600 hover:text-blue-800 font-bold">
            More ways to save &rarr;
          </Link>
        </div>
      </div>

      {/* Data source */}
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-5">
        Data source: 2026 Medicare Physician Fee Schedule (CMS PPRRVU26B,
        released March 2026). Conversion factor: ${CONVERSION_FACTOR}. Prices
        shown are Medicare allowed amounts and may not reflect actual charges.
        Private insurance and self-pay estimates are approximations based on
        industry averages.
      </div>
    </div>
  );
}
