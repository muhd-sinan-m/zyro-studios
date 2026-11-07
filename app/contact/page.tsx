import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Hire Affordable Freelance Web Developer | Free Project Quote",
  description:
    "Get in touch with Zyro Studios for an instant, budget-friendly quote. Hire a senior freelance web developer for custom Next.js apps, e-commerce stores, and websites at cheap prices.",
  path: "/contact",
  keywords: [
    "hire cheap freelance web developer",
    "affordable web development quote",
    "freelance developer contact",
    "hire budget web developer",
    "custom web app estimate",
    "low cost freelance programmer quote",
  ],
});

export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="bg-[#030712] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactForm />

      <div className="section-container pb-24 text-center">
        <p className="text-slate-400 text-sm">
          Not ready to start yet?{" "}
          <Link href="/work" className="text-[#38bdf8] hover:text-[#38bdf8]/80 transition-colors font-medium inline-flex items-center gap-1">
            <span>View our work first</span>
            <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}
