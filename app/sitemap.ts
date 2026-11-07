import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_CONFIG } from "@/lib/seo";
import { query } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Combine static and dynamic projects
  const projectSlugs = new Set<string>(
    projects.filter((p) => !p.isHidden).map((p) => p.slug)
  );

  try {
    const dbProjects = await query(
      `SELECT slug FROM public.projects WHERE is_hidden = false AND status != 'archived'`
    );
    if (Array.isArray(dbProjects)) {
      for (const row of dbProjects) {
        if (row?.slug) {
          projectSlugs.add(row.slug);
        }
      }
    }
  } catch {
    // Database fallback to static project list
  }

  const projectPages: MetadataRoute.Sitemap = Array.from(projectSlugs).map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
