import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides to Medical Costs & Billing",
  description:
    "Plain-English guides to US medical billing: how to read an EOB, negotiate a bill, avoid facility fees, use the No Surprises Act, and pay for care without insurance.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Guides to Medical Costs &amp; Billing
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl">
          Medical bills are confusing by design. These plain-English guides
          explain how US medical billing actually works and how to pay less,
          whether you are insured, on Medicare, or paying cash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
          >
            <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
              {g.title}
            </h2>
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

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
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
