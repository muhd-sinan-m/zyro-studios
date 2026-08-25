import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Start a Project | Contact Engineering Team",
  description:
    "Get in touch with Zyro Studios to discuss your web application, enterprise system, or software project. We respond within 24 hours.",
  openGraph: {
    title: "Start a Project | Contact Engineering Team | Zyro Studios",
    description:
      "Get in touch with Zyro Studios to discuss your web application, enterprise system, or software project. We respond within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#030712] min-h-screen">
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
