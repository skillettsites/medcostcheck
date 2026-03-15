import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AdSenseScript } from "@/components/AdSense";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.medcostcheck.com'),
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
    url: "https://www.medcostcheck.com",
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
      <GoogleAnalytics />
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Header />

        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900 text-gray-400">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-sm">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="font-bold text-white text-lg">
                    Med<span className="text-blue-400">Cost</span>Check
                  </span>
                </div>
                <p className="leading-relaxed">
                  Free medical procedure cost estimates powered by the 2026
                  Medicare Physician Fee Schedule. Not medical advice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Browse</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/procedures" className="hover:text-white transition-colors">
                      All Procedures
                    </Link>
                  </li>
                  <li>
                    <Link href="/states" className="hover:text-white transition-colors">
                      Costs by State
                    </Link>
                  </li>
                  <li>
                    <Link href="/save" className="hover:text-white transition-colors">
                      Ways to Save
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Data Source</h3>
                <p className="leading-relaxed">
                  Prices based on the 2026 Medicare Physician Fee Schedule
                  published by the Centers for Medicare & Medicaid Services
                  (CMS). Medicare rates are a baseline; private insurance and
                  self-pay rates vary.
                </p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-xs text-center text-gray-500">
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
