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

/**
 * Site-level identity for the homepage. The homepage carried no structured
 * data at all despite being the biggest page on the site by impressions, so
 * Google had nothing to attach a sitelinks search box or a knowledge entity to.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MedCostCheck",
    url: SITE,
    description:
      "Free US medical procedure cost lookup built on the 2026 Medicare Physician Fee Schedule and CMS hospital outpatient and surgery centre rates.",
    publisher: ORG,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/procedures?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    ...ORG,
    description:
      "Independent medical cost reference publishing Medicare allowed amounts for US procedures.",
    email: "contact@medcostcheck.com",
  };
}
