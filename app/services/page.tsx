import type { Metadata } from "next";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Affordable Web Development Services & Low-Cost Packages",
  description:
    "Explore affordable freelance web engineering services: custom Next.js web applications, budget e-commerce stores, academic student portals, and fast landing pages at cheap, transparent prices.",
  path: "/services",
  keywords: [
    "affordable web development services",
    "cheap website development packages",
    "freelance web developer pricing",
    "budget custom web applications",
    "low cost ecommerce website development",
    "affordable Next.js developer services",
    "cheap student project development",
  ],
});

export default function ServicesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <div className="bg-[#030712] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WhatWeBuild />
    </div>
  );
}
