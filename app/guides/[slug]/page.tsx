import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import JsonLd from "@/components/JsonLd";
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
      publisher: {
        "@type": "Organization",
        name: "MedCostCheck",
        url: "https://www.medcostcheck.com",
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <JsonLd data={schema} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <Link href="/guides" className="hover:text-blue-600 transition-colors">Guides</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4" /></svg>
        <span className="text-gray-700 font-medium">{guide.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {guide.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
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

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Key takeaways</h2>
          <ul className="space-y-2.5">
            {guide.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* Related guides */}
      <div className="border-t border-gray-200 pt-8 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">More guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                {g.title}
              </h3>
              <p className="text-xs text-gray-500">{g.readingTime}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Look up a procedure cost</h2>
        <p className="text-blue-100 text-sm mb-4">
          Search 7,500+ procedures with Medicare-based pricing for your ZIP code.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors text-sm"
        >
          Search Procedures
        </Link>
      </div>

      <div className="text-xs text-gray-400 border-t border-gray-200 pt-5 mt-10">
        This guide is general information about US medical billing and costs,
        not medical, legal, or financial advice. Coverage rules vary by plan
        and state; always confirm details with your provider and insurer.
      </div>
    </div>
  );
}
