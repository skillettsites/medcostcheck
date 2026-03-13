import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AdSenseScript } from "@/components/AdSense";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MedCostCheck - Medical Procedure Cost Lookup",
    template: "%s | MedCostCheck",
  },
  description:
    "Free medical procedure cost lookup by ZIP code. Compare MRI, surgery, office visit, and lab test costs in your area. Powered by 2026 Medicare Fee Schedule data.",
  keywords: [
    "medical procedure cost",
    "how much does an MRI cost",
    "surgery cost estimator",
    "medical cost by zip code",
    "hospital price comparison",
    "Medicare fee schedule",
  ],
  openGraph: {
    siteName: "MedCostCheck",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <header className="bg-white border-b border-gray-200">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
                <circle cx="14" cy="14" r="13" className="fill-blue-50 stroke-blue-400" strokeWidth="1.5" />
                <path d="M10 14h8M14 10v8" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-extrabold text-blue-700 group-hover:text-blue-800 transition-colors">
                MedCostCheck
              </span>
            </Link>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/procedures" className="hover:text-blue-700">
                Procedures
              </Link>
              <Link href="/save" className="hover:text-blue-700">
                Ways to Save
              </Link>
              <Link href="/about" className="hover:text-blue-700">
                About
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="22" height="22" viewBox="0 0 28 28" fill="none" className="shrink-0">
                    <circle cx="14" cy="14" r="13" className="fill-blue-50 stroke-blue-400" strokeWidth="1.5" />
                    <path d="M10 14h8M14 10v8" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-semibold text-gray-900">MedCostCheck</span>
                </div>
                <p>
                  Free medical procedure cost estimates powered by the 2026
                  Medicare Physician Fee Schedule. Not medical advice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/procedures" className="hover:text-blue-700">
                      All Procedures
                    </Link>
                  </li>
                  <li>
                    <Link href="/save" className="hover:text-blue-700">
                      Ways to Save
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-blue-700">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-blue-700">
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Data Source
                </h3>
                <p>
                  Prices based on the 2026 Medicare Physician Fee Schedule
                  published by the Centers for Medicare & Medicaid Services
                  (CMS). Medicare rates are a baseline; private insurance and
                  self-pay rates vary.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
              Prices shown are Medicare reimbursement rates and do not represent
              actual charges. Always verify costs with your provider and
              insurance company.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
