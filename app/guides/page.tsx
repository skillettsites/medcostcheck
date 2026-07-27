import type { Metadata } from "next";
import Link from "next/link";
import { guides, type Guide } from "@/lib/guides";
import { insuranceGuides } from "@/lib/guides-insurance";
import { savingsGuides } from "@/lib/guides-savings";

export const metadata: Metadata = {
  title: "Guides to Medical Costs & Billing",
  description:
    "Plain-English guides to US medical billing: how to read an EOB, negotiate a bill, avoid facility fees, use the No Surprises Act, and pay for care without insurance.",
  alternates: { canonical: "/guides" },
};

function GuideGrid({ items }: { items: Guide[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((g) => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
        >
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
            {g.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed flex-1">
            {g.description}
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
            <span>{g.readingTime}</span>
            <span>&middot;</span>
            <span>Updated {g.updated}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function GuidesPage() {
  const clusters = [
    {
      title: "Billing Basics",
      blurb:
        "How the US medical billing system actually works, from CPT codes to the No Surprises Act.",
      items: guides,
    },
    {
      title: "Insurance & Coverage",
      blurb:
        "What your plan really pays, what it does not, and how to avoid the coverage traps that create big bills.",
      items: insuranceGuides,
    },
    {
      title: "Bills, Debt & Saving Money",
      blurb:
        "Reviewing, negotiating, and reducing bills you already have, and shopping smarter for care you have not had yet.",
      items: savingsGuides,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Guides to Medical Costs &amp; Billing
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl">
          Medical bills are confusing by design. These plain-English guides,
          written and maintained by our{" "}
          <Link href="/editorial-policy" className="text-blue-600 hover:text-blue-800 font-medium">
            editorial team
          </Link>
          , explain how US medical billing actually works and how to pay less,
          whether you are insured, on Medicare, or paying cash. Unsure what a
          term means? Check the{" "}
          <Link href="/glossary" className="text-blue-600 hover:text-blue-800 font-medium">
            billing glossary
          </Link>
          .
        </p>
      </div>

      <div className="space-y-14">
        {clusters.map((c) => (
          <section key={c.title}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              {c.title}
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-2xl">{c.blurb}</p>
            <GuideGrid items={c.items} />
          </section>
        ))}
      </div>

      <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">
          Ready to look up a procedure cost?
        </h2>
        <p className="text-blue-100 mb-4">
          Search 7,500+ procedures with Medicare-based pricing for your ZIP code.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors"
        >
          Search Procedures
        </Link>
      </div>
    </div>
  );
}
