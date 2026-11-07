import type { Metadata } from "next";
import { AboutStudio } from "@/components/sections/AboutStudio";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About Freelance Web Engineering Studio & Founder",
  description:
    "Learn about Zyro Studios — led by senior freelance full-stack developer Sinan. We bridge the gap between high-end digital agency quality and cheap, accessible freelance rates.",
  path: "/about",
  keywords: [
    "about Zyro Studios",
    "senior freelance web developer",
    "hire freelance engineer",
    "affordable web development studio",
    "freelance software engineer portfolio",
    "independent web developer cheap",
  ],
});

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="bg-[#030712] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutStudio />
    </div>
  );
}
