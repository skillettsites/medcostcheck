import type { Metadata } from "next";
import Link from "next/link";
import { getAllTerms } from "@/lib/glossary";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Medical Billing Glossary",
  description:
    "Plain-English definitions of the medical billing and insurance terms on your bills and EOBs: allowed amount, coinsurance, facility fee, CPT code, and dozens more.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const terms = getAllTerms();

  // Group terms by first letter for the A-Z index
  const groups = new Map<string, typeof terms>();
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(t);
    groups.set(letter, list);
  }
  const letters = Array.from(groups.keys()).sort();

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Glossary", url: "/glossary" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Medical Billing Glossary",
      url: "https://www.medcostcheck.com/glossary",
      hasDefinedTerm: terms.map((t) => ({
        "@type": "DefinedTerm",
        name: t.term,
        description: t.definition[0],
      })),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={schema} />

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Medical Billing Glossary
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          The {terms.length} terms that appear on US medical bills, EOBs, and
          insurance documents, defined in plain English with notes on why each
          one matters to what you pay.
        </p>
      </div>

      {/* A-Z jump nav */}
      <nav className="flex flex-wrap gap-2 mb-10 sticky top-16 bg-white/95 backdrop-blur-sm py-3 z-10 border-b border-gray-100">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-blue-700 mb-5 border-b border-gray-100 pb-2">
              {letter}
            </h2>
            <div className="space-y-6">
              {groups.get(letter)!.map((t) => (
                <div key={t.slug} id={t.slug} className="scroll-mt-32">
                  <h3 className="font-bold text-gray-900 mb-1.5">{t.term}</h3>
                  <div className="space-y-2">
                    {t.definition.map((p, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                  {t.related.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Related:{" "}
                      {t.related.map((r, i) => {
                        const rel = terms.find((x) => x.slug === r);
                        if (!rel) return null;
                        return (
                          <span key={r}>
                            {i > 0 && ", "}
                            <a href={`#${r}`} className="text-blue-500 hover:text-blue-700">
                              {rel.term}
                            </a>
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">
          Want the full picture on a bill you received?
        </h2>
        <p className="text-blue-100 text-sm mb-4">
          Our guides walk through EOBs, itemized bills, and negotiation step by step.
        </p>
        <Link
          href="/guides"
          className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors text-sm"
        >
          Browse the Guides
        </Link>
      </div>
    </div>
  );
}
