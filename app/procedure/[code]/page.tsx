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
import ZipPriceLookup from "@/components/ZipPriceLookup";
import JsonLd from "@/components/JsonLd";
import ProcedureEditorial from "@/components/ProcedureEditorial";
import ScopeNote from "@/components/ScopeNote";
import DataSourceNote from "@/components/DataSourceNote";
import { getProcedureContent } from "@/lib/procedure-content";
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from "@/lib/schema";
import { formatPrice, formatPriceRound } from "@/lib/format";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ zip?: string }>;
}

function getFriendlyName(code: string): string | undefined {
  return getPopularProcedures().find((p) => p.code === code)?.friendlyName;
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
    description: `2026 Medicare physician rate for ${name.toLowerCase()} (CPT ${code}): about $${price} nationally. Enter a ZIP for the locality-adjusted office vs hospital fee. Not a hospital bill or a quote.`,
    alternates: { canonical: `/procedure/${code}` },
  };
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
      <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${highlight ? "text-blue-200" : "text-gray-400"}`}>
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${highlight ? "" : "text-gray-900"}`}>{price}</div>
      {sublabel && (
        <div className={`text-xs mt-2 ${highlight ? "text-blue-200" : "text-gray-400"}`}>{sublabel}</div>
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
  const settingGap = Math.abs(nationalNonFac - nationalFac);
  const officeHigher = nationalNonFac > nationalFac;

  const name = friendlyName || proc.description;
  const nameLower = name.toLowerCase();
  const editorial = getProcedureContent(code);
  const workShare =
    proc.nonFacTotal > 0 ? Math.round((proc.workRvu / proc.nonFacTotal) * 100) : 0;
  const peShare =
    proc.nonFacTotal > 0 ? Math.round((proc.nonFacPeRvu / proc.nonFacTotal) * 100) : 0;

  const faqs = [
    {
      q: `How much does ${nameLower} (CPT ${code}) cost?`,
      a: priceResult
        ? `In ZIP ${zip} (${priceResult.locality}, ${getStateName(priceResult.state)}), the 2026 Medicare physician rate is ${formatPrice(priceResult.nonFacPrice)} in an office and ${formatPrice(priceResult.facPrice)} in a hospital. National unadjusted rates are ${formatPrice(nationalNonFac)} and ${formatPrice(nationalFac)}. These are allowed amounts for the professional fee only.`
        : `The 2026 national Medicare physician rate for CPT ${code} is ${formatPrice(nationalNonFac)} in an office and ${formatPrice(nationalFac)} in a hospital. Enter a ZIP code to apply the geographic adjustment for your locality.`,
    },
    {
      q: `Why is the office rate ${officeHigher ? "higher" : "different"} than the hospital physician rate?`,
      a:
        settingGap < 0.5
          ? `For CPT ${code} the office and hospital physician rates are essentially the same (${formatPrice(nationalNonFac)}). The hospital will still usually add a separate facility fee that this page does not show.`
          : `Medicare uses a different practice-expense RVU in a facility. For CPT ${code} that produces an office rate of ${formatPrice(nationalNonFac)} and a hospital physician rate of ${formatPrice(nationalFac)} (a ${formatPrice(settingGap)} gap). The hospital’s own facility charge is extra and often larger than this entire physician line.`,
    },
    {
      q: `What is CPT code ${code}?`,
      a: editorial
        ? `${editorial.whatItIs} CMS bills it as “${proc.description}.”`
        : `CPT ${code} is the Medicare billing code for “${proc.description}.” The fee schedule assigns work RVU ${proc.workRvu.toFixed(2)}, office practice-expense RVU ${proc.nonFacPeRvu.toFixed(2)}, and malpractice RVU ${proc.mpRvu.toFixed(2)}.`,
    },
    {
      q: `Does this include the whole bill?`,
      a: `No. ${formatPrice(nationalNonFac)} is the physician allowed amount. Anesthesia, facility fees, implants, imaging interpretation billed under a different code, and pathology are separate when they apply. Private-plan allowed amounts are often higher than Medicare; your deductible and coinsurance still apply.`,
    },
  ];

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Procedures", url: "/procedures" },
      { name, url: `/procedure/${code}` },
    ]),
    medicalWebPageSchema({
      name: `${name} Cost (CPT ${code}, 2026)`,
      description: `2026 Medicare physician rate for ${nameLower} (CPT ${code}), with office vs hospital pricing and ZIP-level GPCI adjustment.`,
      url: `/procedure/${code}`,
    }),
    faqSchema(faqs),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <Link href="/procedures" className="hover:text-blue-600 transition-colors">
          Procedures
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 2l4 4-4 4" />
        </svg>
        <span className="text-gray-700 font-medium">{code}</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {friendlyName || proc.description}
            </h1>
            {friendlyName && <p className="text-gray-500 mt-2 text-lg">{proc.description}</p>}
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shrink-0">
            CPT {code}
          </span>
        </div>
      </div>

      {priceResult ? (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">Medicare physician rate in {zip}</h2>
            <span className="text-sm bg-green-50 text-green-700 font-medium px-2.5 py-0.5 rounded-full border border-green-100">
              {getStateName(priceResult.state)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Locality: {priceResult.locality}. National office rate is {formatPrice(nationalNonFac)}.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceCard
              label="Medicare (Office)"
              price={formatPrice(priceResult.nonFacPrice)}
              sublabel="Non-facility physician fee"
              highlight
            />
            <PriceCard
              label="Medicare (Hospital)"
              price={formatPrice(priceResult.facPrice)}
              sublabel="Facility physician fee"
            />
            <PriceCard
              label="Private plan est."
              price={`${formatPriceRound(priceResult.estimatedPrivateInsurance.low)}–${formatPriceRound(priceResult.estimatedPrivateInsurance.high)}`}
              sublabel="~130–200% of Medicare"
            />
            <PriceCard
              label="Cash / self-pay est."
              price={`${formatPriceRound(priceResult.estimatedSelfPay.low)}–${formatPriceRound(priceResult.estimatedSelfPay.high)}`}
              sublabel="~80–150% of Medicare"
            />
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">National Medicare physician rate (2026)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceCard
              label="Medicare (Office)"
              price={formatPrice(nationalNonFac)}
              sublabel="Non-facility physician fee"
              highlight
            />
            <PriceCard
              label="Medicare (Hospital)"
              price={formatPrice(nationalFac)}
              sublabel="Facility physician fee"
            />
            <PriceCard
              label="Private plan est."
              price={`${formatPriceRound(nationalNonFac * 1.3)}–${formatPriceRound(nationalNonFac * 2)}`}
              sublabel="~130–200% of Medicare"
            />
            <PriceCard
              label="Cash / self-pay est."
              price={`${formatPriceRound(nationalNonFac * 0.8)}–${formatPriceRound(nationalNonFac * 1.5)}`}
              sublabel="~80–150% of Medicare"
            />
          </div>
          {hasZip && !priceResult && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 text-sm">
                ZIP {zip} is not in the CMS ZIP-to-locality file. Showing the national unadjusted rate.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
        <h2 className="text-xl font-bold mb-1">
          {priceResult ? "Try another ZIP" : "Get the rate for your ZIP"}
        </h2>
        <p className="text-blue-200 text-sm mb-5">
          CMS adjusts this CPT by locality. A five-digit ZIP is enough — no
          account, no insurance card.
        </p>
        <ZipPriceLookup code={code} initialZip={zip} />
      </div>

      <ScopeNote
        extra={
          settingGap >= 0.5
            ? `For this code the office and hospital physician lines differ by ${formatPrice(settingGap)}.`
            : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5">How CMS prices CPT {code}</h2>
          <div className="space-y-0">
            {[
              { label: "CMS description", value: proc.description },
              { label: "Work RVU", value: proc.workRvu.toFixed(2) },
              { label: "Practice expense RVU (office)", value: proc.nonFacPeRvu.toFixed(2) },
              { label: "Practice expense RVU (hospital)", value: proc.facPeRvu.toFixed(2) },
              { label: "Malpractice RVU", value: proc.mpRvu.toFixed(2) },
              { label: "Conversion factor", value: `$${CONVERSION_FACTOR}` },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 gap-4"
              >
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Work is about {workShare}% of the office total RVU; practice expense
            is about {peShare}%. Localities with a high PE GPCI move this code
            more when practice expense is a large share.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Office vs hospital for this code</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Office (non-facility) physician rate:{" "}
              <strong className="text-gray-900">{formatPrice(nationalNonFac)}</strong>.
              Hospital (facility) physician rate:{" "}
              <strong className="text-gray-900">{formatPrice(nationalFac)}</strong>.
            </p>
            <p>
              Medicare patients typically owe 20% of the allowed amount after
              the Part B deductible — about {formatPriceRound(nationalNonFac * 0.2)}{" "}
              for the office physician fee, before any Medigap coverage. That
              coinsurance does not include a hospital facility fee.
            </p>
            <p>
              Labeled private-plan and cash ranges on this page are arithmetic
              multiples of Medicare, not negotiated quotes. Ask the billing
              office for the CPT code, the site of service, and a good-faith
              estimate.
            </p>
          </div>
        </div>
      </div>

      {editorial ? (
        <ProcedureEditorial name={name} content={editorial} />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-12 text-sm text-gray-600 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 mb-3">This code is in the search tool</h2>
          <p>
            CPT {code} is a payable line in the 2026 fee schedule. We write
            longer explainers only for the {getPopularProcedures().length}{" "}
            featured procedures people look up most. The RVUs and ZIP math
            above are still the official CMS figures for this code.
          </p>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {name} (CPT {code}): questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-2">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8">
        For cash-pay surgery shopping, use this CPT as the Medicare floor when
        you compare written quotes.{" "}
        <Link href="/guides/surgery-cash-price-shopping" className="text-blue-600 font-bold hover:text-blue-800">
          How cash-price shopping works
        </Link>
        .
      </p>

      <DataSourceNote />
    </div>
  );
}
