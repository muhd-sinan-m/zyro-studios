import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services",
          "/work",
          "/about",
          "/process",
          "/contact",
          "/favicon/",
          "/img/",
          "/logo/",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/admin/*",
          "/api/*",
          "/_next/*",
          "/scratch/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/admin/*",
          "/api/*",
          "/_next/*",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
