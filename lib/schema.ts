// Structured-data builders for MedCostCheck. Keep output minimal and accurate:
// schema must reflect what is actually on the page (Google penalises mismatches).
const SITE = "https://www.medcostcheck.com";
const ORG = {
  "@type": "Organization",
  name: "MedCostCheck",
  url: SITE,
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// MedicalWebPage is the correct type for medical cost/procedure information.
export function medicalWebPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE}${url}`,
    isPartOf: { "@type": "WebSite", name: "MedCostCheck", url: SITE },
    publisher: ORG,
    lastReviewed: "2026-06-01",
  };
}
