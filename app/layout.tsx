import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AdSenseScript } from "@/components/AdSense";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.medcostcheck.com"),
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
      <body
        className={`${geist.variable} ${geistMono.variable} ${geist.className} min-h-screen flex flex-col antialiased bg-canvas text-ink`}
      >
        <GoogleAnalytics />
        <Header />

        <main className="flex-1 anim-fade">{children}</main>

        <footer className="mt-8 border-t border-[var(--hairline)] bg-canvas">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">
              <div>
                <p className="font-semibold tracking-tight text-ink text-[1.05rem] mb-3">
                  MedCostCheck
                </p>
                <p className="text-muted leading-relaxed">
                  Independent cost tool. 2026 Medicare Physician Fee Schedule
                  — physician allowed amounts, not hospital bills. Not medical
                  advice.
                </p>
                <p className="mt-4">
                  <a href="mailto:contact@medcostcheck.com" className="link">
                    contact@medcostcheck.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-faint mb-4">
                  Browse
                </h3>
                <ul className="space-y-2.5 text-muted">
                  <li>
                    <Link href="/procedures" className="hover:text-ink transition-colors">
                      All Procedures
                    </Link>
                  </li>
                  <li>
                    <Link href="/states" className="hover:text-ink transition-colors">
                      Costs by State
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="hover:text-ink transition-colors">
                      Billing &amp; Cost Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/glossary" className="hover:text-ink transition-colors">
                      Billing Glossary
                    </Link>
                  </li>
                  <li>
                    <Link href="/save" className="hover:text-ink transition-colors">
                      Ways to Save
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-ink transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/editorial-policy" className="hover:text-ink transition-colors">
                      Editorial Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-ink transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-ink transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-ink transition-colors">
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-faint mb-4">
                  Data source
                </h3>
                <p className="text-muted leading-relaxed">
                  Prices based on the 2026 Medicare Physician Fee Schedule
                  published by the Centers for Medicare & Medicaid Services
                  (CMS). Medicare rates are a baseline; private insurance and
                  self-pay rates vary.
                </p>
              </div>
            </div>
            <p className="mt-14 pt-6 border-t border-[var(--hairline)] text-xs text-faint leading-relaxed max-w-3xl">
              Prices shown are Medicare reimbursement rates and do not represent
              actual charges. Always verify costs with your provider and
              insurance company.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
