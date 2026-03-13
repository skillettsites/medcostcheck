import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProcedure,
  getProcedurePrice,
  getPopularProcedures,
  getStateName,
  CONVERSION_FACTOR,
} from "@/lib/medicare";
import ProcedureSearch from "@/components/ProcedureSearch";

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
      className={`rounded-lg p-6 text-center ${
        highlight
          ? "bg-blue-600 text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="text-sm font-medium mb-1 opacity-80">{label}</div>
      <div className={`text-3xl font-bold ${highlight ? "" : "text-gray-900"}`}>
        {price}
      </div>
      {sublabel && (
        <div className={`text-xs mt-1 ${highlight ? "text-blue-100" : "text-gray-500"}`}>
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

  // National average prices
  const nationalNonFac = Math.round(proc.nonFacTotal * CONVERSION_FACTOR * 100) / 100;
  const nationalFac = Math.round(proc.facTotal * CONVERSION_FACTOR * 100) / 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/procedures" className="hover:text-blue-600">Procedures</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{code}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {friendlyName || proc.description}
            </h1>
            {friendlyName && (
              <p className="text-gray-600 mt-1">{proc.description}</p>
            )}
          </div>
          <span className="text-sm font-mono bg-gray-100 text-gray-600 px-3 py-1 rounded">
            CPT {code}
          </span>
        </div>
      </div>

      {/* ZIP-specific pricing */}
      {priceResult ? (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-1">
            Cost in {zip} ({getStateName(priceResult.state)})
          </h2>
          <p className="text-sm text-gray-500 mb-4">
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
              label="Self-Pay/Cash Est."
              price={`${formatPriceRound(priceResult.estimatedSelfPay.low)} - ${formatPriceRound(priceResult.estimatedSelfPay.high)}`}
              sublabel="80-150% of Medicare"
            />
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
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
              label="Self-Pay/Cash Est."
              price={`${formatPriceRound(nationalNonFac * 0.8)} - ${formatPriceRound(nationalNonFac * 1.5)}`}
              sublabel="80-150% of Medicare"
            />
          </div>
          {!hasZip && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium mb-2">
                Enter your ZIP code for local pricing
              </p>
              <p className="text-blue-700 text-sm">
                Medical costs vary significantly by location. Enter your ZIP
                code above to see prices adjusted for your area.
              </p>
            </div>
          )}
          {hasZip && !priceResult && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                ZIP code {zip} was not found in the Medicare locality database.
                Showing national average prices instead.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search for local pricing */}
      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold mb-3">
          {priceResult ? "Check another location" : "Get local pricing"}
        </h2>
        <ProcedureSearch zip={zip} />
      </div>

      {/* Procedure details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Procedure Details</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500">CPT Code</td>
                <td className="py-2 text-right font-mono">{code}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500">Description</td>
                <td className="py-2 text-right">{proc.description}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500">Work RVU</td>
                <td className="py-2 text-right">{proc.workRvu.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500">Practice Expense RVU (Office)</td>
                <td className="py-2 text-right">{proc.nonFacPeRvu.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500">Practice Expense RVU (Hospital)</td>
                <td className="py-2 text-right">{proc.facPeRvu.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Malpractice RVU</td>
                <td className="py-2 text-right">{proc.mpRvu.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Understanding the Cost</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Medicare rate</strong> is the amount Medicare
              pays providers. If you have Medicare, you typically pay 20% of
              this amount after your deductible.
            </p>
            <p>
              <strong className="text-gray-900">Private insurance</strong> plans
              negotiate their own rates with providers, typically 130-200% of
              Medicare rates. Your out-of-pocket cost depends on your plan&rsquo;s
              deductible, copay, and coinsurance.
            </p>
            <p>
              <strong className="text-gray-900">Self-pay/cash</strong> prices
              vary widely. Many providers offer cash discounts of 20-40% off
              their standard charges. Always ask about cash pricing before your
              procedure.
            </p>
            <p>
              <strong className="text-gray-900">Office vs Hospital</strong>: the
              same procedure often costs less in a doctor&rsquo;s office than a
              hospital. The Medicare physician fee shown here is just one
              component; hospitals also charge a separate facility fee.
            </p>
          </div>
        </div>
      </div>

      {/* Data source */}
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-4">
        Data source: 2026 Medicare Physician Fee Schedule (CMS PPRRVU26B,
        released March 2026). Conversion factor: ${CONVERSION_FACTOR}. Prices
        shown are Medicare allowed amounts and may not reflect actual charges.
        Private insurance and self-pay estimates are approximations based on
        industry averages.
      </div>
    </div>
  );
}
