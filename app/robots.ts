import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/r/", "/checkout/", "/api/"],
    },
    sitemap: "https://www.medcostcheck.com/sitemap.xml",
  };
}
