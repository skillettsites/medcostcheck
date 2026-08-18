import type { Metadata } from "next";
import { getAllTerms } from "@/lib/glossary";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
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
    <div className="max-w-4xl mx-auto px-5 py-12 sm:py-16">
      <JsonLd data={schema} />

      <div className="mb-10">
        <h1 className="page-title mb-3">
          Medical Billing Glossary
        </h1>
        <p className="lede max-w-2xl">
          The {terms.length} terms that appear on US medical bills, EOBs, and
          insurance documents, defined in plain English with notes on why each
          one matters to what you pay.
        </p>
      </div>

      {/* A-Z jump nav */}
      <nav className="flex flex-wrap gap-1.5 mb-10 sticky top-12 sm:top-14 bg-canvas/90 backdrop-blur-xl py-3 z-10 border-b border-[var(--hairline)]">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-5 border-b border-[var(--hairline)] pb-2">
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
                            <a href={`#${r}`} className="link">
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

      <CtaBand
        title="Want the full picture on a bill you received?"
        body="Our guides walk through EOBs, itemized bills, and negotiation step by step."
        href="/guides"
        label="Browse the guides"
      />
    </div>
  );
}
