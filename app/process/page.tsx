import type { Metadata } from "next";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Fast & Affordable Web Development Process | 5 Stages",
  description:
    "Discover our streamlined 5-stage engineering workflow — rapid discovery, custom architecture, fast milestones, and zero-downtime deployment at affordable freelance rates.",
  path: "/process",
  keywords: [
    "web development workflow",
    "fast freelance web developer",
    "affordable web development process",
    "Next.js build timeline",
    "cheap freelance website turnaround",
    "freelance milestone development",
  ],
});

export default function ProcessPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Process", path: "/process" },
  ]);

  return (
    <div className="bg-[#030712] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProcessTimeline />
    </div>
  );
}
