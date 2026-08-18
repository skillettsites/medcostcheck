import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const others = getAllGuides().filter((g) => g.slug !== slug).slice(0, 4);

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/guides" },
      { name: guide.title, url: `/guides/${slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `https://www.medcostcheck.com/guides/${slug}`,
      author: {
        "@type": "Organization",
        name: "MedCostCheck Editorial Team",
        url: "https://www.medcostcheck.com/editorial-policy",
      },
      publisher: {
        "@type": "Organization",
        name: "MedCostCheck",
        url: "https://www.medcostcheck.com",
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
      <JsonLd data={schema} />

      <nav className="flex items-center gap-2 text-sm text-faint mb-8 flex-wrap">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-ink transition-colors">Guides</Link>
        <span>/</span>
        <span className="text-muted">{guide.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="page-title mb-4">
            {guide.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
            <span>
              By the{" "}
              <Link href="/editorial-policy" className="link">
                MedCostCheck Editorial Team
              </Link>
            </span>
            <span>&middot;</span>
            <span>{guide.readingTime}</span>
            <span>&middot;</span>
            <span>Updated {guide.updated}</span>
          </div>
        </header>

        <div className="space-y-4 text-gray-700 leading-relaxed mb-10">
          {guide.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.heading}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="surface p-6 mb-12">
          <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">Key takeaways</h2>
          <ul className="space-y-2.5">
            {guide.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                <span className="text-faint shrink-0 mt-0.5">–</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <div className="border-t border-[var(--hairline)] pt-8 mb-10">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">More guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="surface lift p-4"
            >
              <h3 className="font-medium text-sm text-ink mb-1">
                {g.title}
              </h3>
              <p className="text-xs text-faint">{g.readingTime}</p>
            </Link>
          ))}
        </div>
      </div>

      <CtaBand
        title="Look up a procedure cost"
        body="Search 7,500+ procedures with Medicare-based pricing for your ZIP code."
        href="/"
        label="Search procedures"
      />

      <div className="text-xs text-gray-400 border-t border-gray-200 pt-5 mt-10">
        This guide is general information about US medical billing and costs,
        not medical, legal, or financial advice. Coverage rules vary by plan
        and state; always confirm details with your provider and insurer.
      </div>
    </div>
  );
}
