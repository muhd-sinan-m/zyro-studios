import type { Metadata } from "next";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Freelance Web Developer Portfolio & Client Projects",
  description:
    "Explore real-world client projects, educational platforms (such as PyQ Portal), and custom web applications engineered by Zyro Studios at affordable freelance rates.",
  path: "/work",
  keywords: [
    "freelance web developer portfolio",
    "cheap freelance developer projects",
    "Next.js web developer showcase",
    "affordable web development case studies",
    "pyq portal educational platform",
    "freelance react developer samples",
  ],
});

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
