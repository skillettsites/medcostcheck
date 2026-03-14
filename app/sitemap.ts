import { MetadataRoute } from "next";
import {
  getAllStates,
  getStateName,
  getPopularProcedures,
  stateToSlug,
  procedureToSlug,
} from "@/lib/medicare";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.medcostcheck.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/procedures`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/save`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // State index pages
  const states = getAllStates().filter((s) => {
    const name = getStateName(s);
    return name !== s && s !== "PR" && s !== "VI";
  });

  const statePages: MetadataRoute.Sitemap = states.map((abbr) => ({
    url: `${baseUrl}/state/${stateToSlug(getStateName(abbr))}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // State + procedure pages
  const popular = getPopularProcedures();
  const stateProcedurePages: MetadataRoute.Sitemap = [];
  for (const abbr of states) {
    for (const proc of popular) {
      stateProcedurePages.push({
        url: `${baseUrl}/state/${stateToSlug(getStateName(abbr))}/${procedureToSlug(proc.friendlyName)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...statePages, ...stateProcedurePages];
}
